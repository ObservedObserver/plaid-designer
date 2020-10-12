import { TextField, Select, MenuItem, Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { ColorGrid } from '../interfaces';
import { IUpdater } from '../store/index';
interface DesignerProps {
    colorGrids: ColorGrid[];
    colorPool: string[];
    updater: IUpdater;
}
const Designer: React.FC<DesignerProps> = props => {
    const { colorGrids, colorPool, updater } = props;
    const sizeHandler = useCallback((value: number, index: number) => {
        updater(state => {
            state.colorGrids[index].size = value
        })
    }, [updater]);
    const colorHandler = useCallback((value: string, index: number) => {
        updater(state => {
            state.colorGrids[index].color = value;
        })
    }, [updater])
    const addItem = useCallback(() => {
        updater(state => {
            state.colorGrids.push({
                size: 10,
                color: state.colorPool[0]
            })
        })
    }, [updater])
    return <div>
        <div>
            {
            colorGrids.map((grid, index) => <div key={`color-grid-${index}`}>
                <TextField value={grid.size} onChange={(v) => {
                    sizeHandler(Number(v.target.value), index);
                }} />
                <Select value={grid.color} onChange={(e) => {
                    colorHandler(e.target.value as string, index);
                }}>
                    {
                        colorPool.map(c => <MenuItem key={c} value={c}>
                            <div style={{ backgroundColor: c, width: '18px', height: '18px' }}></div>
                        </MenuItem>)
                    }
                </Select>
            </div>)
        }
        <div>
            <Button variant="contained" color="primary" onClick={addItem}>Add</Button>
        </div>
        </div>
    </div>
}

export default Designer;
