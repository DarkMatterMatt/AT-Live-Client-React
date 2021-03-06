import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AsyncStorage, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { loadRouteData } from "./common/api";
import { ASTORAGE_KEY_ACTIVE_ROUTES, ASTORAGE_KEY_INACTIVE_ROUTES } from "./common/constants";
import WebSocketApi from "./common/WebSocketApi";
import MapScreen from "./nav-map/MapScreen";
import RoutesScreen from "./nav-routes/RoutesScreen";
import SettingsScreen from "./nav-settings/SettingsScreen";
import RouteData from "./types/RouteData";
import SearchRouteData from "./types/SearchRouteData";
import VehicleData from "./types/VehicleData";

const Tab = createMaterialBottomTabNavigator();

interface AppProps { }

interface AppState {
    activeRoutes: RouteData[];
    inactiveRoutes: RouteData[];
}

export default class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        activeRoutes: [],
        inactiveRoutes: [],
    }

    wsApi: WebSocketApi;

    constructor(props: AppProps) {
        super(props);

        this.wsApi = new WebSocketApi({
            onVehicleUpdate: this.onVehicleUpdate,
            subscriptions: this.state.activeRoutes.map(r => r.shortName),
        });

        this.loadPersistant(ASTORAGE_KEY_ACTIVE_ROUTES, []).then(data => {
            (data as RouteData[]).forEach(r => this.addRoute(r, r.color));
        });
        this.loadPersistant(ASTORAGE_KEY_INACTIVE_ROUTES, []).then(data => this.setInactiveRoutes(data as RouteData[]));
    }

    componentWillUnmount = () => {
        this.wsApi.close();
    }

    render = () => {
        const { activeRoutes, inactiveRoutes } = this.state;

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
                            addRoute={this.addRoute}
                            removeRoute={this.removeRoute}
                            updateRoute={this.updateRoute} />}
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

    savePersistant = async (key: string, obj: Record<string, any>) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(obj));
        }
        catch (e) {
            console.error("Failed storing object to AsyncStorage", key, obj, e);
        }
    }

    loadPersistant = async (key: string, defaultValue: any = null) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) {
                return defaultValue;
            }
            return JSON.parse(value);
        } catch (e) {
            console.error("Failed loading object from AsyncStorage", key, e);
            return defaultValue;
        }
    }

    setActiveRoutes = (activeRoutes: RouteData[]) => {
        this.setState({ activeRoutes });
        this.savePersistant(ASTORAGE_KEY_ACTIVE_ROUTES, activeRoutes);
    }

    setInactiveRoutes = (inactiveRoutes: RouteData[]) => {
        this.setState({ inactiveRoutes });
        this.savePersistant(ASTORAGE_KEY_INACTIVE_ROUTES, inactiveRoutes);
    }

    addRoute = async (newSR: SearchRouteData | RouteData, colorOverride?: string) => {
        const newR = await loadRouteData(newSR);
        if (newR === null) {
            console.error("Failed loading data for searchRoute", newSR);
            return;
        }

        // copy previously stored color and remove from inactive routes
        const prevR = this.state.inactiveRoutes.find(r => r.shortName === newR.shortName);
        if (prevR !== undefined) {
            newR.color = prevR.color;
            this.setInactiveRoutes(this.state.inactiveRoutes.filter(r => r !== prevR));
        }

        // used when reloading data from AsyncStorage
        if (colorOverride !== undefined) {
            newR.color = colorOverride;
        }

        this.setActiveRoutes([...this.state.activeRoutes, newR]);
        this.wsApi.subscribe(newR.shortName);
    }

    updateRoute = (oldR: RouteData, newR: RouteData) => {
        this.setActiveRoutes(this.state.activeRoutes.map(r => r === oldR ? newR : r));
    }

    removeRoute = (oldR: RouteData) => {
        this.setActiveRoutes(this.state.activeRoutes.filter(r => r !== oldR));
        this.setInactiveRoutes([...this.state.inactiveRoutes, oldR]);
        this.wsApi.unsubscribe(oldR.shortName);
    }

    onVehicleUpdate = (routeShortName: string, newV: VehicleData) => {
        const oldR = this.state.activeRoutes.find(r => r.shortName === routeShortName);
        if (oldR === undefined) {
            return;
        }
        const newR: RouteData = {
            ...oldR,
            vehicles: [...oldR.vehicles.filter(v => v.id !== newV.id), newV],
        };
        this.updateRoute(oldR, newR);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
});
