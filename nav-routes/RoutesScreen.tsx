import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View, Platform } from "react-native";
import { SearchBar } from "react-native-elements";
import RouteData from "../types/RouteData";
import SearchRouteData from "../types/SearchRouteData";
import TransitType from "../types/TransitType";
import RouteRow from "./RouteRow";
import SearchRouteRow from "./SearchRouteRow";

interface RoutesScreenProps {
    activeRoutes: RouteData[];
    addRoute?: (route: SearchRouteData) => void;
    removeRoute?: (route: RouteData) => void;
}

export default function RoutesScreen({ activeRoutes, addRoute, removeRoute }: RoutesScreenProps) {
    const [searchData, setSearchData] = useState<SearchRouteData[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => setSearchData(await loadSearchData()))();
    }, ["runOnce"]);

    const results = search(searchData, query, activeRoutes);
    const activeRoutesMaxHeight = results.length > 0 ? "30%" : undefined;
    const searchPlatform = Platform.OS === "android" ? "android" : Platform.OS === "ios" ? "ios" : "default";

    return (
        <View style={styles.container} >
            <SearchBar
                platform={searchPlatform}
                style={styles.search}
                placeholder="Track a new route"
                onChangeText={setQuery}
                value={query} />
            {results.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={results}
                    renderItem={({ item }) => (
                        <SearchRouteRow
                            searchRoute={item}
                            onPress={addRoute} />
                    )}
                    keyExtractor={r => r.shortName} />
            }
            <ScrollView style={[styles.active, { maxHeight: activeRoutesMaxHeight }]} >
                {activeRoutes.map(r => <RouteRow key={r.shortName} route={r} />)}
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

    },
    list: {
        flexBasis: 0,
    },
    active: {
        flexGrow: 0,
    }
});

interface RoutesResponse {
    message: string;
    routes: Record<string, {
        shortName: string;
        longName: string;
        type: TransitType;
    }>;
}

/**
 * loadSearchData fetches data to be displayed in the search list
 */
async function loadSearchData(): Promise<SearchRouteData[]> {
    try {
        // TODO: abstract this
        const { routes } = await fetch("https://mattm.win/atlive/api/v1/routes?fetch=shortName,longName,type").then(r => r.json()) as RoutesResponse;
        const regexWord = /[a-z]+/g;

        return Object.entries(routes).map(([shortName, { longName, type }]) => {
            const longNameLower = longName.toLowerCase();
            const longNameWords = longNameLower.match(regexWord)?.filter(w => !["to", "via", "and"].includes(w)) ?? [];

            // remove everything after "via", remove all parenthesized text, split on the word "to"
            const [to, from] = longName.replace(/ via .*/i, "").replace(/ *\([^)]*\)/g, "").split(" to ");

            return {
                shortName,
                shortNameLower: shortName.toLowerCase(),
                longName,
                longNameLower,
                longNameWords,
                type,
                to,
                from,
            }
        });
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

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
