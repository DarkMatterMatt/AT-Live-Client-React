import { LatLng } from "react-native-maps";
import RouteData from "../types/RouteData";
import SearchRouteData from "../types/SearchRouteData";
import TransitType from "../types/TransitType";
import { API_URL } from "../common/constants";
import ApiResponseLatLng from "../types/ApiResponseLatLng";
import ApiResponseVehicle from "../types/ApiResponseVehicle";
import VehicleData from "../types/VehicleData";

interface RoutesResponse {
    agencyId: string;
    longName: string;
    longNames: string[];
    polylines: [ApiResponseLatLng[], ApiResponseLatLng[]?];
    routeIds: string[];
    shapeIds: string[];
    shortName: string;
    type: TransitType;
    vehicles: Record<string, ApiResponseVehicle>;
}

interface RoutesFullResponse {
    status: "success" | "error";
    message: string;
    routes: Record<string, RoutesResponse>;
}

export function apiResponseLatLng2LatLng(position: ApiResponseLatLng): LatLng {
    return {
        latitude: position.lat,
        longitude: position.lng,
    };
}

export function apiResponseVehicle2VehicleData(vehicle: ApiResponseVehicle): VehicleData {
    return {
        id: vehicle.vehicleId,
        timestamp: vehicle.lastUpdatedUnix,
        direction: vehicle.directionId,
        position: apiResponseLatLng2LatLng(vehicle.position),
    }
}

type QueryRoutesInfo = "shortName" | "longName" | "longNames" | "routeIds" | "shapeIds" | "vehicles" | "type" | "agencyId" | "polylines";

interface QueryRoutesParams {
    data?: QueryRoutesInfo | QueryRoutesInfo[];
    shortName?: string;
    shortNames?: string[];
}

async function queryRoutes({ data, shortName, shortNames = [] }: QueryRoutesParams) {
    const shortNamesStr = [...shortNames, shortName].join(",");
    let dataStr = typeof data === "string" ? data : data?.join(",");

    // ugly, React Native doesn't support URLSearchParams :(
    const params: Record<string, any> = {};
    if (shortNamesStr) {
        params.shortNames = shortNamesStr;
    }
    if (dataStr) {
        params.fetch = dataStr;
    }
    const paramsStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");

    try {
        const json = await fetch(`${API_URL}routes?${paramsStr}`)
            .then(r => r.json()) as RoutesFullResponse;

        if (json.status !== "success") {
            console.error("Failed fetching routes from API", json);
            return null;
        }

        return Object.values(json.routes);
    }
    catch (err) {
        console.error("Failed fetching routes from API", err);
        return null;
    }
}

/**
 * loadSearchData fetches data to be displayed in the search list
 */
export async function loadSearchData(): Promise<SearchRouteData[]> {
    const routes = await queryRoutes({ data: ["shortName", "longName", "type"] });
    if (routes === null) {
        // console.error called in queryRoutes
        return [];
    }

    const regexWord = /[a-z]+/g;

    return routes.map(({ shortName, longName, type }) => {
        const longNameLower = longName.toLowerCase();
        const longNameWords = longNameLower.match(regexWord)?.filter(w => !["to", "via", "and"].includes(w)) ?? [];

        // remove everything after "via", remove all parenthesized text, split on the word "to"
        const [to, from] = longName.replace(/ via .*/i, "").replace(/ *\([^)]*\)/g, "").split(" to ");

        return {
            shortName,
            shortNameLower: shortName.toLowerCase(),
            longName,
            longNameLower,
            longNameWords,
            type,
            to,
            from,
        }
    });
}

/**
 * loadRouteData fetches additional info to convert SearchRouteData into RouteData
 * @param searchRoute the search route to fetch additional data for
 */
export async function loadRouteData(searchRoute: SearchRouteData): Promise<RouteData | null> {
    const { shortName, longName, type, to, from } = searchRoute;

    const routes = await queryRoutes({ shortName, data: ["vehicles", "polylines"] });
    if (routes === null) {
        // console.error called in queryRoutes
        return null;
    }

    if (routes.length === 0) {
        console.error("Route missing in API response", searchRoute, routes);
        return null;
    }

    const [{ vehicles, polylines }] = routes;

    const newVehicles = Object.values(vehicles).map(apiResponseVehicle2VehicleData);

    const newPolylines: [LatLng[], LatLng[]?] = [
        polylines[0].map(apiResponseLatLng2LatLng),
        polylines[1]?.map(apiResponseLatLng2LatLng),
    ];

    return {
        shortName,
        longName,
        type,
        to,
        from,
        color: "red",
        vehicles: newVehicles,
        polylines: newPolylines,
    };
}

/**
 * loadVehicles fetches a snapshot of the currently active vehicles for the specified routes
 * @param shortNames the short names of the routes to load vehicles for
 */
export async function loadVehicles(shortNames: string[]): Promise<Record<string, VehicleData[]> | null> {
    const routes = await queryRoutes({ shortNames, data: "vehicles" });
    if (routes === null) {
        // console.error called in queryRoutes
        return null;
    }

    const result: Record<string, VehicleData[]> = {};
    routes.forEach(r => {
        result[r.shortName] = Object.values(r.vehicles).map(apiResponseVehicle2VehicleData);
    });
    
    return result;
}
