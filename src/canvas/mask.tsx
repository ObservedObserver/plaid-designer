import React, { useMemo } from 'react';
import { getMaskMatrix, maskMatrix2PathList } from './slopLine';
const PIX_SIZE = 5;
interface MaskLayerProps {
    width: number;
    height: number;
    pixSize: number;
}
const MaskLayer: React.FC<MaskLayerProps> = props => {
    const { width, height, pixSize } = props;
    const maskMat = useMemo(() => {
        return getMaskMatrix(width, height, pixSize);
    }, [width, height, pixSize])

    const pathList = useMemo(() => {
        return maskMatrix2PathList(maskMat);
    }, [maskMat])
    
    return (
        <defs>
            <mask id="Mask">
                {pathList.map((path, i) => (
                    <path key={i} d={path} fill="white"></path>
                ))}
            </mask>
        </defs>
    );
}

export default MaskLayer;
