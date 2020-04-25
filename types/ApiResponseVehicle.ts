import ApiResponseLatLng from "./ApiResponseLatLng";

export default interface ApiResponseVehicle {
    position: ApiResponseLatLng;
    vehicleId: string;
    lastUpdatedUnix: number;
    directionId: 0 | 1;
}