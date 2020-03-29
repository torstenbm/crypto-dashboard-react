import React from 'react';
import { AppContext } from '../App/AppProvider';

 export default function(props){
     return <AppContext.Consumer>
         {({coinList, prices, firstVisit}) => {
             if (!coinList){
                 return <div>Loading that coin</div>
             } else if(!firstVisit && !prices){
                 return <div>Loading those prices</div>
             }
            return <div>{ props.children }</div>
         }}
     </AppContext.Consumer>
 }