import React,{ Fragment } from "react"
import { HashRouter as Router,Route} from "react-router-dom"
import Home from "./pages/Home"
import List from "./pages/List"
import News from "./pages/News"
import Profile from "./pages/Profile"
import HKLayout from "./components/HKLayout"
import { getCityNameAction } from './store/actionCreator'
import store from "./store"


 export default class TabBarExample extends React.Component {


      componentDidMount(){
        this.getLocalCity();
      }
      getLocalCity = (params) => {
        let map = new window.BMap.LocalCity();
        map.get((result) => {
          const cityName = result.name;
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
          </Router>
        </Fragment>
      }

  }
