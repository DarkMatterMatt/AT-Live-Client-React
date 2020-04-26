import ApiResponseVehicle from "../types/ApiResponseVehicle";
import VehicleData from "../types/VehicleData";
import { apiResponseVehicle2VehicleData, loadVehicles } from "./api";
import { API_WS_URL, WS_CLOSE_NO_RECONNECT } from "./constants";

interface WebSocketMessage extends Record<string, any> {
    status: "success" | "error";
    message: string;
    route: "ping" | "live/vehicle";
}

interface WebSocketApiProps {
    subscriptions: string[];
    onVehicleUpdate: (routeShortName: string, vehicle: VehicleData) => void;
}

export default class WebSocketApi {
    private ws: WebSocket | null = null;

    private wsHeartbeatInterval: number = 0;

    private subscribed: string[];

    onVehicleUpdate: (routeShortName: string, vehicle: VehicleData) => void;

    constructor({ onVehicleUpdate, subscriptions }: WebSocketApiProps) {
        this.onVehicleUpdate = onVehicleUpdate;
        this.subscribed = subscriptions;
        this.connect();
    }

    loadVehicleSnapshot = async () => {
        const response = await loadVehicles(this.subscribed);
        if (response === null) {
            return;
        }

        Object.entries(response).forEach(
            ([routeShortName, vehicles]) => vehicles.forEach(v => this.onVehicleUpdate(routeShortName, v))
        );
    }

    connect = () => {
        // do one initial load of all vehicles
        this.loadVehicleSnapshot();

        this.ws = new WebSocket(API_WS_URL);

        this.ws.addEventListener("open", ev => {
            console.log("WebSocket connected");

            // resubscribe to routes
            this.subscribed.forEach(shortName => {
                this.ws?.send(JSON.stringify({
                    route: "subscribe",
                    shortName,
                }));
            });

            // send a heartbeat every 5 seconds
            this.wsHeartbeatInterval = setInterval(() => {
                this.ws?.send(JSON.stringify({ route: "ping" }));
            }, 5000);
        });

        this.ws.addEventListener("close", ev => {
            if (ev.code !== WS_CLOSE_NO_RECONNECT) {
                console.warn("Reconnecting WebSocket", ev);
                setTimeout(this.connect, 500);
            }
            this.ws = null;
            clearInterval(this.wsHeartbeatInterval);
        });

        this.ws.addEventListener("message", ev => {
            const data = JSON.parse(ev.data) as WebSocketMessage;
            if (data.route === "live/vehicle") {
                const vehicle = apiResponseVehicle2VehicleData((data as unknown) as ApiResponseVehicle);
                this.onVehicleUpdate(data.shortName as string, vehicle);
            }
        });
    }

    subscribe = (shortName: string) => {
        if (this.subscribed.includes(shortName)) {
            return;
        }
        this.subscribed.push(shortName);

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws?.send(JSON.stringify({
                route: "subscribe",
                shortName,
            }));
        }
    }

    unsubscribe = (shortName: string) => {
        if (!this.subscribed.includes(shortName)) {
            return;
        }
        this.subscribed.splice(this.subscribed.indexOf(shortName), 1);

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws?.send(JSON.stringify({
                route: "unsubscribe",
                shortName,
            }));
        }
    }

    close = () => {
        this.ws?.close(WS_CLOSE_NO_RECONNECT, "Close method called on WebSocketApi");
    }
}
