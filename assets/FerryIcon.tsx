import React from "react";
import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface FerryIconProps {
    height?: string | number;
    width?: string | number;
    fill?: string;
}

export default function FerryIcon({ height, width, fill = "#000" }: FerryIconProps) {
    return (
        <View style={{ aspectRatio: 1, height, width }}>
            <Svg height="100%" width="100%" viewBox="0 0 24 24">
                <Path fill="none" d="M0 0h24v24H0z" />
                <Path fill={fill} d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99a8.752 8.752 0 008 0c1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42a1.007 1.007 0 00-.66 1.28L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
            </Svg>
        </View>
    );
}
