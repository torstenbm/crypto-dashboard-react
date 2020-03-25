import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';

import {AppProvider} from './AppProvider';
import Welcome from './WelcomeMessage';
import AppLayout from './AppLayout';
import AppBar from './AppBar';


class App extends Component {
  render(){
    return (
      <AppLayout>
        <AppProvider>
          <AppBar />
          <Welcome />
        </AppProvider>
      </AppLayout>
    );
  }
}

export default App;
