<template>
  <div class="error-page">
    <div class="error-code">
      <el-image style="width: 400px; height: 400px;background: rgb(243 243 243); "
                :src="require('../assets/img/GitHubLoad.png')"></el-image>
    </div>
    <div class="error-desc">正在登录Github账户，请不要着急~</div>
  </div>
</template>

<script>
export default {
  name: "Github.vue",
  data(){
    return{
      param: {
        code: "",
        state: ""
      }
    }
  },
  methods: {
    goBack(){
      this.$router.go(-1);
    },
  },
  created(){
    this.param.code = this.$route.query.code
    this.param.state = this.$route.query.state
    console.log(this.param)
    //发送请求
    const _this = this
    this.$axios.get('/callback?code='+this.param.code+'&state='+this.param.state).then(res=>{
      console.log(res.data)
      const jwt = res.headers['authorization']
      const userinfo = res.data.data
      //如果出现错误
      if(res.data.code!==200){
        this.$message.error(res.data.message);
      }else {
        this.$message.success("github用户登录成功");
        // 把数据共享出去
        _this.$store.commit("SET_TOKEN", jwt)
        //这里先不直接赋值，放到后面直接获取shiro认证登录后的信息
        //_this.$store.commit("SET_USERINFO", userinfo)
        //需要刷新一次，因为路由跳转使用缓存，如果直接跳转，前端得到的token没有给到后端shiro做验证即登录操作。
        this.$router.push("/");
        this.$router.go(0);
      }
    })
  }
}
</script>

<style scoped>
.error-page{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
}
.error-code{
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #2d8cf0;
}
.error-code span{
  color: #00a854;
}
.error-desc{
  font-size: 30px;
  color: #777;
}
</style>