import React from 'react';
import _ from 'lodash';
import moment from 'moment';

const cc = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVORITES = 10;
const TIME_UNITS = 10 ;

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state  = {
            page: 'dashboard',
            timeUnit: 'months', 
            favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            ...this.getSavedSettings(),
            setPage: this.setPage,
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            confirmFavorites: this.confirmFavorites,
            isInFavorites: this.isInFavorites,
            setFilteredCoins: this.setFilteredCoins,
            setCurrentFavorite: this.setCurrentFavorite,
            changeChartSelect: this.changeChartSelect
        }
    } 

    changeChartSelect = value => {
        this.setState({timeUnit: value,  historical: null}, this.fetchHistorical);
    }

    setCurrentFavorite = sym => {
        this.setState({currentFavorite: sym, historical: null},
            () => this.fetchHistorical());
        localStorage.setItem('data', JSON.stringify({
            ...JSON.parse(localStorage.getItem('data')),
            currentFavorite: sym
        }));
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
        this.fetchHistorical();
    }

    fetchHistorical = async () => {
        if(this.state.firstVisit) return;
        let results = await this.historical();
        let historical = [
            {
                name: this.state.currentFavorite,
                data: results.map((ticker, index) => [
                    moment().subtract({[this.state.timeUnit]: TIME_UNITS - index}).valueOf(),
                    ticker.USD
                ])
            }
        ];
        this.setState({historical});
    }

    historical = () => {
        let promises = [];
        for (let unit = TIME_UNITS; unit > 0; unit--){
            promises.push(
                cc.priceHistorical(
                    this.state.currentFavorite,
                    ['USD'],
                    moment().subtract({[this.state.timeUnit]: unit}).toDate()
                )
            );
        }
        return Promise.all(promises);
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
        console.log(prices);
        prices = prices.filter(price => Object.keys(price).length);
        this.setState({prices});
    }

    confirmFavorites = () => {
        let currentFavorite = this.state.favorites[0]
        this.setState({
            firstVisit: false,
            page: 'dashboard',
            currentFavorite
        }, () => {
            this.fetchPrices();
            this.fetchHistorical();
        });
        localStorage.setItem('data', JSON.stringify({
            favorites: this.state.favorites,
            currentFavorite: currentFavorite
        }))
    }

    getSavedSettings(){
        let data = JSON.parse(localStorage.getItem('data'));
        if (!data){
            return { page: "settings", firstVisit: true };
        } 
        let {favorites, currentFavorite} = data;
        return {favorites, currentFavorite};
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
