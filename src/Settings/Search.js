import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { backgroundColor2, fontSize2 } from '../Shared/Styles';
import { AppContext } from '../App/AppProvider';
import fuzzy from  'fuzzy'; 

const SearchGrid = styled.div`
    display: grid;
    grid-template-columns: 250px 1fr;
`;

const SearchInput = styled.input`
    ${backgroundColor2};
    ${fontSize2};
    color: #1163c9;
    place-self: center left;
    border: 1px solid;
    border-radius: 2px;
    height: 25px;
`;

const handleFilter = _.debounce((inputValue, setFilteredCoins, coinList) => {
        let coinKeys = Object.keys(coinList);
        let coinNames = coinKeys.map(key  => coinList[key].CoinName);
        let searchableStrings = coinKeys.concat(coinNames);
        let fuzzyResult = fuzzy
            .filter(inputValue, searchableStrings, {})
            .map(result => result.string);

        console.log(fuzzyResult);
        let filteredCoins = _.pickBy(coinList, (result, symKey) => {
            let coinName = result.CoinName;
            return (_.includes(fuzzyResult, symKey) || _.includes(fuzzyResult, coinName))
        });

        console.log(filteredCoins);

        setFilteredCoins(filteredCoins);
}, 500);

function filterCoins(e, setFilteredCoins, coinList){
    let inputValue = e.target.value;
    if (!inputValue){
        setFilteredCoins(null);
    }
    handleFilter(inputValue, setFilteredCoins, coinList);
}

export default function(){
    return (
        <AppContext.Consumer>
            {({setFilteredCoins, coinList}) => 
                <SearchGrid>
                    <h2>Search for that coin</h2>
                    <SearchInput onKeyUp={(e) => filterCoins(e, setFilteredCoins, coinList)} />
                </SearchGrid>
            }
        </AppContext.Consumer>
    );
}