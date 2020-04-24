import { LatLng } from "react-native-maps";
import TransitType from "./TransitType";
import VehicleData from "./VehicleData";

export default interface RouteData {
    shortName: string;
    longName: string;
    color: string;
    vehicles: VehicleData[];
    type: TransitType;
    polylines: [LatLng[], LatLng[]?];
    to: string;
    from: string;
}
