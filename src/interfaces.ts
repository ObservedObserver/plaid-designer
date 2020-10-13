export type Pos = [number, number];

export interface ColorSegment {
    start: number;
    end: number;
    color: string;
}

export interface ColorGrid {
    size: number;
    color: number;
}