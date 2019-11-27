import { GET_CITY_NAME } from '../actionTypes'
export const getCityNameAction = (cityName) => {
    return {
        type: GET_CITY_NAME,
        value:cityName
    }
}
