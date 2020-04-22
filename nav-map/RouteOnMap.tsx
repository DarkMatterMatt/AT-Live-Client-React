import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import VehicleMarker from "./VehicleMarker"
import RouteData from "../types/RouteData"
import { Polyline } from "react-native-maps";

interface RouteOnMapProps {
    route: RouteData;
    position: number;
}

const polylineWidth = 2.5;

export default function RouteOnMap({ route, position }: RouteOnMapProps) {
    const baseZIndex = position * 4;
    const [line0, line1] = route.polylines;

    return (
        <>
            <Polyline
                coordinates={line0}
                strokeColor="#000"
                strokeWidth={polylineWidth}
                zIndex={baseZIndex + 0}
            />
            <Polyline
                coordinates={line0}
                strokeColor={route.color}
                strokeWidth={polylineWidth}
                zIndex={baseZIndex + 2}
            />
            {line1 && (
                <>
                    <Polyline
                        coordinates={line1}
                        strokeColor="#FFF"
                        strokeWidth={polylineWidth}
                        zIndex={baseZIndex + 1}
                    />
                    <Polyline
                        coordinates={line1}
                        strokeColor={route.color}
                        strokeWidth={polylineWidth}
                        zIndex={baseZIndex + 3}
                    />
                </>
            )}
            {route.vehicles.map(v =>
                <VehicleMarker
                    key={v.id}
                    zIndex={baseZIndex + 4}
                    type={route.type}
                    color={route.color}
                    vehicle={v} />
            )}
        </>
    );
}
