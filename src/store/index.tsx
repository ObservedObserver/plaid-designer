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
const colorGrids: ColorGrid[] = [
    {
        size: 12,
        color: COLOR_POOL[0],
    },
    {
        size: 20,
        color: COLOR_POOL[1],
    },
    {
        size: 20,
        color: COLOR_POOL[2],
    },
    {
        size: 10,
        color: COLOR_POOL[4],
    },
    {
        size: 5,
        color: COLOR_POOL[2],
    },
    {
        size: 15,
        color: COLOR_POOL[1],
    },
    {
        size: 10,
        color: COLOR_POOL[2],
    },
    {
        size: 5,
        color: COLOR_POOL[3],
    },
    {
        size: 50,
        color: COLOR_POOL[4],
    },
];
interface IGS {
    colorGrids: ColorGrid[];
    colorPool: string[];
}
const initGlobalState: IGS = {
    colorGrids,
    colorPool: COLOR_POOL,
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