import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import "./index.scss"
import store from "../../store"
import { axios } from "../../utils/request"
import { REACT_APP_API_URL } from '../../utils/urls';
let BMap = window.BMap;
export default class Index extends Component {

    Sites = [
        { zoom: 12, level: 1, shape: "circle", name: "城市" },
        { zoom: 14, level: 2, shape: "circle", name: "区域" },
        { zoom: 18, level: 3, shape: "rect", name: "小区" },
    ]
    SiteIndex = 0;
    state = {
        house_list: [],
        is_show: false
    }
    componentDidMount() {
        let cityName = store.getState().mapReducer.cityName;
        cityName = "广州市"
        if (cityName) {
            this.init_city(cityName);
        }
    }
    init_city = async (cityName) => {
        // 百度地图API功能
        this.map = new BMap.Map("allmap");    // 创建Map实例
        this.map.centerAndZoom(cityName, this.Sites[this.SiteIndex].zoom);  // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件 
        this.map.addControl(new BMap.NavigationControl());
        this.map.addControl(new BMap.ScaleControl());
        this.map.setCurrentCity(cityName);          // 设置地图显示的城市 此项是必须设置的
        //获取区域的id信息
        let cityObj = (await axios.get("/area/info?name=" + cityName)).body;
        this.drawCityHouse(cityObj);

    }
    drawCityHouse = async (cityObj) => {
        let res = (await axios.get("/area/map?id=" + cityObj.value)).body;
        this.map.clearOverlays();
        //把数据渲染到地图上面
        //已经点击过一次了
        if (this.Sites[this.SiteIndex].zoom != this.Sites[0].zoom) {
            let point = new BMap.Point(cityObj.coord.longitude, cityObj.coord.latitude);
            this.map.centerAndZoom(point, this.Sites[this.SiteIndex].zoom)

        }
        res.forEach(e => {
            let point = new BMap.Point(e.coord.longitude, e.coord.latitude);
            let opts = {
                position: point,
                offset: new BMap.Size(0, 0)
            }
            let label = "";
            if (this.Sites[this.SiteIndex].shape == "circle")
                label = new BMap.Label("<div class='circle'><span>" + e.label + "<span><br/>" + e.count + "套</div>", opts);
            else
                label = new BMap.Label("<div class='rect'><span>" + e.label + "<span><br/>" + e.count + "套</div>", opts);
            label.setStyle({
                "background-color": "transparent",
                border: "none"
            })
            label.addEventListener("click", () => {
                if (this.SiteIndex === this.Sites.length) {
                    this.getDetail(e);
                    this.setState({
                        is_show: true
                    })
                    // 让底部的div 变化都稳定了 
                    setTimeout(() => {
                        // 再让被点击的标签 居中即可
                        this.map.panTo(point);
                    }, 500);
                } else {
                    //绘制二级房源
                    this.drawCityHouse(e);
                }
            })
            this.map.addOverlay(label);
        });
        this.SiteIndex++;
    }
    getDetail = async (v) => {
        let house_list = (await axios.get("/houses?cityId=" + v.value)).body
        this.setState({
            house_list: house_list.list,
        })
    }

    renderHouseList = (params) => {
        return (
            <div>
                <div className={"house_info_list" + (this.state.is_show ? " show_house_info" : "")}>
                    <div className="house_info_list_title">
                        <span className="title1">房屋列表</span>
                        <span className="title2">更多房源</span>
                    </div>
                    {
                        this.state.house_list.map((v, i) => <div className="house_info_list_content">
                            <div className="house_info_item">
                                <div className="item_img_wrap" key={i}>
                                    <img src={REACT_APP_API_URL + v.houseImg} alt=""></img>
                                </div>
                                <div className="item_content">
                                    <div className="houseinfo1">{v.title}</div>
                                    <div className="houseinfo2">{v.desc}</div>
                                    <div className="houseinfo3">{v.tags.map(vv => <span key={vv}>{vv}</span>)}</div>
                                    <div className="houseinfo4">{v.price}元/月</div>
                                </div>
                            </div>
                        </div>
                        )
                    }

                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="hk_map">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => window.history.go(-1)}
                >地图找房</NavBar>
                <div className="hk_map_info">
                    <div id="allmap" className="hk_map_content"></div>
                    {this.renderHouseList()}
                </div>
            </div>
        )
    }
}
