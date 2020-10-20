export interface IGridFunc {
    name: string;
    func: (x: number, size?: number) => number;
}

const PI = Math.PI;

export const gridFuncs: IGridFunc[] = [
    {
        name: 'sin-extended',
        func: (x, size = 1) => Math.round(((0.8 + (Math.random()) * 0.2) * 8 * Math.abs(Math.sin(2 * PI / (2 * size) * x + PI * (1 - 0.618))) + 2 * Math.random() + 5) ** 4)
    },
    {
        name: 'normal-extended',
        func: (x, size = 1) => (1 / (Math.sqrt(2 * PI) * size / 4)) * Math.exp(-1 * (x - size / 6 -  Math.random()) ** 2 / ( 2 * size / 4) ** 2)
    }
]