import React, { useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { AnimatedRegion, Marker } from "react-native-maps";
import { bezierBlend, clamp } from "../common/helpers";
import MarkerIcon from "../common/MarkerIcon";
import TransitType from "../types/TransitType";
import VehicleData from "../types/VehicleData";

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

interface VehicleMarkerProps {
    vehicle: VehicleData;
    zIndex?: number;
    color: string;
    type: TransitType;
}

export default function VehicleMarker({ vehicle, zIndex, type, color }: VehicleMarkerProps) {
    const { id, direction, timestamp, position } = vehicle;

    const lastIconProps = useRef("");
    const [lastPosition, setLastPosition] = useState(position);
    const coordinate = useRef(new AnimatedRegion({
        ...position,
        // never used, fix tsc warning
        latitudeDelta: 0,
        longitudeDelta: 0,
    }));

    // animate position changes
    if (lastPosition.latitude !== position.latitude || lastPosition.longitude !== position.longitude) {
        setLastPosition(position);

        // TODO: make duration a setting
        // Android should support non-JS animations using animateMarkerToCoordinate but it doesn't :(
        coordinate.current.timing({
            ...position,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
        }).start();
    }

    // TODO: change constants to setting variables
    let opacity = 1 - 0.7 * bezierBlend((Date.now() - timestamp - 20) / (90 - 20));
    opacity = clamp(0, 1, opacity);

    const dotFill = direction ? "#FFF" : "#000";

    // rerender marker if any props change
    let renderMarker = false;
    if (lastIconProps.current !== color + opacity + dotFill) {
        lastIconProps.current = color + opacity + dotFill;
        renderMarker = true;
    }

    // TODO: allow changing between marker icons and bus/rail/ferry icons
    return (
        <AnimatedMarker
            tracksViewChanges={renderMarker}
            style={{ zIndex }}
            identifier={id}
            coordinate={coordinate.current} >
            <MarkerIcon height={32} fill={color} dotFill={dotFill} opacity={opacity} />
        </AnimatedMarker>
    );
}
