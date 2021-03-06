import React, { useState } from "react";
import BusIcon from "./BusIcon";
import FerryIcon from "./FerryIcon";
import RailIcon from "./RailIcon";
import TransitType from "../types/TransitType";

interface TransitIconProps {
    type: TransitType;
    height?: string | number;
    fill?: string;
}

function TransitIcon({ type, height = "100%", fill }: TransitIconProps) {
    switch (type) {
        case "ferry":
            return <FerryIcon height={height} fill={fill ?? "#33f"} />;
        case "rail":
            return <RailIcon height={height} fill={fill ?? "#fc0"} />;
        case "bus":
        default:
            return <BusIcon height={height} fill={fill ?? "#093"} />;
    }
}

export default React.memo(TransitIcon);
