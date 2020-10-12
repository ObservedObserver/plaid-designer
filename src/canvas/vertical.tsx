import React from 'react';
import { ColorSegment } from '../interfaces';

interface VerProps {
    segments: ColorSegment[];
}
const VerticalGroup: React.FC<VerProps> = props => {
    const { segments } = props;
    return (
        <g>
            {segments.map((seg, i) => (
                <rect
                    key={i}
                    height="100%"
                    y="0"
                    width={seg.end - seg.start}
                    x={seg.start}
                    fill={seg.color}
                    mask="url(#Mask)"
                />
            ))}
        </g>
    );
}

export default VerticalGroup;
