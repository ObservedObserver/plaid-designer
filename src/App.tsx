import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaskLayer from './canvas/mask';
import HorizontalGroup from './canvas/horizontal';
import VerticalGroup from './canvas/vertical';
import { ColorSegment } from './interfaces';
import { colorGrid2Segment } from './utils';
import Designer from './designer/index';
import { GSContext, useStore } from './store';
import { Button } from '@material-ui/core';
const SIZE = 400;
function Core() {
	const svgContainer = useRef<HTMLDivElement>(null);
	const dllink = useRef<HTMLAnchorElement>(null);
	const [gState, gStateUpdater] = useStore();
	const [svgFile, setSvgFile] = useState<string>('');

	const segments = useMemo<ColorSegment[]>(() => {
        return colorGrid2Segment(gState.colorGrids, SIZE, gState.colorPool);
	}, [gState.colorGrids, gState.colorPool]);
	
	const download = useCallback(() => {
		if (svgContainer.current) {
			const content =
                'data:application/octet-stream,' +
                encodeURIComponent(svgContainer.current.innerHTML);
			setSvgFile(content)
		}
	}, [])

	useEffect(() => {
		if (dllink.current && svgFile !== '') {
            dllink.current.click();
        }
	}, [svgFile])

	return (
        <div className="App">
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
            <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 3 }}>
                    <div ref={svgContainer}>
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                width: `${SIZE}px`,
                                height: `${SIZE}px`,
                            }}
                        >
                            <MaskLayer width={SIZE} height={SIZE} pixSize={2} />
                            <g>
                                <HorizontalGroup segments={segments} />
                                <VerticalGroup segments={segments} />
                            </g>
                        </svg>
                    </div>
                    <div>
                        <Button onClick={download}>download</Button>
						<a style={{ display: 'none' }} download="skirt-plaid-pattern.svg" ref={dllink} href={svgFile}>download</a>
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <Designer
                        colorGrids={gState.colorGrids}
                        colorPool={gState.colorPool}
                        updater={gStateUpdater}
                    />
                </div>
            </div>
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
