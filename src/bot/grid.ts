export function generateGrids (size: number): number[] {
    const grids: number[] = [];
    for (let x = 0; x < size; x++) {
        const y = (0.8 + (Math.random()) * 0.2) * 8 * Math.abs(Math.sin(2 * Math.PI / (2 * size) * x + Math.PI / 3)) + 2 * Math.random() + 5;
        grids.push(Math.round(y ** 4));
    }
    return grids;
}
