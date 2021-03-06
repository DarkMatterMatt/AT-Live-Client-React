import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface MarkerIconProps {
    height?: string | number;
    width?: string | number;
    fill?: string;
    opacity?: number;
    borderColor?: string;
    borderOpacity?: number;
    dotFill?: string;
    dotOpacity?: number;
}

function MarkerIcon({ height, width, fill, opacity, borderColor, borderOpacity, dotFill, dotOpacity }: MarkerIconProps) {
    fill    = fill ?? "#000";
    opacity = opacity ?? 1;
    dotFill    = dotFill ?? "#FFF";
    dotOpacity = dotOpacity ?? 0.5 * opacity;
    borderColor   = borderColor ?? "#FFF";
    borderOpacity = borderOpacity ?? opacity;
    return (
        <View style={{ aspectRatio: 57.96 / 90, height, width }}>
            <Svg height="100%" width="100%" viewBox="0 0 57.96 90">
                <Path fill={fill} opacity={opacity} d="M29,89c-1.28,0-2.81-.64-2.9-3.67C25.75,74.12,20,65.18,13.92,55.73l-.14-.23c-.94-1.45-1.9-2.89-2.86-4.33C8.58,47.64,6.15,44,4.11,40.2a25.74,25.74,0,0,1,.57-25.53A28.11,28.11,0,0,1,29,1a28.09,28.09,0,0,1,24.3,13.67,25.74,25.74,0,0,1,.57,25.53c-2,3.79-4.46,7.44-6.81,11-1,1.44-1.92,2.88-2.85,4.33l-.14.23C38,65.18,32.2,74.12,31.88,85.33,31.8,88.36,30.26,89,29,89Z" />
                <Path fill={borderColor} opacity={borderOpacity} d="M29,2c20.09.12,33.22,20.53,24,37.73C50.13,45,46.59,49.91,43.34,55c-6,9.4-12.13,18.76-12.45,30.34,0,1.24-.31,2.7-1.9,2.7h0c-1.59,0-1.86-1.46-1.9-2.7C26.74,73.72,20.66,64.36,14.62,55,11.36,49.91,7.82,45,5,39.73-4.25,22.53,8.88,2.12,29,2m0-2h0A29.11,29.11,0,0,0,3.82,14.16a26.74,26.74,0,0,0-.59,26.52c2.06,3.83,4.5,7.5,6.86,11C11,53.14,12,54.6,12.93,56.05l.15.22c6,9.34,11.68,18.16,12,29.08.12,4.31,3,4.65,3.9,4.65s3.79-.34,3.91-4.65c.31-10.92,6-19.74,12-29.08l.14-.22c.93-1.45,1.9-2.91,2.84-4.32,2.36-3.55,4.8-7.22,6.86-11a26.74,26.74,0,0,0-.59-26.52A29.08,29.08,0,0,0,29,0Z" />
                <Circle fill={dotFill} opacity={dotOpacity} cx="28.98" cy="29" r="9.5" />
            </Svg>
        </View>
    );
}

export default React.memo(MarkerIcon);
