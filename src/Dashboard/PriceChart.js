import React from 'react';
import styled from 'styled-components';
import highchartsConfig from './HighchartsConfig';
import ReactHighcharts from 'react-highcharts'
import { AppContext } from '../App/AppProvider';
import { Tile } from '../Shared/Tile';
import HighchartsTheme from './HighchartsTheme';
ReactHighcharts.Highcharts.setOptions(HighchartsTheme);
export default function(){
    return <AppContext.Consumer>
        {({historical}) => 
            <Tile>
                {
                    historical ?
                        <ReactHighcharts 
                            config={highchartsConfig(historical)}
                        />
                        :
                        <div>Loading coin chart...</div>
                }
                
            </Tile>
        }
    </AppContext.Consumer>
}