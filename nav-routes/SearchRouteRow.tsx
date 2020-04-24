import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";
import TransitIcon from "../common/TransitIcon";
import SearchRouteData from "../types/SearchRouteData";

// TODO: make onPress required
interface RouteRowProps {
    searchRoute: SearchRouteData;
    onPress?: (selectedRoute: SearchRouteData) => void;
}

function SearchRouteRow({ searchRoute, onPress }: RouteRowProps) {
    const { shortName, type, longName } = searchRoute;

    return (
        <Touchable
            onPress={() => onPress && onPress(searchRoute)}
            accessibilityLabel="Add this route" >
            <View
                style={styles.row}>
                <TransitIcon type={type} />
                <Text style={styles.shortName} >
                    {shortName}
                </Text>
                <Text
                    numberOfLines={2}
                    style={styles.longName} >
                    {longName}
                </Text>
            </View>
        </Touchable>
    );
}

export default React.memo(SearchRouteRow);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 5,
        height: 52,
        alignItems: "center",
        backgroundColor: "#eee",
    },
    shortName: {
        fontSize: 30,
        fontWeight: "bold",
        marginLeft: 4,
    },
    longName: {
        fontSize: 14,
        marginLeft: 8,
        flexGrow: 1,
        flexShrink: 1,
    },
});
