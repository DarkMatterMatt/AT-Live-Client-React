import React, { useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SlidersColorPicker } from 'react-native-color';
import Touchable from "react-native-platform-touchable";
import CrossIcon from "../common/CrossIcon";
import TransitIcon from "../common/TransitIcon";
import RouteData from "../types/RouteData";

const SUGGESTED_COLORS = [
    "#E94537",
    "#E67C13",
    "#CECE1D",
    "#1DCE1D",
    "#5555FF",
    "#9400D3",
    "#D30094",
];

// TODO: make setColor and remove required
interface RouteRowProps {
    route: RouteData;
    setColor?: (newColor: string) => void;
    remove?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function RouteRow({ route, setColor, remove, style }: RouteRowProps) {
    const [pickrVisible, setPickrVisible] = useState(false);

    const { shortName, color, type, longName, to, from } = route;

    return (<>
        <View style={[styles.row, style]}>
            <TransitIcon type={type} />
            <Text
                style={styles.shortName}>
                {shortName}
            </Text>
            <View style={{ flexGrow: 1 }}>
                <Text style={styles.toFrom}>{to}</Text>
                <Text style={styles.toFrom}>{from}</Text>
            </View>
            <Touchable
                onPress={() => setPickrVisible(true)}
                style={[styles.pickrBtn, { backgroundColor: color }]}
                accessibilityLabel="Change color" >
                <>{/* Touchable needs exactly one child */}</>
            </Touchable>
            <Touchable
                onPress={() => remove && remove()}
                accessibilityLabel="Remove route" >
                <CrossIcon height="100%" />
            </Touchable>
        </View>
        <SlidersColorPicker
            visible={pickrVisible}
            color={color}
            onCancel={() => setPickrVisible(false)}
            returnMode="hex"
            onOk={(colorHex: string) => setColor && setColor(colorHex)}
            swatches={SUGGESTED_COLORS}
            swatchesLabel="QUICK COLOURS"
            okLabel="Done"
            cancelLabel="Cancel"
        />
    </>);
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
    },
    shortName: {
        marginLeft: 4,
        fontSize: 30,
        fontWeight: "bold",
    },
    toFrom: {
        marginLeft: 8,
        fontSize: 14,
    },
    pickrBtn: {
        marginHorizontal: 3,
        height: "100%",
        aspectRatio: 1,
        borderRadius: 4,
    },
});

