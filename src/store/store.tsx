import { makeAutoObservable, observable, toJS } from "mobx";
import React, { useContext } from "react";
import { generateGrids } from "../bot/grid";
import { gridFuncs } from "../bot/gridFuncs";
import { sortColor } from "../bot/utils";
import { ColorGrid } from "../interfaces";
import { colorGrid2Segment } from "../utils";
import { ColorDB } from "./colordb";
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
const relu = (x: number) => Math.max(0, x)

const colorGridsAutoD: ColorGrid[] = gridList.map((n, i) => ({
    size: n,
    color: Math.floor((1 - orderMap.get(n)! / orderMap.size) * 5 + relu(Math.sin(Math.PI * 2 / 4 * i)) + 5) % 5
}));

class GlobalStore {
    public colorGrids: ColorGrid[] = [];
    // public colorPool: string[] = [];
    public colorSchemeIndex: number = 0;
    public colorSchemePool: string[][] = [];
    constructor () {
        this.colorGrids = colorGridsAutoD;
        // this.colorPool = COLOR_POOL2;
        this.colorSchemeIndex = 0;
        this.colorSchemePool = [
            sortColor(COLOR_POOL),
            sortColor(COLOR_POOL2),
            ...ColorDB.map(cdb => sortColor(cdb)).slice(0, 2),
            // COLOR_POOL,
            // COLOR_POOL2,
        ]
        makeAutoObservable(this, {
            colorSchemePool: observable.ref
        });
    }
    public get colorScheme () {
        return this.colorSchemePool[this.colorSchemeIndex]
    }
    public get segments () {
        return colorGrid2Segment(this.colorGrids, 400, this.colorScheme);
    }
    public setColorSchemeIndex (index: number) {
        this.colorSchemeIndex = index;
    }
    public setGridSize (size: number, index: number) {
        this.colorGrids[index].size= size;
    }
    public setGridColor (color: number, index: number) {
        this.colorGrids[index].color = color;
    }
    public deleteGrid (index: number) {
        this.colorGrids.splice(index, 1);
    }
    public addGrid () {
        this.colorGrids.push({
            size: Math.round(Math.random() * 40) + 10,
            color: Math.round(Math.random() * this.colorScheme.length - 1) 
        })
    }
    public init (gridCount: number, gridFuncIndex: number) {
        const gridList = generateGrids(gridCount, gridFuncs[gridFuncIndex]);
        const sortedList = [...gridList].sort((a, b) => a - b);
        const orderMap: Map<number, number> = new Map();
        sortedList.forEach((n, i) => {
            orderMap.set(n, i);
        })
        const colorGridsAutoD: ColorGrid[] = gridList.map((n, i) => ({
            size: n,
            color: Math.floor((1 - orderMap.get(n)! / orderMap.size) * 5 + relu(Math.sin(Math.PI * 2 / 4 * i)) + 5) % 5
        }));
        console.log(toJS(colorGridsAutoD))
        console.log(gridList)
        this.colorGrids = colorGridsAutoD;
    }
    public parseGrids (raw: string) {
        this.colorGrids = JSON.parse(raw);
    }
}

const initStore: {
    commonStore: GlobalStore;
} = {
    commonStore: new GlobalStore()
}

const StoreContext = React.createContext<{
    commonStore: GlobalStore;
}>(initStore);

export const StoreWrapper: React.FC = props => {
    return <StoreContext.Provider value={initStore}>
        { props.children }
    </StoreContext.Provider>
}

export function useGlobalStore() {
    return useContext(StoreContext);
}