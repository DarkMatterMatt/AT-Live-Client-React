import React from "react";
import { Marker, LatLng } from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform, ImageURISource } from "react-native";
import { encode } from "base-64";
import VehicleData from "../types/VehicleData";
import TransitType from "../types/TransitType";
import MarkerIcon from "../common/MarkerIcon";

/**
 * Calculates a bezier blend curve
 * @param t position on the curve, 0 <= t <= 1
 */
function bezierBlend(t: number): number {
    return t * t * (3 - 2 * t);
}

/**
 * Clamps a number into a range between min and max (inclusive)
 * @param min the lowest number that val can be
 * @param max the highest number that val can be
 * @param val the value to clamp
 */
function clamp(min: number, max: number, val: number) {
    if (val > max) {
        return max;
    }
    if (val < min) {
        return min;
    }
    return val;
}

interface VehicleMarkerProps {
    vehicle: VehicleData;
    zIndex?: number;
    color: string;
    type: TransitType;
}

export default function VehicleMarker({ vehicle, zIndex, type, color }: VehicleMarkerProps) {
    // TODO: change constants to setting variables
    let opacity = 1 - 0.7 * bezierBlend((Date.now() - vehicle.timestamp - 20) / (90 - 20));
    opacity = clamp(0, 1, opacity);

    // TODO: allow changing between marker icons and bus/rail/ferry icons
    return (
        <Marker
            tracksViewChanges={false}
            zIndex={zIndex}
            identifier={vehicle.id}
            coordinate={vehicle.position} >
            <MarkerIcon height={32} fill={color} dotFill={vehicle.direction ? "#FFF" : "#000"} opacity={opacity} />
        </Marker>
    );
}
