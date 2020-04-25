import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapScreen from "./nav-map/MapScreen";
import RoutesScreen from "./nav-routes/RoutesScreen";
import SettingsScreen from "./nav-settings/SettingsScreen";
import RouteData from "./types/RouteData";
import SearchRouteData from "./types/SearchRouteData";
import { LatLng } from "react-native-maps";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    const [activeRoutes, setActiveRoutes] = useState<RouteData[]>([]);
    const [inactiveRoutes, setInctiveRoutes] = useState<RouteData[]>([]);
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Map"
                backBehavior="none" >
                <Tab.Screen
                    name="Map"
                    options={{
                        tabBarLabel: "Map",
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map" color={color} size={24} />,
                    }}>
                    {() => <MapScreen activeRoutes={activeRoutes} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Routes"
                    options={{
                        tabBarLabel: "Routes",
                        tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} size={24} />,
                    }} >
                    {() => <RoutesScreen
                        activeRoutes={activeRoutes}
                        addRoute={async newSR => { const newR = await loadRouteData(newSR); newR && setActiveRoutes([...activeRoutes, newR]) }}
                        removeRoute={oldR => setActiveRoutes(activeRoutes.filter(r => r !== oldR))}
                        updateRoute={(oldR, newR) => setActiveRoutes([...activeRoutes.filter(x => x !== oldR), newR])} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ color }) => <MaterialIcons name="settings" color={color} size={24} />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
});

interface RoutesResponseLatLng {
    lat: number;
    lng: number;
}

interface RoutesResponse {
    message: string;
    routes: Record<string, {
        vehicles: Record<string, {
            position: RoutesResponseLatLng
            vehicleId: string;
            lastUpdatedUnix: number;
            directionId: 0 | 1;
        }>;
        polylines: [RoutesResponseLatLng[], RoutesResponseLatLng[]?];
    }>;
}

function RoutesResponseLatLng2LatLng(position: RoutesResponseLatLng): LatLng {
    return {
        latitude: position.lat,
        longitude: position.lng,
    };
}

/**
 * loadSearchData fetches data to be displayed in the search list
 */
async function loadRouteData(searchRoute: SearchRouteData): Promise<RouteData | null> {
    const { shortName, longName, type, to, from } = searchRoute;

    try {
        // TODO: abstract this
        const { routes } = await fetch(`https://mattm.win/atlive/api/v1/routes?shortNames=${shortName}&fetch=vehicles,polylines`).then(r => r.json()) as RoutesResponse;
        if (routes[shortName] === undefined) {
            return null;
        }

        const { vehicles, polylines } = routes[shortName];

        const newVehicles = Object.entries(vehicles).map(([id, v]) => ({
            id,
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
    catch (err) {
        console.error(err);
        return null;
    }
}
