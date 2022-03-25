import { Button, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useGlobalStore } from '../store/store';

const ParseSegment: React.FC = props => {
    const { commonStore } = useGlobalStore();
    const [text, setText] = useState<string>('[{"color": 1, "size": 12}]');

    return <div style={{ marginTop: '2em' }}>
        <code>
            gridSizeList = [{commonStore.colorGrids.map(g => g.size).join(',\n')}]
            <br />
            color = [{commonStore.colorScheme.join(',\n')}]
        </code>
        <h2>自定义grid信息</h2>
        <Input.TextArea value={text} onChange={(e) => {
            setText(e.target.value)
        }}>
        </Input.TextArea>
        <Button style={{ marginTop: '1em' }} onClick={() => {
            commonStore.parseGrids(text);
        }}>提交</Button>
    </div>
}

export default observer(ParseSegment);