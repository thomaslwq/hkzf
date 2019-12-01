import React,{ Fragment } from "react"
import { HashRouter as Router,Route} from "react-router-dom"
import Home from "./pages/Home"
import List from "./pages/List"
import News from "./pages/News"
import Profile from "./pages/Profile"
import HKLayout from "./components/HKLayout"
import { getCityNameAction } from './store/actionCreator'
import BMap from './pages/BMap'
import CityList from './pages/CityList'

import store from "./store"


 export default class TabBarExample extends React.Component {


      componentDidMount(){
        this.getLocalCity();
      }
      getLocalCity = (params) => {
        let map = new window.BMap.LocalCity();
        map.get((result) => {
          const cityName = "广州" || result.name;
          store.dispatch(getCityNameAction(cityName));
        }
        )

      }
      

      render(){
        return <Fragment>
          <Router>
            <Route path="/" exact render={()=> <HKLayout><Home/></HKLayout>}></Route>
            <Route path="/List" exact render={()=><HKLayout> <List/></HKLayout>}></Route>
            <Route path="/News" exact render={()=><HKLayout><News/></HKLayout>}></Route>
            <Route path="/Profile" exact render={()=><HKLayout><Profile/></HKLayout>}></Route>
            <Route path="/CityList" exact component={CityList}></Route>
            <Route path="/BMap" exact component={BMap}></Route>
          </Router>
        </Fragment>
      }

  }
