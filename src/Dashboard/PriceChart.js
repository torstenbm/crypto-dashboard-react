import React from 'react';
import styled from 'styled-components';
import highchartsConfig from './HighchartsConfig';
import ReactHighcharts from 'react-highcharts'
import { AppContext } from '../App/AppProvider';
import { Tile } from '../Shared/Tile';
import HighchartsTheme from './HighchartsTheme';
import ChartSelect from './ChartSelect';
ReactHighcharts.Highcharts.setOptions(HighchartsTheme);


export default function(){
    return <AppContext.Consumer>
        {({historical, changeChartSelect}) => 
            <Tile>
                <ChartSelect
                    defaultValue={"months"}
                    onChange={e => changeChartSelect(e.target.value)}
                >
                    <option value="days"> 
                        Days
                    </option>
                    <option value="weeks">
                        Weeks
                    </option>
                    <option value="months">
                        Months
                    </option>
                </ChartSelect>
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