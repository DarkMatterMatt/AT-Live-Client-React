import VehicleData from "./VehicleData";
import TransitType from "./TransitType";
import { LatLng } from "react-native-maps";

export default interface RouteData {
    shortName: string;
    active: boolean;
    color: string;
    vehicles: VehicleData[];
    type: TransitType;
    polylines: [LatLng[], LatLng[]?];
}
