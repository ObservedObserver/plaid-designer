import produce from 'immer';
import React, { useContext, useState, useCallback } from 'react';
import { generateGrids } from '../bot/grid';
import { sortColor } from '../bot/utils';
import { ColorGrid } from '../interfaces';
import { ColorDB } from './colordb';
import { gridFuncs } from '../bot/gridFuncs';

const COLOR_POOL: string[] = [
    '#644e2d',
    '#f8ea7e',
    '#e69214',
    '#3f3dd6',
    '#f5f1d2'
];

const COLOR_POOL2: string[] = [
    '#e63946',
    '#f1faee',
    '#a8dadc',
    '#457b9d',
    '#1d3557',
];

const gridList = generateGrids(18, gridFuncs[0]);
const sortedList = [...gridList].sort((a, b) => a - b);
const orderMap: Map<number, number> = new Map();
sortedList.forEach((n, i) => {
    orderMap.set(n, i);
})
const minG = Math.min(...gridList);
const maxG = Math.max(...gridList);
// const colorGridsAutoD: ColorGrid[] = gridList.map((n, i) => ({
//     size: n,
//     color:
//         i % 2
//             ? Math.floor((1 - (n - minG) / (maxG - minG)) * 5) % 5
//             : Math.floor((1 - (n - minG) / (maxG - minG)) * 4) % 4,
// }));
// const colorGridsAutoD: ColorGrid[] = gridList.map((n, i) => ({
//     size: n,
//     color:
//         i % 2
//             ? Math.floor((1 - orderMap.get(n)! / orderMap.size) * 5) % 5
//             : Math.floor((1 - orderMap.get(n)! / orderMap.size) * 4) % 4,
// }));

const relu = (x: number) => Math.max(0, x)

const colorGridsAutoD: ColorGrid[] = gridList.map((n, i) => ({
    size: n,
    color: Math.floor((1 - orderMap.get(n)! / orderMap.size) * 5 + relu(Math.sin(Math.PI * 2 / 4 * i)) + 5) % 5
}));

console.log(colorGridsAutoD);
export interface IGS {
    colorGrids: ColorGrid[];
    colorPool: string[];
    colorSchemeIndex: number;
    colorSchemePool: string[][];
}
const initGlobalState: IGS = {
    colorGrids: colorGridsAutoD,
    colorPool: COLOR_POOL2,
    colorSchemeIndex: 0,
    colorSchemePool: [
        sortColor(COLOR_POOL),
        sortColor(COLOR_POOL2),
        ...ColorDB.map(cdb => sortColor(cdb)),
        // COLOR_POOL,
        // COLOR_POOL2,
    ],
};
export type IStateChange<T> = (state: T) => void;
export type IUpdater = (update: IStateChange<IGS>) => void;
const GlobalStateContext = React.createContext<[IGS, IUpdater]>(null!);

export const GSContext: React.FC = props => {
    const [state, setState] = useState<IGS>(initGlobalState);
    const updater = useCallback<IUpdater>((update) => {
        setState((state) => {
            const nextState = produce(state, draft => {
                update(draft);
            })
            return nextState;
        });
    }, [setState]);
    return <GlobalStateContext.Provider value={[state, updater]}>
        {props.children}
    </GlobalStateContext.Provider>
}

export function useStore() {
    return useContext(GlobalStateContext);
}