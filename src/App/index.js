import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';

import {AppProvider} from './AppProvider';
import Welcome from './WelcomeMessage';
import AppLayout from './AppLayout';
import AppBar from './AppBar';
import Settings from '../Settings';


class App extends Component {
  render(){
    return (
      <AppLayout>
        <AppProvider>
          <AppBar />
          <Welcome />
          <Settings />
        </AppProvider>
      </AppLayout>
    );
  }
}

export default App;
