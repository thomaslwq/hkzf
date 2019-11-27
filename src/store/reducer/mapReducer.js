import {GET_CITY_NAME } from '../actionTypes'

const defaultState = {
    cityName:""
}

export default (state = defaultState,action) => {
    const { type,value } = action;
    let newState = JSON.parse(JSON.stringify(state));
    switch(type){
        case GET_CITY_NAME:
            newState.cityName = value;
            return newState;
        default:
            return state;
    }
    
}
