import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MapScreen from "./nav-map/MapScreen"
import RoutesScreen from "./nav-routes/RoutesScreen"
import SettingsScreen from "./nav-settings/SettingsScreen"
import RouteData from "./types/RouteData";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    const [activeRoutes, setActiveRoutes] = useState<RouteData[]>([]);
    const [inactiveRoutes, setInctiveRoutes] = useState<RouteData[]>([]);
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Map"
                backBehavior="initialRoute">
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
                    component={RoutesScreen}
                    options={{
                        tabBarLabel: "Routes",
                        tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} size={24} />,
                    }}
                />
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
