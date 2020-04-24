import TransitType from "./TransitType";

export default interface SearchRouteData {
    shortName: string;
    longName: string;
    type: TransitType;

    shortNameLower: string;
    longNameLower: string;
    longNameWords: string[];
    to: string;
    from?: string;

    searchWeight?: number;
}
