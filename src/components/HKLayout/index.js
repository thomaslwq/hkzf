import React, { Fragment, Component } from 'react'
import { TabBar } from "antd-mobile"
import { withRouter } from "react-router-dom"
class HKLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "Home"
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#21b97a"
                        barTintColor="white"
                    >
                        <TabBar.Item
                            title="首页"
                            key="Home"
                            icon={<i className="iconfont icon-ind"></i>}
                            selectedIcon={<i className="iconfont icon-ind"></i>}
                            selected={this.props.match.url === '/'}
                            onPress={() => {
                                this.props.history.push("/")
                            }}
                        >
                            {this.props.match.url === '/'&&this.props.children}
                        </TabBar.Item>
                        <TabBar.Item
                            icon={<i className="iconfont icon-findHouse"></i>}
                            selectedIcon={<i className="iconfont icon-findHouse"></i>}
                            title="找房"
                            key="List"
                            selected={this.props.match.url === '/List'}
                            onPress={() => {

                                this.props.history.push("/List")
                            }}
                        >
                            { this.props.match.url === '/List' && this.props.children}
                        </TabBar.Item>
                        <TabBar.Item
                            icon={<i className="iconfont icon-infom"></i>}
                            selectedIcon={<i className="iconfont icon-infom"></i>}
                            title="资讯"
                            key="News"
                            selected={this.props.match.url === '/News'}
                            onPress={() => {
                                this.props.history.push("/News")
                            }}
                        >
                            {this.props.match.url === '/News'&&this.props.children}
                        </TabBar.Item>
                        <TabBar.Item
                            icon={<i className="iconfont icon-myinfo"></i>}
                            selectedIcon={<i className="iconfont icon-myinfo"></i>}
                            title="我的"
                            key="Profile"
                            selected={this.props.match.url === '/Profile'}
                            onPress={() => {

                                this.props.history.push("/Profile")
                            }}
                        >
                            {this.props.match.url === '/Profile'&&this.props.children}
                        </TabBar.Item>
                    </TabBar>
                </div>

            </Fragment>
        )
    }
}

export default withRouter(HKLayout)