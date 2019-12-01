import React, { Fragment, Component } from 'react'
import { NavBar, Icon } from "antd-mobile"
import SearchInput from '../../components/SearchInput'
import "./index.scss"
import store from '../../store'
import { axios } from "../../utils/request"
import { REACT_APP_API_URL } from '../../utils/urls'
import { AutoSizer,List } from "react-virtualized"
import HKFilter from "../../components/HKFilter"

/* 
    列表实现的思路：
    1. 筛选功能
    2. 列表 使用react-virtualized 来实现
    a. 列表有一个默认的长度 10 
    b. 滚动的时候呢，会做动态加载 如何判断已经滚动到底部了
    c. 返回的数据 追加到原有数据上面

*/
export default class Index extends Component {

    state = {
        house_list: []
    }

    constructor(props) {
        super(props);

    }
    QueryParams = {
        //开始数
        start: 1,
        //结束数
        end: 20
    }
    count = 20
    pageSize = 20;
    loading = false;
    componentDidMount() {
        let cityName = store.getState().mapReducer.cityName;
        if (cityName)
            this.getLists();
    }

    getLists = async () => {
        let cityName = store.getState().mapReducer.cityName;
        //获取当前城市的ID
        if (!this.QueryParams.cityId) {
            let cityId = (await axios.get("/area/info?name=" + cityName)).body.value;
            this.QueryParams.cityId = cityId;
        }
        //获取房屋的信息
        let house_list = (await axios.get("/houses", { params: this.QueryParams })).body;
        let count = house_list.count;
        this.count = count;
        this.loading = false;
        this.setState({
            house_list: [...this.state.house_list, ...house_list.list],
        })

    }
    renderHouseList = (params) => {
        return (
            <Fragment>
                {
                    this.state.house_list.map(v =>
                        <div className="hk_house_list_item">
                            <div className="img_wrap">
                                <img src={REACT_APP_API_URL + v.houseImg} alt=""></img>
                            </div>
                            <div className="item_content">
                                <div className="houseInfo1">{v.title}</div>
                                <div className="houseInfo2">{v.desc}</div>
                                <div className="houseInfo3">{v.tags.map(vv => <span>{vv}+{" "}</span>)}</div>
                                <div className="houseInfo4">{v.price}元/月</div>
                            </div>
                            <div></div>
                        </div>
                    )
                }
            </Fragment>
        )
    }
    handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
        if( (clientHeight - scrollHeight - scrollTop) < 20){
            if(this.QueryParams.end < this.count && !this.loading){
                this.QueryParams.start +=this.pageSize;
                this.QueryParams.end +=this.pageSize;
                this.loading = true;
                this.getLists();
            }
        }
    }
    handleFilterChange = (filterValue) => {
        //拼装起来 发送数据  filterValue:[[],[],[],[]]
        let params = {
            [filterValue[0][0]]:filterValue[0][2] !=null ?filterValue[0][2]:filterValue[0][1],
            rentType:filterValue[1][0],
            price:filterValue[1][0],
            more:filterValue[3].join(",")
        }
        this.QueryParams =  Object.assign(this.QueryParams,params);
        this.setState({
            house_list:[]
        })
        this.getLists();
    }
    

    render() {
        return (
            <Fragment>
                <div className="hk_house_list">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => window.history.go(-1)}
                        style={{
                            position: "relative",
                            "backgroundColor": "#f6f5f6"
                        }}
                    >
                        <div className="hk_house_list_header">
                            <SearchInput />
                        </div>
                    </NavBar>
                    {/* 
                        筛选框开始
                    */}

                    <div className="filter_list">
                        <HKFilter handleFilterChange = {this.handleFilterChange}/>
                    </div>

                    {/* 
                        筛选框结束
                    */}


                    {/* 
                        房源列表开始
                    */}
                    <div className="hk_house_list_content">
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    rowCount={this.state.house_list.length}
                                    rowHeight={160}
                                    rowRenderer={this.renderHouseList}
                                    width={width}
                                    onScroll={this.handleScroll}
                                />
                            )}
                        </AutoSizer>

                    </div>

                    {/* 
                        房源列表结束
                    */}


                </div>
            </Fragment>
        )
    }
}
