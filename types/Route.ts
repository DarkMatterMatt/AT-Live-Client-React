import Vehicle from "./Vehicle";

export default interface Route {
    shortName: string,
    position: number,
    active: boolean,
    color: string,
    vehicles: Vehicle[]
}
