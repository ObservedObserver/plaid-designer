import { InputNumber, Button, Select } from 'antd';
import React, { useCallback, useState } from 'react';
import { generateGrids } from '../bot/grid';
import { gridFuncs } from '../bot/gridFuncs';
import { ColorGrid } from '../interfaces';
import { IGS } from '../store/index';

const relu = (x: number) => Math.max(0, x)

interface InitPanelProps {
    onInit: (callback: (state: IGS) => void) => void;
}
const InitPanel: React.FC<InitPanelProps> = props => {
    const { onInit } = props;
    const [gridCount, setGridCount] = useState<number>(18);
    const [gridFuncIndex, setGridFuncIndex] = useState<number>(0);
    const onSubmit = useCallback(() => {
        onInit((state) => {
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
            state.colorGrids = colorGridsAutoD;

        })
    }, [gridCount, gridFuncIndex, onInit])
    return (
        <div>
            <InputNumber
                aria-label="grid-count"
                value={gridCount}
                onChange={(v) => {
                    setGridCount(Number(v));
                }}
            />
            <InputNumber
                aria-label="grid-func"
                value={gridFuncIndex}
                onChange={(v) => {
                    setGridFuncIndex(Number(v));
                }}
            />
            <Select value={gridFuncIndex} onChange={v => { setGridFuncIndex(Number(v)); }}>
                {gridFuncs.map((gf, index) => (
                    <Select.Option value={index} key={gf.name}>{gf.name}</Select.Option>
                ))}
            </Select>
            <Button type="primary" onClick={onSubmit}>
                submit
            </Button>
        </div>
    );
}

export default InitPanel;
