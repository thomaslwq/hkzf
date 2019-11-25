import React,{ Fragment } from "react"
import { HashRouter as Router,Route} from "react-router-dom"
import Home from "./pages/Home"
import List from "./pages/List"
import News from "./pages/News"
import Profile from "./pages/Profile"

 export default class TabBarExample extends React.Component {

      render(){
        return <Fragment>
          <Router>
            <Route path="/" exact render={()=> <Home/>}></Route>
            <Route path="/List" exact render={()=> <List/>}></Route>
            <Route path="/News" exact render={()=><News/>}></Route>
            <Route path="/Profile" exact render={()=><Profile/>}></Route>
          </Router>
        </Fragment>
      }

  }
