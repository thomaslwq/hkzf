import Axios from "axios"

//1. 配置一个通用的axios的实例
export  let axios = Axios.create({
  baseURL:""
})

axios.interceptors.request.use(function(config){

  return config;

},function(error){
  return Promise.reject(error)
})
axios.interceptors.response.use(function(res){

  return response.data;
},function(error){
  return Promise.reject(error);
})


