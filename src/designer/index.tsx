import { Input, Select, Button, InputNumber, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ColorGrid } from '../interfaces';
import { IUpdater } from '../store/index';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

interface DesignerProps {
    colorGrids: ColorGrid[];
    colorPool: string[];
    updater: IUpdater;
}

const ColorBlock = styled.div<{color: string}>`
    width: 14px;
    height: 14px;
    margin: 4px;
    background-color: ${props => props.color};
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
    const deleteItem = useCallback((index: number) => {
        updater(state => {
            state.colorGrids.splice(index, 1);
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

    const editGrids = useMemo(() => {
        return colorGrids.map((c, i) => {
            return {
                ...c,
                key: i
            }
        })
    }, [colorGrids])

    const tableCols = useMemo(() => {
        return [
            {
                title: '大小',
                dataIndex: 'size',
                key: 'size',
                width: 40,
                render(value: any, grid: ColorGrid, index: number) {
                    return (
                        <InputNumber
                            min={0}
                            step={1}
                            value={grid.size}
                            onChange={(v) => {
                                sizeHandler(Number(v), index);
                            }}
                        />
                    );
                },
            },
            {
                title: '颜色',
                dataIndex: 'color',
                key: 'color',
                width: 30,
                render (value: any, grid: ColorGrid, index: number) {
                    return (
                        <Select
                            value={grid.color}
                            onChange={(v) => {
                                colorHandler(v, index);
                            }}
                        >
                            {colorPool.map((c, i) => (
                                <Select.Option key={c} value={i}>
                                    <ColorBlock color={c} />
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
            },
            {
                title: '编辑',
                key: 'edit',
                width: 30,
                render (value: any, grid: ColorGrid, index: number) {
                    return <DeleteOutlined onClick={() => { deleteItem(index) }} />;
                }

            }
        ];
    }, [colorHandler, sizeHandler, colorPool, deleteItem])
    return (
        <div>
            <div style={{ marginBottom: '1em' }}>
                <Button type="primary" onClick={addItem}>
                    添加条纹
                </Button>
            </div>
            <div>
                <Table
                    bordered
                    size="small"
                    dataSource={editGrids}
                    columns={tableCols}
                    scroll={{ y: 240 }}
                />
            </div>
        </div>
    );
}

export default Designer;
