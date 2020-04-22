import React, { useEffect, useState } from "react";
import MapView, { Region } from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import * as Location from "expo-location";
import VehicleMarker from "./VehicleMarker"
import RouteData from "../types/RouteData"
import RouteOnMap from "./RouteOnMap";

const { width, height } = Dimensions.get("window");

const AUCKLAND_REGION: Region = {
    latitude: -36.8588,
    longitude: 174.7641,
    latitudeDelta: 0.1439 * height / width,
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

    // TODO: support dark mode
    return (
        <MapView
            style={styles.mapView}
            customMapStyle={customMapStyles.light}
            ref={ref => setMap(ref)}
            initialRegion={region}
            onRegionChangeComplete={r => setRegion(r)}
            provider="google">
            {activeRoutes.map((r, i) => <RouteOnMap key={r.shortName} route={r} position={i} />)}
        </MapView>
    );
}

const styles = StyleSheet.create({
    mapView: {
        flexGrow: 1,
    },
});

const customMapStyles = {
    light: [
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }],
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }],
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }],
        },
    ],
    dark: [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#242f3e" }],
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }],
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#242f3e" }],
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }],
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }],
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }],
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }],
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#263c3f" }],
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#6b9a76" }],
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#38414e" }],
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#212a37" }],
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9ca5b3" }],
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#746855" }],
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#1f2835" }],
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#f3d19c" }],
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }],
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }],
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }],
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }],
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }],
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#17263c" }],
        },
    ],
}
