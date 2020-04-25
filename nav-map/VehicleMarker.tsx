import React, { useState, useRef } from "react";
import { Marker, LatLng } from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform, ImageURISource } from "react-native";
import { encode } from "base-64";
import VehicleData from "../types/VehicleData";
import TransitType from "../types/TransitType";
import MarkerIcon from "../common/MarkerIcon";
import { bezierBlend, clamp } from "../common/helpers";

interface VehicleMarkerProps {
    vehicle: VehicleData;
    zIndex?: number;
    color: string;
    type: TransitType;
}

export default function VehicleMarker({ vehicle, zIndex, type, color }: VehicleMarkerProps) {
    const lastIconProps = useRef("");

    // TODO: change constants to setting variables
    let opacity = 1 - 0.7 * bezierBlend((Date.now() - vehicle.timestamp - 20) / (90 - 20));
    opacity = clamp(0, 1, opacity);

    const dotFill = vehicle.direction ? "#FFF" : "#000";

    // rerender marker if any props change
    let renderMarker = false;
    if (lastIconProps.current !== color + opacity + dotFill) {
        lastIconProps.current = color + opacity + dotFill;
        renderMarker = true;
    }

    // TODO: allow changing between marker icons and bus/rail/ferry icons
    return (
        <Marker
            tracksViewChanges={renderMarker}
            zIndex={zIndex}
            identifier={vehicle.id}
            coordinate={vehicle.position} >
            <MarkerIcon height={32} fill={color} dotFill={dotFill} opacity={opacity} />
        </Marker>
    );
}
