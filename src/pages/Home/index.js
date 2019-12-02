import React, { Fragment, Component } from 'react'
import { Carousel } from "antd-mobile"
import { axios } from "../../utils/request"
import nav1 from "../../assets/images/nav-1.png"
import nav2 from "../../assets/images/nav-2.png"
import nav3 from "../../assets/images/nav-3.png"
import nav4 from "../../assets/images/nav-4.png"
import SearchInput from "../../components/SearchInput"
import "./index.scss"
import { REACT_APP_API_URL } from '../../utils/urls'
export default class Home extends Component {

    state = {
        swiperList: [],
        imgHeight: 176,
        navs: [
            { id: 0, img: nav1, title: "整租" },
            { id: 1, img: nav2, title: "合租" },
            { id: 2, img: nav3, title: "地图找房" },
            { id: 3, img: nav4, title: "去出租" },
        ],
        homeGroup: [],
        news: []


    }

    componentDidMount() {

        axios.get("/home/swiper").then(res => {
            this.setState({
                swiperList: res.body
            });
        })
        axios.get("/home/groups").then(res => {
            this.setState({
                homeGroup: res.body
            })
        })
        axios.get("/home/news").then(res => {
            this.setState({
                news: res.body
            })
        })

    }

    render() {
        const { swiperList } = this.state;
        return (
            <Fragment>
                <div className="hk_home">
                    <div className="home_search_input">
                        <SearchInput/>
                    </div>
                    {/* 轮播图开始 */}
                    <div className="home_swiper">
                        {
                            swiperList.length && <Carousel
                                autoplay
                                infinite
                            >
                                {swiperList.map(val => (
                                    <a
                                        key={val}
                                        href="http://www.alipay.com"
                                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                                    >
                                        <img
                                            src={`http://hkzf.zbztb.cn` + val.imgSrc}
                                            alt=""
                                            style={{ width: '100%', verticalAlign: 'top' }}
                                            onLoad={() => {
                                                // fire window resize event to change height
                                                window.dispatchEvent(new Event('resize'));
                                                this.setState({ imgHeight: 'auto' });
                                            }}
                                        />
                                    </a>
                                ))}
                            </Carousel>

                        }
                    </div>
                    {/* 轮播图结束 */}
                    {/* 首页导航开始 */}
                    <div className="home_nav">
                        {
                            this.state.navs.map(v =>
                                <div className="nav_item" key={v.id}>
                                    <img src={v.img} alt=""></img>
                                    <p>{v.title}</p>
                                </div>
                            )
                        }
                    </div>

                    {/* 首页导航结束 */}

                    {/* 租房小组开始 */}
                    <div className="home_group">
                        <div className="home_group_title">
                            <span>租房小组</span>
                            <span>更多</span>
                        </div>
                        <div className="home_group_content">
                            {
                                this.state.homeGroup.map(v =>
                                    <div className="home_group_item" key={v.id}>
                                        <div className="home_group_item_name">
                                            <div className="home_group_item_title">{v.title}</div>
                                            <div className="home_group_item_desc">{v.desc}</div>
                                        </div>
                                        <div className="home_group_item_img">
                                            <img src={REACT_APP_API_URL + v.imgSrc} alt=""></img>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                    {/* 租房小组 结束 */}
                    {/* 最新资讯开始 */}
                    <div className="home_news">
                        <div className="home_news_title">
                            <span>最新资讯</span>
                        </div>
                        <div className="home_news_content">
                            {
                                this.state.news.map(v =>
                                    <div key={v.id} className="home_news_item">
                                        <div className="home_news_item_img">
                                            <img src={REACT_APP_API_URL + v.imgSrc} alt=""></img>
                                        </div>
                                        <div className="home_news_item_desc">
                                            <div className="home_news_item_title">
                                                {v.title}
                                            </div>
                                            <div className="home_news_item_bottom">
                                                <div className="home_news_item_from">{v.from}</div>
                                                <div className="home_news_item_date">{v.date}</div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>

                    {/* 最新资讯结束 */}


                </div>
            </Fragment>
        )
    }
}
