import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Platform, ScrollView, StyleSheet, View } from "react-native";
import { loadSearchData } from "../common/api";
import RouteData from "../types/RouteData";
import SearchRouteData from "../types/SearchRouteData";
import RouteRow from "./RouteRow";
import SearchBar from "./SearchBar";
import SearchRouteRow from "./SearchRouteRow";

interface RoutesScreenProps {
    activeRoutes: RouteData[];
    addRoute: (route: SearchRouteData) => void;
    removeRoute: (route: RouteData) => void;
    updateRoute: (oldRoute: RouteData, newRoute: RouteData) => void;
}

export default function RoutesScreen({ activeRoutes, addRoute, removeRoute, updateRoute }: RoutesScreenProps) {
    const [searchData, setSearchData] = useState<SearchRouteData[]>([]);
    const [query, setQuery] = useState("");
    const searchBarRef = useRef<SearchBar>(null);

    useEffect(() => {
        (async () => setSearchData(await loadSearchData()))();
    }, ["runOnce"]);

    const results = search(searchData, query, activeRoutes);
    const activeRoutesMaxHeight = results.length > 0 ? "30%" : undefined;
    const searchPlatform = Platform.OS === "android" ? "android" : Platform.OS === "ios" ? "ios" : "default";

    return (
        <View style={styles.container} >
            <SearchBar
                ref={searchBarRef}
                style={styles.search}
                onChangeText={setQuery} />
            {results.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={results}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <SearchRouteRow
                            style={styles.searchRouteRow}
                            searchRoute={item}
                            onPress={() => { Keyboard.dismiss(); searchBarRef.current?.clear(); addRoute(item) }} />
                    )}
                    keyExtractor={r => r.shortName} />
            }
            <ScrollView style={[styles.active, { maxHeight: activeRoutesMaxHeight }]} >
                {activeRoutes.map(r =>
                    <RouteRow
                        style={styles.routeRow}
                        key={r.shortName}
                        route={r}
                        removeRoute={removeRoute}
                        updateRoute={updateRoute} />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flexGrow: 1,
        backgroundColor: "#FFFFFF",
    },
    search: {
        paddingHorizontal: 8,
    },
    searchRouteRow: {
        padding: 5,
        backgroundColor: "#EEE",
    },
    list: {
        flexBasis: 0,
    },
    routeRow: {
        padding: 5,
    },
    active: {
        flexGrow: 0,
    }
});

/**
 * search filters the provided search data by a search/query
 * @param searchData the data to filter
 * @param query the search text to match
 * @param ignoreRoutes exclude these routes from search results
 */
function search(searchData: SearchRouteData[], query: string, ignoreRoutes: RouteData[]): SearchRouteData[] {
    if (query === "") {
        return [];
    }

    const q = query.toLowerCase();
    const ignoreShortNames = ignoreRoutes.map(r => r.shortName);

    searchData.forEach(r => {
        let weight = 0;
        if (r.shortNameLower === q) {
            weight += 50;
        }
        else if (r.shortNameLower.startsWith(q)) {
            weight += 25;
        }
        if (r.longNameLower.includes(q)) {
            weight += 5;
        }
        r.longNameWords.forEach(word => {
            if (word.startsWith(q)) {
                weight += 5;
            }
            else if (word.includes(q)) {
                weight += 1;
            }
        });

        // eslint-disable-next-line no-param-reassign
        r.searchWeight = weight;
    });

    const filtered = searchData.filter(r => (r.searchWeight ?? 0) > 0 && !ignoreShortNames.includes(r.shortName));
    return filtered.sort((a, b) => (b.searchWeight ?? 0) - (a.searchWeight ?? 0));
}
