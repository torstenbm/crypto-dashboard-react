import React from 'react';
import styled, { css } from 'styled-components';
import { CoinHeaderGridStyled } from '../Settings/CoinHeaderGrid';
import { SelectableTile } from '../Shared/Tile';
import { fontSize3, fontSizeBig, greenBoxShadow } from '../Shared/Styles';
import { AppContext } from '../App/AppProvider';

const numberFormat = number => +(number+"").slice(0,5);

const ChangePct = styled.div`
    color: green;
    ${props => props.red && css`
        color: red;
    `}
`;

const TickerPrice =  styled.div`
    ${fontSizeBig};

`;

const JustifyRight = styled.div`
    justify-self: right;
`;

const JustifyLeft = styled.div`
    justify-self: left;
`;

const PriceTileStyled = styled(SelectableTile)`
   ${props => props.compact && css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 5px;
        justify-items: right;
        ${fontSize3};
   `} 
   ${props => props.currentFavorite && css`
        ${greenBoxShadow};
        pointer-events: none; 
   `}
`;

function ChangePercent({data}){
    return (
    <JustifyRight>
        <ChangePct red={data.CHANGEPCT24HOUR < 0}>
            {data.CHANGEPCT24HOUR >= 0 ? "+" : null}{numberFormat(data.CHANGEPCT24HOUR)+"%"}
        </ChangePct>
    </JustifyRight>)
}

function PriceTile({sym, data, currentFavorite, setCurrentFavorite}){
    return (
        <PriceTileStyled onClick={()=>setCurrentFavorite(sym)} currentFavorite={currentFavorite}>
            <CoinHeaderGridStyled>
                <div>{sym}</div>
                <ChangePercent data={data} />
            </CoinHeaderGridStyled>
            <TickerPrice>
                ${numberFormat(data.PRICE)}
            </TickerPrice>
        </PriceTileStyled>
    );
}

function PriceTileCompact({sym, data, currentFavorite, setCurrentFavorite}){
    return (
        <PriceTileStyled onClick={()=>setCurrentFavorite(sym)} currentFavorite={currentFavorite} compact>
            <JustifyLeft>{sym}</JustifyLeft>
            <ChangePercent data={data} />
            <div>
                ${numberFormat(data.PRICE)}
            </div>
        </PriceTileStyled> 
    );
}

export default function({price, index}){
    let sym = Object.keys(price)[0];
    let data = price[sym]['USD'];
    let TileClass = index <  5 ? PriceTile : PriceTileCompact;

    return (
        <AppContext.Consumer>
            { ({currentFavorite, setCurrentFavorite}) => 
                <TileClass 
                    sym={sym} 
                    data={data} 
                    currentFavorite={currentFavorite === sym} 
                    setCurrentFavorite={setCurrentFavorite}
                />}
        </AppContext.Consumer> 
    )
}