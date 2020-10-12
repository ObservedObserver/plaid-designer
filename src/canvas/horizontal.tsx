import React from 'react';
import { ColorSegment } from '../interfaces';

interface HorProps {
    segments: ColorSegment[];
}
const HorizontalGroup: React.FC<HorProps> = props => {
    const { segments } = props;
    return <g>
        {
            segments.map((seg, i) => <rect key={i} width="100%" x="0" height={seg.end - seg.start} y={seg.start} fill={seg.color} />)
        }
    </g>
}

export default HorizontalGroup;
