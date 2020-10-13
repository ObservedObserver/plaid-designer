import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaskLayer from './canvas/mask';
import HorizontalGroup from './canvas/horizontal';
import VerticalGroup from './canvas/vertical';
import { ColorSegment } from './interfaces';
import { colorGrid2Segment } from './utils';
import Designer from './designer/index';
import { PageHeader, PageContainer } from './components/page';
import { GSContext, useStore } from './store';
import { Button, Menu, Row, Col, Select } from 'antd';
import './App.css';
import ColorScheme from './components/colorScheme';

const SIZE = 400;
function Core() {
	const svgContainer = useRef<HTMLDivElement>(null);
	const dllink = useRef<HTMLAnchorElement>(null);
	const [gState, gStateUpdater] = useStore();
	const [svgFile, setSvgFile] = useState<string>('');

	const colorScheme = useMemo<string[]>(() => {
		return gState.colorSchemePool[gState.colorSchemeIndex];
	}, [gState.colorSchemeIndex, gState.colorSchemePool])

	const segments = useMemo<ColorSegment[]>(() => {
        return colorGrid2Segment(gState.colorGrids, SIZE, colorScheme);
	}, [gState.colorGrids, colorScheme]);
	
	const download = useCallback(() => {
		if (svgContainer.current) {
			const content =
                'data:application/octet-stream,' +
                encodeURIComponent(svgContainer.current.innerHTML);
			setSvgFile(content)
		}
	}, [])

	const changeTheme = useCallback((index: number) => {
		gStateUpdater(state => {
			state.colorSchemeIndex = index;
		})
	}, [gStateUpdater]);

	useEffect(() => {
		if (dllink.current && svgFile !== '') {
            dllink.current.click();
        }
	}, [svgFile])

	return (
        <div className="App">
            <PageHeader>
                <Menu>
                    <Menu.Item>JK Designer</Menu.Item>
                </Menu>
            </PageHeader>
            <PageContainer>
                <Row>
                    <Col span={16}>
                        <div style={{ marginBottom: '1em' }}>
                            <Select
                                value={gState.colorSchemeIndex}
                                onChange={changeTheme}
                            >
                                {gState.colorSchemePool.map(
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
                        <div ref={svgContainer}>
                            <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    width: `${SIZE}px`,
                                    height: `${SIZE}px`,
                                }}
                            >
                                <MaskLayer
                                    width={SIZE}
                                    height={SIZE}
                                    pixSize={2}
                                />
                                <g>
                                    <HorizontalGroup segments={segments} />
                                    <VerticalGroup segments={segments} />
                                </g>
                            </svg>
                        </div>
                        <div>
                            <Button type="primary" onClick={download}>
                                下载svg文件
                            </Button>
                            <a
                                style={{ display: 'none' }}
                                download="skirt-plaid-pattern.svg"
                                ref={dllink}
                                href={svgFile}
                            >
                                download
                            </a>
                        </div>
                    </Col>
                    <Col span={8}>
                        <Designer
                            colorGrids={gState.colorGrids}
                            colorPool={colorScheme}
                            updater={gStateUpdater}
                        />
                    </Col>
                </Row>
            </PageContainer>
            {/* <svg style={{ width: `${SIZE}px`, height: `${SIZE}px` }}>
                <MaskLayer />
                <g transform="scale(0.5, 0.5)">
                    <HorizontalGroup segments={segments} />
                    <VerticalGroup segments={segments} />
                </g>
                <g transform={`translate(0, ${SIZE / 2}) scale(0.5, 0.5)`}>
                    <HorizontalGroup segments={segments} />
                    <VerticalGroup segments={segments} />
                </g>
                <g transform={`translate(${SIZE / 2}, 0) scale(0.5, 0.5)`}>
                    <HorizontalGroup segments={segments} />
                    <VerticalGroup segments={segments} />
                </g>
                <g transform={`translate(${SIZE / 2}, ${SIZE / 2}) scale(0.5, 0.5)`}>
                    <HorizontalGroup segments={segments} />
                    <VerticalGroup segments={segments} />
                </g>
            </svg> */}
        </div>
    );
}
function App() {
    return (
        <GSContext>
            <Core />
        </GSContext>
    );
}

export default App;
