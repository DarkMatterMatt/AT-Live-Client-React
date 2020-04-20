import { LatLng } from "react-native-maps";
import Route from "./Route";

export default interface Vehicle {
    position: LatLng,
    timestamp: number,
    id: string,
    route: Route,
    direction: 0 | 1;
}
