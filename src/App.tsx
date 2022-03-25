import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaskLayer from './canvas/mask';
import HorizontalGroup from './canvas/horizontal';
import VerticalGroup from './canvas/vertical';
import Designer from './designer/index';
import { PageHeader, PageContainer } from './components/page';
// import { GSContext, useStore } from './store';
import { useGlobalStore, StoreWrapper } from './store/store'
import { Button, Menu, Row, Col,  Modal } from 'antd';
import './App.css';
import InitPanel from './designer/init';
import { observer } from 'mobx-react-lite';
import ColorPool from './components/colorPool';
import ParseSegment from './components/parse';

const SIZE = 400;
function Core() {
	const svgContainer = useRef<HTMLDivElement>(null);
	const dllink = useRef<HTMLAnchorElement>(null);
	const previewCanvas = useRef<HTMLCanvasElement>(null);
	// const [gState, gStateUpdater] = useStore();
    const { commonStore } = useGlobalStore();
	const [svgFile, setSvgFile] = useState<string>('');
	const [preview, setPreview] = useState<boolean>(false);

	const { segments } = commonStore;

	// const segments = useMemo<ColorSegment[]>(() => {
    //     return colorGrid2Segment(gState.colorGrids, SIZE, colorScheme);
	// }, [gState.colorGrids, colorScheme]);

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
                    <Menu.Item>Plaid Designer</Menu.Item>
                </Menu>
            </PageHeader>
            <PageContainer>
                <Row>
                    <Col span={16}>
                        <ColorPool />
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
                            <InitPanel />
                        </div>
                        <div>
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
                        <div>
                        <ParseSegment />
                        </div>
                    </Col>
                    <Col span={8}>
                        <Designer />
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

const ObCore = observer(Core);
function App() {
    return (
        <StoreWrapper>
            <ObCore />
        </StoreWrapper>
    );
}

export default App;
