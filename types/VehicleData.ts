import { LatLng } from "react-native-maps";

export default interface VehicleData {
    position: LatLng;
    timestamp: number;
    id: string;
    direction: 0 | 1;
}
