import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SlidersColorPicker } from 'react-native-color';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BusIcon from "../assets/BusIcon";
import TransitType from "../types/TransitType";
import RailIcon from "../assets/RailIcon";
import FerryIcon from "../assets/FerryIcon";
import CrossIcon from "../assets/CrossIcon";
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

function getIcon(type: TransitType) {
    switch (type) {
        case "ferry":
            return <FerryIcon height="100%" fill="#33f" />;
        case "rail":
            return <RailIcon height="100%" fill="#fc0" />;
        case "bus":
        default:
            return <BusIcon height="100%" fill="#093" />;
    }
}

// TODO: make setColor and remove required
interface RouteRowProps {
    route: RouteData;
    setColor?: (newColor: string) => void;
    remove?: () => void;
}

export default function RouteRow({ route, setColor, remove }: RouteRowProps) {
    const [pickrVisible, setPickrVisible] = useState(false);

    const { shortName, color, type } = route;

    return (
        <>
            <View style={[styles.row, { borderColor: color }]}>
                {getIcon(type)}
                <Text
                    style={styles.shortName}>
                    {shortName}
                </Text>
                {/* TODO: add where the bus is going to/from */}
                <TouchableOpacity
                    onPress={() => setPickrVisible(true)}
                    style={[styles.pickrBtn, { backgroundColor: color }]}
                    accessibilityLabel="Change color" />
                <TouchableOpacity
                    onPress={() => remove && remove()}
                    accessibilityLabel="Remove route" >
                    <CrossIcon height="100%" />
                </TouchableOpacity>
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
        </>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        borderRadius: 15,
        borderWidth: 3,
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 5,
    },
    shortName: {
        fontSize: 30,
        fontWeight: "bold",
        flexGrow: 1,
        marginHorizontal: 4,
    },
    pickrBtn: {
        borderRadius: 5,
        aspectRatio: 1,
        height: "100%",
        marginHorizontal: 4,
    },
});
