import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import Touchable from "react-native-platform-touchable";
import CrossIcon from "../common/CrossIcon";
import SearchIcon from "../common/SearchIcon";

interface SearchBarProps {
    onChangeText: (text: string) => void;
    style?: StyleProp<ViewStyle>;
}

interface SearchBarState {
    query: string;
}

export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    state: SearchBarState = {
        query: "",
    }

    inputRef: TextInput | null = null;

    onChangeText: (text: string) => void;

    constructor(props: SearchBarProps) {
        super(props);
        const { onChangeText } = props;
        this.onChangeText = onChangeText;
    }

    render = () => {
        const { onChangeText, style } = this.props;
        const { query } = this.state;

        return (
            <View style={[styles.container, style]}>
                <Touchable onPress={() => this.inputRef?.focus()}>
                    <SearchIcon height="70%" fill="#888" />
                </Touchable>
                <TextInput
                    style={styles.search}
                    ref={ref => this.inputRef = ref}
                    onChangeText={this.setQuery}
                    value={query}
                    placeholder="Track a new route" />
                {query !== "" &&
                    <Touchable onPress={this.clear}>
                        <CrossIcon height="70%" fill="#888" />
                    </Touchable>
                }

            </View>
        );
    }

    setQuery = (text: string) => {
        this.setState({ query: text });
        this.onChangeText(text);
    }

    clear = () => {
        this.setQuery("");
    }

    getInputRef = () => {
        return this.inputRef;
    }
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
