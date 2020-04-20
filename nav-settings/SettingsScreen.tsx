import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

export default function SettingsScreen() {
    return (
        <View style={styles.routesStyle}>
            <Text>
            SettingsScreen
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
