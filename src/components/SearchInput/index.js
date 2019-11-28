import React, { Component, Fragment } from 'react'
import "./index.scss"
import store from "../../store"
import { withRouter } from 'react-router-dom'
 class Index extends Component {
    state = {
        cityName:""
    }
    Unsubscribe = null;
    constructor(props){
        super(props);
        this.state = {
            cityName: store.getState().mapReducer.cityName
        }
        this.Unsubscribe = store.subscribe(this.handleCityNameChange);

    }
    handleCityNameChange = (params) => {
        this.setState({
            cityName: store.getState().mapReducer.cityName 
        })
    }
    componentWillUnmount(){
        this.Unsubscribe();
    }
    
    render() {
        return (
            <Fragment>
                <div className="search_input">
                    <div className="si_city">
                        <div className="si_city_name" onClick={(params) => {
                            this.props.history.push("/CityList")
                        }
                        }>
                            <span>{ this.state.cityName}</span>
                            <i className="iconfont icon-arrow"></i>
                        </div>
                        <div className="si_city_inp">
                            <i className="iconfont icon-seach"></i>
                            <span>请输入小区或地址</span>
                        </div>
                    </div>
                    <div className="si_map" onClick={ (params) => {
                        this.props.history.push("/BMap")
                    }
                    }>
                        <i className="iconfont icon-map"></i>
                    </div>
                </div>

            </Fragment>
        )
    }
}

export default withRouter(Index)