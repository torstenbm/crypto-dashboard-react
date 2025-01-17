import React from 'react';
import styled, { css } from 'styled-components';
import { AppContext } from  './AppProvider';

const Logo = styled.div`
    font-size: 1.5em;
`;

const Bar = styled.div`
    display: grid;
    margin-bottom: 40px;
    grid-template-columns: 280px auto 100px 100px;
`;

const ControlButtonElement = styled.div`
    cursor: pointer;
    ${ props => props.active && css`
        text-shadow: 0px 0px 60px #03ff03;
    `}
    ${ props => props.hidden && css`
        display: none;
    `}
`;

const toProperCase = s => s[0].toUpperCase() + s.substr(1);

function ControlButton({name, active}){
    return(
        <AppContext.Consumer>
            {({page, setPage, firstVisit}) => 
                <ControlButtonElement 
                    active={page === name}
                    onClick={() => setPage(name)}
                    hidden={firstVisit && name  === 'dashboard'}
                    >
                    { toProperCase(name) }
                </ControlButtonElement>           
            }
        </AppContext.Consumer>
    );
}

export default function(){
    return (
        <Bar> 
            <Logo>Crypto Sentiment Project</Logo>
            <div />
            <ControlButton name="dashboard" active/>
            <ControlButton name="settings" />
        </Bar>
    );
}