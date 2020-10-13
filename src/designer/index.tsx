import { TextField, Select, MenuItem, Button, InputLabel } from '@material-ui/core';
import React, { useCallback } from 'react';
import { ColorGrid } from '../interfaces';
import { IUpdater } from '../store/index';
import styled from 'styled-components';

interface DesignerProps {
    colorGrids: ColorGrid[];
    colorPool: string[];
    updater: IUpdater;
}

const FieldContainer = styled.div`
    padding: 4px;
    display: flex;
    align-items: center;
`;

const Designer: React.FC<DesignerProps> = props => {
    const { colorGrids, colorPool, updater } = props;
    const sizeHandler = useCallback((value: number, index: number) => {
        updater(state => {
            state.colorGrids[index].size = value
        })
    }, [updater]);
    const colorHandler = useCallback((value: number, index: number) => {
        updater(state => {
            state.colorGrids[index].color = Number(value);
        })
    }, [updater])
    const addItem = useCallback(() => {
        updater(state => {
            state.colorGrids.push({
                size: Math.round(Math.random() * 40) + 10,
                color: Math.round(Math.random() * state.colorPool.length - 1) 
            })
        })
    }, [updater])
    return (
        <div>
            <div>
                <Button variant="contained" color="primary" onClick={addItem}>
                    Add
                </Button>
            </div>
            <div>
                {colorGrids.map((grid, index) => (
                    <FieldContainer key={`color-grid-${index}`}>
                        <TextField
                            label="条纹大小"
                            value={grid.size}
                            onChange={(v) => {
                                sizeHandler(Number(v.target.value), index);
                            }}
                        />
                        {/* <InputLabel ></InputLabel> */}
                        <Select
                            label="颜色"
                            value={grid.color}
                            onChange={(e) => {
                                colorHandler(e.target.value as any, index);
                            }}
                        >
                            {colorPool.map((c, i) => (
                                <MenuItem key={c} value={i}>
                                    <div
                                        style={{
                                            backgroundColor: c,
                                            width: '18px',
                                            height: '18px',
                                        }}
                                    ></div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FieldContainer>
                ))}
            </div>
        </div>
    );
}

export default Designer;
