import React from "react";
import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface RailIconProps {
    height?: string | number;
    width?: string | number;
    fill?: string;
}

function RailIcon({ height, width, fill="#000" }: RailIconProps) {
    return (
        <View style={{ aspectRatio: 1, height, width }}>
            <Svg height="100%" width="100%" viewBox="0 0 24 24">
                <Path fill="none" d="M0 0h24v24H0z" />
                <Path fill={fill} d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z" />
            </Svg>
        </View>
    );
}

export default React.memo(RailIcon);
