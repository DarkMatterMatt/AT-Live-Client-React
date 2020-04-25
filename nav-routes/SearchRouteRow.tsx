import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Touchable from "react-native-platform-touchable";
import TransitIcon from "../common/TransitIcon";
import SearchRouteData from "../types/SearchRouteData";

interface RouteRowProps {
    searchRoute: SearchRouteData;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

function SearchRouteRow({ searchRoute, onPress, style }: RouteRowProps) {
    const { shortName, type, longName } = searchRoute;

    return (
        <Touchable
            onPress={onPress}
            accessibilityLabel="Add this route" >
            <View
                style={[styles.row, style]}>
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
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    shortName: {
        marginLeft: 4,
        fontSize: 30,
        fontWeight: "bold",
    },
    longName: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 14,
    },
});
