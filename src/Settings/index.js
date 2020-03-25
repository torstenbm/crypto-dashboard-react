import React from 'react';
import Welcome from './WelcomeMessage';
import ConfirmButton from './ConfirmButton';
import CoinGrid from './CoinGrid';
import Page from '../Shared/Page';

export default function(){
    return (
        <Page name="settings">
            <Welcome />
            <ConfirmButton />
            <CoinGrid />
        </Page>
    )
}
