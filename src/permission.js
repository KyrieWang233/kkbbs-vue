import router from "./router";
import Element from "element-ui";
// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
        const userInfo = sessionStorage.getItem("userInfo")
        console.log("------------" + userInfo)
        if (userInfo!="null"&&userInfo!="") { // 判断当前的token是否存在且不为空 ； 登录存入的token
            if (to.path === '/login') {
            } else {
                next()
            }
        } else {
            // 弹窗异常信息
            Element.Message({
                message: "请先登录账户！",
                type: 'error',
                duration: 2 * 1000
            })
            next({
                path: '/login'
            })
        }
    } else {
        next()
    }
})