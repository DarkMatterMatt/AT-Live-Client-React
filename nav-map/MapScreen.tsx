import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import VehicleMarker from "./VehicleMarker"
import RouteData from "../types/RouteData"
import Route from "./Route";

const AUCKLAND_COORDS = {
    latitude: -37.028454,
    longitude: 174.921419,
    latitudeDelta: 0.218087,
    longitudeDelta: 0.264047,
};

interface MapScreenProps {
    activeRoutes: RouteData[];
}

export default function MapScreen({ activeRoutes }: MapScreenProps) {
    const [region, setRegion] = useState(AUCKLAND_COORDS);
    const [map, setMap] = useState<MapView | null>(null);

    useEffect(() => {
        (async () => {
            // check if user has already moved the map
            if (region !== AUCKLAND_COORDS) return;

            let { status } = await Location.requestPermissionsAsync();
            if (status === "granted") {
                try {
                    const pos = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = pos.coords;
                    const { latitudeDelta, longitudeDelta } = region;
                    setRegion({
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

    return (
        <MapView
            style={styles.mapStyle}
            ref={ref => setMap(ref)}
            region={region}
            onRegionChangeComplete={r => setRegion(r)}
            provider="google"
            followsUserLocation={true}>
            { activeRoutes.map(r => <Route key={r.shortName} route={r} />) }
        </MapView>
    );
}

const styles = StyleSheet.create({
    mapStyle: {
        flexGrow: 1,
    },
});
