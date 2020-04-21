import VehicleData from "./VehicleData";
import TransitType from "./TransitType";
import { LatLng } from "react-native-maps";

export default interface RouteData {
    shortName: string;
    position: number;
    active: boolean;
    color: string;
    vehicles: VehicleData[];
    type: TransitType;
    polylines: [LatLng[], LatLng[]?];
}
