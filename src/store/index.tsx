import produce from 'immer';
import React, { useContext, useState, useCallback } from 'react';
import { ColorGrid } from '../interfaces';

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
const colorGrids: ColorGrid[] = [
    {
        size: 12,
        color: 0,
    },
    {
        size: 20,
        color: 1,
    },
    {
        size: 20,
        color: 2,
    },
    {
        size: 10,
        color: 4,
    },
    {
        size: 5,
        color: 2,
    },
    {
        size: 15,
        color: 1,
    },
    {
        size: 10,
        color: 2,
    },
    {
        size: 5,
        color: 3,
    },
    {
        size: 50,
        color: 4,
    },
];
interface IGS {
    colorGrids: ColorGrid[];
    colorPool: string[];
    colorSchemeIndex: number;
    colorSchemePool: string[][];
}
const initGlobalState: IGS = {
    colorGrids,
    colorPool: COLOR_POOL2,
    colorSchemeIndex: 0,
    colorSchemePool: [
        COLOR_POOL,
        COLOR_POOL2
    ]
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