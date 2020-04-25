/**
 * Calculates a bezier blend curve
 * @param t position on the curve, 0 <= t <= 1
 */
export function bezierBlend(t: number): number {
    return t * t * (3 - 2 * t);
}

/**
 * Clamps a number into a range between min and max (inclusive)
 * @param min the lowest number that val can be
 * @param max the highest number that val can be
 * @param val the value to clamp
 */
export function clamp(min: number, max: number, val: number) {
    if (val > max) {
        return max;
    }
    if (val < min) {
        return min;
    }
    return val;
}
