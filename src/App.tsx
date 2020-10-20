import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaskLayer from './canvas/mask';
import HorizontalGroup from './canvas/horizontal';
import VerticalGroup from './canvas/vertical';
import { ColorSegment } from './interfaces';
import { colorGrid2Segment } from './utils';
import Designer from './designer/index';
import { PageHeader, PageContainer } from './components/page';
import { GSContext, useStore } from './store';
import { Button, Menu, Row, Col, Select, Modal } from 'antd';
import './App.css';
import ColorScheme from './components/colorScheme';

const SIZE = 400;
function Core() {
	const svgContainer = useRef<HTMLDivElement>(null);
	const dllink = useRef<HTMLAnchorElement>(null);
	const previewCanvas = useRef<HTMLCanvasElement>(null);
	const [gState, gStateUpdater] = useStore();
	const [svgFile, setSvgFile] = useState<string>('');
	const [preview, setPreview] = useState<boolean>(false);

	const colorScheme = useMemo<string[]>(() => {
		return gState.colorSchemePool[gState.colorSchemeIndex];
	}, [gState.colorSchemeIndex, gState.colorSchemePool])

	const segments = useMemo<ColorSegment[]>(() => {
        return colorGrid2Segment(gState.colorGrids, SIZE, colorScheme);
	}, [gState.colorGrids, colorScheme]);

	const exportPNG = useCallback(() => {
		// debugger
        if (svgContainer.current) {
            const content =
                'data:image/svg+xml;base64,' +
                btoa(svgContainer.current.innerHTML);
            const img = new Image();
			img.src = content;
			img.width = SIZE;
			img.height = SIZE;
			img.onload = () => {
				console.log('content', content);
                if (previewCanvas.current) {
                    const ctx = previewCanvas.current.getContext('2d');
                    if (ctx) {
						ctx.drawImage(img, 0, 0, SIZE / 2, SIZE / 2);
						ctx.drawImage(img, 0, SIZE / 2, SIZE / 2, SIZE / 2);
						ctx.drawImage(img, SIZE / 2, 0, SIZE / 2, SIZE / 2);
						ctx.drawImage(img, SIZE / 2, SIZE / 2, SIZE / 2, SIZE / 2);
                    }
                }
			}
        }
	}, []);
	
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
    
    // const generateGrid = useCallback(() => {
    //     gStateUpdater(state => {
    //         state.colorGrids = gridList.map((n, i) => ({
    //             size: n,
    //             color:
    //                 Math.floor(
    //                     (1 - orderMap.get(n)! / orderMap.size) * 5 +
    //                         relu(Math.sin(((Math.PI * 2) / 4) * i)) +
    //                         5
    //                 ) % 5,
    //         }));
    //     })
    // }, [])

	const togglePreview = useCallback(() => {
		setPreview(v => {
			if (!v) {
				exportPNG();
			}
			return !v;
		});
	}, []);

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
                            <Button>重新生成格纹</Button>
                            <Button type="primary" onClick={download}>
                                下载svg文件
                            </Button>
                            <Button style={{ marginLeft: '4px' }} onClick={togglePreview}>预览</Button>
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
            <Modal
                title="预览"
                visible={preview}
                onOk={togglePreview}
                onCancel={togglePreview}
            >
				<canvas width={SIZE} height={SIZE} ref={previewCanvas}></canvas>
                {/* <svg style={{ width: `${SIZE}px`, height: `${SIZE}px` }}>
                    <MaskLayer width={SIZE} height={SIZE} pixSize={2} />
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
                    <g
                        transform={`translate(${SIZE / 2}, ${
                            SIZE / 2
                        }) scale(0.5, 0.5)`}
                    >
                        <HorizontalGroup segments={segments} />
                        <VerticalGroup segments={segments} />
                    </g>
                </svg> */}
            </Modal>
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
