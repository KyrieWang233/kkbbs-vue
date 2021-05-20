import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://localhost:8081"
axios.defaults.withCredentials = true
axios.defaults.headers["Authorization"] = localStorage.getItem("token")

//后置拦截
axios.interceptors.response.use(response => {
        const res = response.data;
        // 当结果的code是否为200的情况
        if (res.code === 200) {
            return response
        } else {
            if(res.code === 2013||res.code === 2014){//密码错误和用户不存在的情况直接弹窗就行
                // 弹窗异常信息
                Element.Message({
                    message: res.message,
                    type: 'error',
                    duration: 2 * 1000
                })
            }
            else{
                store.commit('SET_ERROR',res.message)//把错误信息填入全局变量
                router.push({
                    path: '/error'
                });
            }
            // 直接拒绝往下面返回结果信息
            return Promise.reject(response.data.message)
        }
    },
    error => {//捕获后端的异常
        console.log('err' + error)// for debug
        if(error.response.data){
            error.message=error.response.data.msg
        }
        Element.Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    })