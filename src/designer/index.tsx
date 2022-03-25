import { Select, Button, InputNumber, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { ColorGrid } from '../interfaces';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '../store/store';
import { toJS } from 'mobx';

interface DesignerProps {
    // colorGrids: ColorGrid[];
    // colorPool: string[];
    // updater: IUpdater;
}

const ColorBlock = styled.div<{color: string}>`
    width: 14px;
    height: 14px;
    margin: 4px;
    background-color: ${props => props.color};
`;

const Designer: React.FC<DesignerProps> = props => {
    const { commonStore } = useGlobalStore();
    // const { colorGrids, colorPool, updater } = props;
    const { colorGrids, colorScheme } = commonStore;
    const sizeHandler = useCallback((value: number, index: number) => {
        commonStore.setGridSize(value, index)
    }, [commonStore]);
    const colorHandler = useCallback((value: number, index: number) => {
        commonStore.setGridColor(value, index)
    }, [commonStore])
    const deleteItem = useCallback((index: number) => {
        commonStore.deleteGrid(index)
    }, [commonStore])
    const addItem = useCallback(() => {
        commonStore.addGrid();
    }, [commonStore])

    const editGrids = toJS(colorGrids).map((c, i) => {
        return {
            ...c,
            key: i
        }
    })

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
                            {colorScheme.map((c, i) => (
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
    }, [colorHandler, sizeHandler, colorScheme, deleteItem])
    return (
        <div>
            <div style={{ marginBottom: '1em' }}>
                <Button type="primary" onClick={addItem}>
                    添加条纹
                </Button>
            </div>
            <div>
                <Table
                    pagination={false}
                    bordered
                    size="small"
                    dataSource={editGrids}
                    columns={tableCols}
                    scroll={{ y: 550 }}
                />
            </div>
        </div>
    );
}

export default observer(Designer);
