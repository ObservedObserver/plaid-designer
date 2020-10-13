import React from 'react';
import styled from 'styled-components';

const ColorContainer = styled.div`
    display: flex;
    height: 28px;
    width: 360px;
    padding: 4px;
`;

const ColorBlock = styled.div<{ color: string }>`
    flex-grow: 1;
    background-color: ${ props => props.color };
`

interface ColorSchemeProps {
    colorPool: string[];
}
const ColorScheme: React.FC<ColorSchemeProps> = props => {
    const { colorPool } = props;
    return <ColorContainer>
        {
            colorPool.map(color => <ColorBlock key={color} color={color} />) 
        }
    </ColorContainer>
}

export default ColorScheme;
