/* 

    1. 获取当前城市注意点
    a. 如果从首页进来的，那么你是可以直接获取到当前城市信息的
    b.如果不是从首页进来的，那么你获取到的值是空值
      b.1 不让它访问这个页面 直接跳转到首页/再一次手动获取城市定位
      b.2 你再一次获取当前城市的定位信息
    2.获取到的城市列表的数据格式 应该是怎么样的呢？

*/

import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import store from '../../store'
import { getCityNameAction } from '../../store/actionCreator'
import { axios } from "../../utils/request"
import { List, AutoSizer } from "react-virtualized"
import "./index.scss"
class Index extends Component {
    state = {
        totalCity: [], //放置了当前城市 热门城市 城市列表
        keyArr: [],//放置了字母的首字母缩写
        selectIndex:0 //被选中的行的位置
    }

    constructor(props) {
        super(props);
        this.MainList = React.createRef();
    }
    componentDidMount() {
        const { mapReducer } = store.getState();
        const cityName = mapReducer.cityName;
        //获取当前城市的定位
        if (!cityName) {
            let map = new window.BMap.LocalCity();
            map.get((result) => {
                const cityName = result.name;
                store.dispatch(getCityNameAction(cityName));
                this.getAllCities();
            }
            )
        } else {
            this.getAllCities();
        }

    }
    getAllCities = async (params) => {

        //当前定位城市
        const { mapReducer } = store.getState();
        const cityName = mapReducer.cityName;

        // 获取所有城市
        let allCities = (await axios.get("/area/city?level=1")).body;
        //获取热门城市
        const hotCities = (await axios.get("/area/hot")).body;

        let totalCity = [
            { "当前定位": [cityName] },
            { "热门城市": hotCities.map(v => v.label) }
        ];
        // 思考一下，还差那些内容 allCities A:[....]
        //[{"当前定位":""},{"热门城市":["广州","北京"..]},{A:[....]}]
        //先做一个排序 ab ac ad ba bb ...
        allCities = allCities.sort(function (a, b) {
            return a.short.localeCompare(b.short);
        })
        //{A:[....],B:[....],C:[...]}
        allCities.forEach(v => {
            //取到简称里面首字母的大写
            let firstLetter = v.short[0].toUpperCase();
            //判断首字母是否在totalCity里面已经出现
            let index = totalCity.findIndex(item => {
                if (item[firstLetter]) {
                    return true;
                } else {
                    return false;
                }
            })
            if (index === -1) {
                //例如没有找到A [{},{"A":[v.label]}]
                totalCity.push(
                    { [firstLetter]: [v.label] }
                );
            } else {
                totalCity[index][firstLetter].push(v.label)
            }
        });
        let keyArr = totalCity.map(v => Object.keys(v)[0]);
        keyArr[0] = "#";
        keyArr[1] = "热";
        this.setState({
            totalCity, keyArr
        })
    }
    rowRenderer = ({ key, index, style }) => {
        //{"热门城市":["广州","上海"]}

        let item = this.state.totalCity[index];
        let item_name = Object.keys(item)[0];
        return (
            <div key={key} style={style}>
                <div className="city_list_name">
                    {item_name}
                </div>
                <div className="city_list_content" >
                    {
                        item[item_name].map((v, i) => {
                            return <div key={i} onClick={this.itemOnClick.bind(this, v)} className="list_item">{v}</div>
                        })
                    }
                </div>
            </div>
        );
    }
    itemOnClick = (v) => {
        store.dispatch(getCityNameAction(v));
        window.history.go(-1);
    }

    rowHeight = ({ index }) => {
        let item = this.state.totalCity[index];
        return (Object.values(item)[0].length + 1) * 40;
    }
    onKeyLetterClick = (index) => {
        this.MainList.current.scrollToRow(index);
        this.setState({
            selectIndex:index
        })
    }
    onRowsRendered = ({startIndex}) => {
        this.setState({
            selectIndex:startIndex
        })
    }
    

    render() {
        return (
            <div className="city_list">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
                {/* 城市列表开始 */}
                <div className="list_content" >
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={this.MainList} //非受控表单
                                height={height}
                                rowCount={this.state.totalCity.length}
                                rowHeight={this.rowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                width={width}
                                scrollToAlignment="start" // 对齐方式， 不加的话 点击右侧的字母，左侧 列表 滚动的位置不对
                            />
                        )}
                    </AutoSizer>

                </div>
                {/* 城市列表结束 */}
                {/* 首字母缩写开始 */}
                <div className="key_list">
                    {
                        this.state.keyArr.map( (v,i) => {
                        return <div 
                        onClick={this.onKeyLetterClick.bind(this,i)}
                        className={"key_item" + " " + ( i ===               this.state.selectIndex ? "active":"")} key={v}>
                        {v}</div>
                        })
                    }
                </div>

                {/* 首字母缩写结束 */}
            </div>
        );
    }
}

export default Index;