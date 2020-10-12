import { Pos } from '../interfaces';

export function slopeLine(interceptY: number, width: number, height: number): Pos[] {
    const graph: Pos[] = [];
    // y1 = x + ity
    // y1 growth = [1, 0]
    // y2 = x + ity + 1
    // y2 growth = [0, 1]
    const inty1 = interceptY;
    const inty2 = interceptY + 1;
    // ity >=0 , x from 0.
    const maxX2 = Math.min(width, height - inty2);
    const maxY2 = Math.min(height, width + inty2);
    const minX2 = Math.max(0, -inty2);
    const minY2 = Math.max(0, inty2);

    const maxX1 = Math.min(width, height - inty1);
    const maxY1 = Math.min(height, width + inty1);
    const minX1 = Math.max(0, -inty1);
    const minY1 = Math.max(0, inty1);
    let x, y;
    for (x = minX2, y = minY2; x <= maxX2 && y<= maxY2; x++) {
        y = x + inty2;
        if (y <= maxY2 && y >= minY2) {
            graph.push([x, y]);
        }
        if (y + 1 <= maxY2 && y + 1 >= minY2) {
            graph.push([x, y + 1]);
        }
    }
    for (let x = maxX1, y = maxY1; x >=minX1 && y >= minY1; x--) {
        y = x + inty1;
        if (y <= maxY1 && y >= minY1) {
            graph.push([x, y]);
        }
        if (y - 1 <= maxY1 && y - 1 >= minY1) {
            graph.push([x, y - 1])
        }
    }
    return graph;
}

export function translate(graph: Pos[], offset: Pos): Pos[] {
    return graph.map(p => [p[0] + offset[0], p[1] + offset[1]])
}

export function getMaskMatrix(width: number, height: number, scale: number = 1) {
    const graph: Pos[][] = [];
    for (let y = -width; y <= height; y += 4) {
        const line = slopeLine(y, width, height);
        graph.push(line.map(pos => [pos[0] * scale, pos[1] * scale]));
    }

    return graph;
}

export function maskMatrix2PathList(matrix: Pos[][]): string[] {
    const pathList: string[] = [];
    for (let line of matrix) {
        let path = `M ${line[0].join(' ')} `;
        for (let i = 1; i < line.length; i++) {
            path += `L ${line[i].join(' ')} `;
        }
        path += 'Z';
        pathList.push(path);
    }
    return pathList;
}