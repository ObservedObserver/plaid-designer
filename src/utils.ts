import { ColorGrid, ColorSegment } from "./interfaces";

export function colorGrid2Segment (grids: ColorGrid[], totalSize: number, colorPool: string[]): ColorSegment[] {
    let gridSize = 0, sum = 0;
    for (let i = 0; i < grids.length; i++) {
        gridSize += grids[i].size;
    }
    const segments: ColorSegment[] = [];
    for (let i = 0; i < grids.length; i++) {
        segments.push({
            start: sum * totalSize / gridSize,
            end: (sum + grids[i].size) * totalSize / gridSize,
            color: colorPool[grids[i].color % colorPool.length]
        })
        sum += grids[i].size
    }
    return segments;
}