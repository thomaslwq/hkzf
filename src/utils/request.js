import Axios from "axios"
import { Toast } from "antd-mobile"
import { REACT_APP_API_URL } from "./urls"
//1. 配置一个通用的url
export let axios  = Axios.create({
    baseURL:REACT_APP_API_URL
})

//2. 请求拦截
axios.interceptors.request.use(function(config){
    Toast.loading("正在加载中...",1*60*60,null,true);
    return config;
},function(error){
    return Promise.reject(error)
})
//3. 返回数据的拦截
axios.interceptors.response.use(function( res ){
    Toast.hide();
    return res.data;
},
function(error){
    return Promise.reject(error);
})