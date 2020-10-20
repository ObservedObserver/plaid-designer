import { IGridFunc } from "./gridFuncs";

export function generateGrids (size: number, gridFunc: IGridFunc): number[] {
    const grids: number[] = [];
    for (let x = 0; x < size; x++) {
        const y = gridFunc.func(x, size);
        // const y = (0.8 + (Math.random()) * 0.2) * 8 * Math.abs(Math.sin(2 * Math.PI / (2 * size) * x + Math.PI * (1 - 0.618))) + 2 * Math.random() + 5;
        grids.push(y);
    }
    return grids;
}
