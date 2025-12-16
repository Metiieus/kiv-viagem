declare module '@mapbox/polyline' {
    export function decode(encoded: string, precision?: number): number[][];
    export function encode(coordinate: number[][], precision?: number): string;
    export function fromGeoJSON(geojson: any, precision?: number): string;
    export function toGeoJSON(encoded: string, precision?: number): any;
}
