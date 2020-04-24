import React from "react";
import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CrossIconProps {
    height?: string | number;
    width?: string | number;
    fill?: string;
}

export default function CrossIcon({ height, width, fill = "#000" }: CrossIconProps) {
    return (
        <View style={{ aspectRatio: 1, height, width }}>
            <Svg height="100%" width="100%" viewBox="0 0 24 24">
                <Path fill="none" d="M0 0h24v24H0V0z" />
                <Path fill={fill} d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </Svg>
        </View>
    );
}
