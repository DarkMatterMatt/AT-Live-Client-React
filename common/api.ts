import { LatLng } from "react-native-maps";
import RouteData from "../types/RouteData";
import SearchRouteData from "../types/SearchRouteData";
import TransitType from "../types/TransitType";
import { API_URL } from "../common/constants";

interface RoutesResponseLatLng {
    lat: number;
    lng: number;
}

interface RoutesResponseVehicle {
    position: RoutesResponseLatLng
    vehicleId: string;
    lastUpdatedUnix: number;
    directionId: 0 | 1;
}

interface RoutesResponse {
    agencyId: string;
    longName: string;
    longNames: string[];
    polylines: [RoutesResponseLatLng[], RoutesResponseLatLng[]?];
    routeIds: string[];
    shapeIds: string[];
    shortName: string;
    type: TransitType;
    vehicles: Record<string, RoutesResponseVehicle>;
}

interface RoutesFullResponse {
    status: "success" | "error";
    message: string;
    routes: Record<string, RoutesResponse>;
}

function RoutesResponseLatLng2LatLng(position: RoutesResponseLatLng): LatLng {
    return {
        latitude: position.lat,
        longitude: position.lng,
    };
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

    const newVehicles = Object.values(vehicles).map(v => ({
        id: v.vehicleId,
        timestamp: v.lastUpdatedUnix,
        direction: v.directionId,
        position: RoutesResponseLatLng2LatLng(v.position),
    }));

    const newPolylines: [LatLng[], LatLng[]?] = [
        polylines[0].map(RoutesResponseLatLng2LatLng),
        polylines[1]?.map(RoutesResponseLatLng2LatLng),
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
