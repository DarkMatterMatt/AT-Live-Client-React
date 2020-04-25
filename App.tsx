import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { loadRouteData } from "./common/api";
import MapScreen from "./nav-map/MapScreen";
import RoutesScreen from "./nav-routes/RoutesScreen";
import SettingsScreen from "./nav-settings/SettingsScreen";
import RouteData from "./types/RouteData";
import SearchRouteData from "./types/SearchRouteData";

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

    setActiveRoutes = (activeRoutes: RouteData[]) => {
        this.setState({ activeRoutes });
    }

    setInactiveRoutes = (inactiveRoutes: RouteData[]) => {
        this.setState({ inactiveRoutes });
    }

    addRoute = async (newSR: SearchRouteData) => {
        const newR = await loadRouteData(newSR);
        if (newR === null) {
            console.error("Failed loading data for searchRoute", newSR);
            return;
        }
        this.setActiveRoutes([...this.state.activeRoutes, newR]);
    }

    updateRoute = (oldR: RouteData, newR: RouteData) => {
        this.setActiveRoutes(this.state.activeRoutes.map(r => r === oldR ? newR : r));
    }

    removeRoute = (oldR: RouteData) => {
        this.setActiveRoutes(this.state.activeRoutes.filter(r => r !== oldR));
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
