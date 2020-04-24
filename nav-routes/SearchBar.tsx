import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import Touchable from "react-native-platform-touchable";
import CrossIcon from "../common/CrossIcon";
import SearchIcon from "../common/SearchIcon";

interface SearchBarProps {
    onChangeText?: (text: string) => void;
    style?: StyleProp<ViewStyle>;
}

export default function SearchBar({ onChangeText, style }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const textInputRef = useRef<TextInput>(null);

    return (
        <View style={[styles.container, style]}>
            <Touchable onPress={() => textInputRef.current?.focus()}>
                <SearchIcon height="70%" fill="#888" />
            </Touchable>
            <TextInput
                style={styles.search}
                ref={textInputRef}
                onChangeText={t => { setQuery(t); onChangeText && onChangeText(t) }}
                value={query}
                placeholder="Track a new route" />
            {query !== "" &&
                <Touchable onPress={() => { setQuery(""); onChangeText && onChangeText("") }}>
                    <CrossIcon height="70%" fill="#888" />
                </Touchable>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
    },
    search: {
        flexGrow: 1,
        flexShrink: 1,
        fontSize: 24,
        padding: 5,
    },
});
