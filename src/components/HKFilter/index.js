import React, { Component, Fragment } from 'react'
import "./index.scss"
import store from "../../store"
import { axios } from "../../utils/request"
import { PickerView } from "antd-mobile"
export default class index extends Component {


    state = {
        filter_list: [],
        selectIndex: -1,
        filterValue: [[], [], [], []],
        //存储筛选值
        otherValue:[]
    }
    filter_title = [
        {
            name: "区域",
            level: 2
        },
        {
            name: "方式",
            level: 1
        },
        {
            name: "租金",
            level: 1
        },
        {
            name: "筛选",
            level: 3
        },

    ]
    componentDidMount() {
        this.getData();
    }
    //获取房源的筛选条件
    getData = async (params) => {
        const cityName = store.getState().mapReducer.cityName;
        //获取城市的id
        const cityId = (await axios.get("/area/info?name=" + cityName)).body.value;
        const houseConditions = (await axios.get("/houses/condition?id=" + cityId)).body;
        let { area, characteristic, floor, oriented, price, rentType, roomType, subway } = houseConditions;
        let filter_list = [
            [area, subway],
            rentType,
            price,
            [
                { name: "户型", list: roomType }, { name: "朝向", list: oriented },
                { name: "楼层", list: floor }, { name: "房屋亮点", list: characteristic },


            ]
        ];
        this.setState({
            filter_list
        })

    }

    onItemClick = (i) => {
        this.setState({
            selectIndex: i
        });
    }
    //存储Pickview值的地方
    onFilterChange = (value) => {
        let { selectIndex, filterValue } = this.state;
        filterValue[selectIndex] = value;
        this.setState({
            filterValue: filterValue
        })

    }
    //按下取消键的时候
    onItemCancel = (params) => {
        this.setState({
            selectIndex: -1
        })
    }
    //按下确认键的时候
    onItemComfirm = (params) => {

        this.setState({
            selectIndex: -1
        });
        // 做调用父组件传过来的方法
        this.props.handleFilterChange(this.state.filterValue)
    }

    onLabelItemClick = (value)=>{
        let { otherValue,selectIndex,filterValue} = this.state;
        let index = otherValue.findIndex((v) =>  v === value); //如果是空数组  find
        if( index === -1 || otherValue.length === 0 ){
            otherValue.push(value);
        }else{
            otherValue.splice(index,1);
        }
        filterValue[selectIndex] = otherValue;
        this.setState({
            filterValue,otherValue
        })

    }
    onItemCLear = (params) => {
        let { selectIndex,filterValue} = this.state;
        let  otherValue = [];
        filterValue[selectIndex] = otherValue;
        
        this.setState({
            otherValue:[],
            filterValue:filterValue,
            selectIndex:-1
        })
    }
    
    renderFilterContent() {
        let { selectIndex } = this.state;
        if (selectIndex === -1) {
            //没有被选中
            return <Fragment></Fragment>
        } else if (selectIndex <= 2) {
            return <div className="normal_filter">
                <PickerView
                    onChange={this.onFilterChange}
                    value={this.state.filterValue[selectIndex]}
                    data={this.state.filter_list[selectIndex]}
                />
                <div className="normal_filter_btn">
                    <div className="normal_filter_btn_cancel" onClick={this.onItemCancel}>
                        <span>取消</span>
                    </div>
                    <div className="normal_filter_btn_confirm" onClick={this.onItemComfirm}>
                        <span>确定</span>
                    </div>
                </div>
            </div>
        } else {
            return <div className="filter_other">
                <div className="filter_other_mask" onClick={ ()=>{ this.setState({selectIndex:-1})}}></div>
                <div className="filter_other_main">
                    <div className="filter_other_list">
                        {
                            this.state.filter_list[selectIndex].map(v => <div className="filter_other_list_item">
                                <div className="filter_other_list_item_name">{v.name}</div>
                                <div className="filter_content_item">
                                    {
                                        v.list.map((vv) =>
                                            <div className={"filter_content_item_label "+(this.state.otherValue.includes(vv.value)?"active":"") }
                                                onClick={this.onLabelItemClick.bind(this,vv.value)}
                                            >{vv.label}</div>
                                        )
                                    } </div>
                            </div>)
                        }
                    </div>
                    <div className="filterOtherMainBtn">
                        <div className="filterOtherClear" onClick={this.onItemCLear}><span>清除</span></div>
                        <div className="filterOtherComfirm" onClick={this.onItemComfirm}><span>确认</span></div>
                    </div>
                </div>
            </div>
        }
    }
    render() {
        return (
            <Fragment>
                <div className="hk_filter_list">
                    <div className="hk_filter_list_title">
                        {
                            this.filter_title.map((v, i) =>
                                <div className={"filter_list_item " + (this.state.selectIndex === i ? "active" : "")}
                                    onClick={this.onItemClick.bind(this, i)}>
                                    <span>{v.name} <i className="iconfont icon-arrow"></i></span>

                                </div>
                            )
                        }
                    </div>
                    <div className="hk_filter_list_content">
                        {
                            this.renderFilterContent()
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}
