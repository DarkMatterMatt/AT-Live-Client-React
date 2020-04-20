import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

export default function RoutesScreen() {
    return (
        <View style={styles.routesStyle}>
            <Text>
                RoutesScreen
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    routesStyle: {
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
    },
});
