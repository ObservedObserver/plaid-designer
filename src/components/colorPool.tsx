import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useGlobalStore } from '../store/store';
import ColorScheme from './colorScheme';

const ColorPool: React.FC = props => {
    const { commonStore } = useGlobalStore();
    const { colorSchemeIndex, colorSchemePool } = commonStore;
    return <div style={{ marginBottom: '1em' }}>
        <Select
            value={colorSchemeIndex}
            onChange={(v) => {
                commonStore.setColorSchemeIndex(v)
            }}
        >
            {colorSchemePool.map(
                (scheme, sIndex) => (
                    <Select.Option
                        key={sIndex}
                        value={sIndex}
                    >
                        <ColorScheme colorPool={scheme} />
                    </Select.Option>
                )
            )}
        </Select>
    </div>
}

export default observer(ColorPool);