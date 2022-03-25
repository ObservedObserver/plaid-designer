import { InputNumber, Button, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { generateGrids } from '../bot/grid';
import { gridFuncs } from '../bot/gridFuncs';
import { ColorGrid } from '../interfaces';
import { IGS } from '../store/index';
import { useGlobalStore } from '../store/store';

const relu = (x: number) => Math.max(0, x)

interface InitPanelProps {
    onInit: (callback: (state: IGS) => void) => void;
}
const InitPanel: React.FC = props => {
    const { commonStore } = useGlobalStore();
    const [gridCount, setGridCount] = useState<number>(18);
    const [gridFuncIndex, setGridFuncIndex] = useState<number>(0);
    const onSubmit = useCallback(() => {
        commonStore.init(gridCount, gridFuncIndex);
    }, [gridCount, gridFuncIndex, commonStore])
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
                 Submit or Refresh
            </Button>
        </div>
    );
}

export default observer(InitPanel);
