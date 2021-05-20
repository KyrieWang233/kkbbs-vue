import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem("token"),
        userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
        error:""
    },
    mutations: {
        // set
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem("token", token)
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
        },
        REMOVE_INFO: (state) => {
            state.token = ''
            state.userInfo = {}
            localStorage.setItem("token", '')
            sessionStorage.setItem("userInfo", JSON.stringify(''))
        },
        SET_ERROR: (state,error) => {
            state.error = error
        }

    },
    getters: {
        // get
        getUser: state => {
            return state.userInfo
        },
        get_token: (state) => {
            return state.token
        },
        get_error: state => {
            return state.error
        }

    },
    actions: {
    },
    modules: {
    }
})