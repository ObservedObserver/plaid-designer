import React, { useMemo } from 'react';
import MaskLayer from './canvas/mask';
import HorizontalGroup from './canvas/horizontal';
import VerticalGroup from './canvas/vertical';
import { ColorGrid, ColorSegment } from './interfaces';
import { colorGrid2Segment } from './utils';
import Designer from './designer/index';
import { GSContext, useStore } from './store';
const SIZE = 400;
function Core() {
	const [gState, gStateUpdater] = useStore();

	const segments = useMemo<ColorSegment[]>(() => {
		return colorGrid2Segment(gState.colorGrids, SIZE)
	}, [gState.colorGrids]);

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
            <svg style={{ width: `${SIZE}px`, height: `${SIZE}px` }}>
                <MaskLayer width={SIZE}  height={SIZE} pixSize={2} />
                <g>
                    <HorizontalGroup segments={segments} />
                    <VerticalGroup segments={segments} />
                </g>
            </svg>
            <div>
                <Designer
                    colorGrids={gState.colorGrids}
                    colorPool={gState.colorPool}
                    updater={gStateUpdater}
                />
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
