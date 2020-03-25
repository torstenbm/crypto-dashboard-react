import React from 'react';

const cc = require('cryptocompare');

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
    constructor(props){
        super(props);
        this.state  = {
            ...this.getSavedSettings(),
            setPage: this.setPage,
            confirmFavorites: this.confirmFavorites
        }
    }
    componentDidMount(){
        this.fetchCoins();
    }
    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data;
        this.setState({coinList});
    }
    confirmFavorites = () => {
        this.setState({
            firstVisit: false,
        });
        localStorage.setItem('data', JSON.stringify({
            test: 'hello'
        }))
    }
    getSavedSettings(){
        let data = JSON.parse(localStorage.getItem('data'));
        if (!data){
            return { page: "settings", firstVisit: true };
        } 
        return {};
    }
    
    setPage = page => this.setState({page});
    
    render(){
        return (
            <AppContext.Provider value={this.state}>
                { this.props.children }
            </AppContext.Provider>
        );
    }
}
