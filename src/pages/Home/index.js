import React, { Fragment, Component } from 'react'
import { Carousel } from "antd-mobile"
import { axios } from "../../utils/request"
import "./index.scss"
export default class Home extends Component {

    state = {
        swiperList: [],
        imgHeight: 176
    }

    componentDidMount() {
        axios.get("/home/swiper").then(res => {
            this.setState({
                swiperList: res.body
            });
        })
    }

    render() {
        const { swiperList } = this.state;
        return (
            <Fragment>
                <div className="hk_home">
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
                </div>
            </Fragment>
        )
    }
}
