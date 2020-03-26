import React from 'react';
import _ from 'lodash';

const cc = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVORITES = 10;

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state  = {
            page: 'dashboard', 
            favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.getSavedSettings(),
            setPage: this.setPage,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            confirmFavorites: this.confirmFavorites,
            isInFavorites: this.isInFavorites,
            setFilteredCoins : this.setFilteredCoins
        }
    } 

    isInFavorites = key => _.includes(this.state.favorites, key);
    
    addCoin = key => {
        let favorites = [...this.state.favorites];
        if (favorites.length < MAX_FAVORITES){
            favorites.push(key);
            this.setState({favorites});
        }
    }

    removeCoin = key => {
        let favorites = [...this.state.favorites];
        this.setState({favorites: _.pull(favorites, key)});
    }

    componentDidMount(){
        this.fetchCoins();
        this.fetchPrices();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({coinList});
    }

    prices = async () => {
        let returnData = [];
        for (let i = 0; i < this.state.favorites.length; i++){
            try {
                let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
                returnData.push(priceData);
            } catch(e) {
                 console.warn('Price fetch error: ' + e);
            }
        }
        return returnData;
    }

    fetchPrices = async () => {
        if(this.state.firstVisit) return;
        let prices = await this.prices();
        prices = prices.filter(price => Object.keys(price).length);
        this.setState({prices});
    }

    confirmFavorites = () => {
        this.setState({
            firstVisit: false,
            page: 'dashboard'
        }, () => {
            this.fetchPrices();
        });
        localStorage.setItem('data', JSON.stringify({
            favorites: this.state.favorites
        }))
    }

    getSavedSettings(){
        let data = JSON.parse(localStorage.getItem('data'));
        if (!data){
            return { page: "settings", firstVisit: true };
        } 
        let favorites = data.favorites;
        return {favorites};
    }
    
    setPage = page => this.setState({page});
    
    setFilteredCoins = filteredCoins => this.setState({filteredCoins}); 

    render(){
        return (
            <AppContext.Provider value={this.state}>
                { this.props.children }
            </AppContext.Provider>
        );
    }
}
