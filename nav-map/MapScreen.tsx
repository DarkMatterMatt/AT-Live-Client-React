import React, { useEffect, useState } from "react";
import MapView, { Region } from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import VehicleMarker from "./VehicleMarker"
import RouteData from "../types/RouteData"
import Route from "./Route";

const { width, height } = Dimensions.get("window");

const AUCKLAND_REGION: Region = {
    latitude: -36.8588,
    longitude: 174.7641,
    latitudeDelta: 0.1439 * height/width,
    longitudeDelta: 0.1439,
};

interface MapScreenProps {
    activeRoutes: RouteData[];
}

export default function MapScreen({ activeRoutes }: MapScreenProps) {
    const [region, setRegion] = useState(AUCKLAND_REGION);
    const [queuedRegion, animateToRegion] = useState<Region | null>(null);
    const [map, setMap] = useState<MapView | null>(null);

    useEffect(() => {
        (async () => {
            // TODO: make this a setting
            // check if user has already moved the map
            if (region !== AUCKLAND_REGION) return;

            let { status } = await Location.requestPermissionsAsync();
            if (status === "granted") {
                try {
                    const pos = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = pos.coords;
                    const { latitudeDelta, longitudeDelta } = region;
                    animateToRegion({
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta,
                    });
                }
                catch (e) {
                    // catch error when permission is granted while application is in use,
                    //   and the OS thinks we don't have permission yet
                }
            }
        })();
    }, ["runOnce"]);

    if (map !== null && queuedRegion !== null) {
        map.animateToRegion(queuedRegion);
        animateToRegion(null);
    }

    return (
        <MapView
            style={styles.mapStyle}
            ref={ref => setMap(ref)}
            initialRegion={region}
            onRegionChangeComplete={r => setRegion(r)}
            provider="google">
            { activeRoutes.map(r => <Route key={r.shortName} route={r} />) }
        </MapView>
    );
}

const styles = StyleSheet.create({
    mapStyle: {
        flexGrow: 1,
    },
});
