<template>
  <div class="header">
    <div class="logo">
      <router-link to="/supplierAllBack">
        <a href="#" >KK社区</a>
      </router-link>
    </div>
<!--    <el-form style="margin: 10px 5px" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.search" placeholder="搜索内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch(formInline.search)" >搜索</el-button>
      </el-form-item>
    </el-form>-->
    <el-input
        style="margin: 10px 10px; width:150px"
        placeholder="请输入搜索内容"
        v-model="search"
        clearable
        @change="onSearch(search)">
    </el-input>
<!--    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">处理中心</el-menu-item>
    </el-menu>-->

    <!--用户头像等-->
    <div  class="user">
      <div v-if="hasLogin">
        <span class="publish-btn">
          <router-link to="/publish/add">
          <el-link style="font-size: 15px" icon="el-icon-edit" :underline="false">发布新帖</el-link>
        </router-link>
        </span>

        <el-dropdown @command="handleCommand" class="userInfoAvatar">
          <el-badge :is-dot="userInfo.message_notification">
            <span class="el-dropdown-link">
              <el-avatar :src="userInfo.avatar_url"></el-avatar>
            </span>
          </el-badge>
          <el-dropdown-menu slot="dropdown"  >
            <el-dropdown-item command="profile"><i class="el-icon-user">个人主页</i></el-dropdown-item>
            <el-dropdown-item command="logout" divided><i class="el-icon-warning-outline">退出</i></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="header-name">{{userInfo.name}}</span>
      </div>

      <div  v-else>
        <router-link to="/login">
          <el-link style="padding: 10px" :underline="false">登录</el-link>
        </router-link>
        <el-link style="margin-left: 10px"
            href="https://github.com/login/oauth/authorize?client_id=6161e3b8ad33e85e5cce&redirect_uri=http://localhost:8080/callback&scope=user&state=1"
                 :underline="false"
                 >
          <el-avatar style="background: rgb(255 255 255);"
                     :src="require('../assets/img/LogoGitHub.png')"
                     fit="contain"
                     ></el-avatar>
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header.vue",
  inject:['reload'],
  data() {
    return {
      activeIndex: '1',
      search: '',
      userInfo: {
        name:"请先登录",
        avatar_url:"null",
        message_notification:false,
      },
      hasLogin: false,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    onSearch(search) {
      this.$router.push({path:'/',query:{search}})
      this.$router.go(0);
    },
    logout() {
      const _this = this
      _this.$axios.get("/logout").then(res => {
        _this.$store.commit("REMOVE_INFO")
        _this.$message.success("退出成功");
        _this.$router.go(0)

      })
    },
    handleCommand(command) {
      if(command==="logout"){
        this.logout()
      }
      else if(command==="profile"){
        this.$router.push("/profile/myquestion")
      }
    },
  },
  created() {
    //如果有登录信息就不用去后端查询了
    if(this.$store.getters.getUser&&this.$store.getters.getUser.name) {
      this.userInfo = this.$store.getters.getUser
      if(this.$store.getters.getUser.unreadCount>0){
        this.userInfo.message_notification=true;
      }
      this.hasLogin = true
    }
    else{
      this.$axios.get('/login').then(res=>{
        const userinfo = res.data.data
        this.$store.commit("SET_USERINFO", userinfo)
        if(userinfo!=null){//如果查到的信息不为空，才进行赋值否则不做处理
          this.userInfo = this.$store.getters.getUser
          //如果有未读取的消息
          if(this.$store.getters.getUser.unreadCount>0){
            this.userInfo.message_notification=true;
          }
          this.hasLogin = true
        }
      })
    }
  }
}
</script>

<style scoped>
.header{
  height: 100%;
  display: flex;
  color: #909399;
  border-bottom: solid 1px #e6e6e6;
  position: relative;
}
.el-menu.el-menu--horizontal{
  border-bottom: 0px #e6e6e6;
}
.user{
  position: absolute;
  right: 10px;
  margin: 10px 0px;
}
.publish-btn{
  float: left;
  margin: 8px 20px 0px 0px;
}
.header-name{
  float: right;
  margin: 9px;
}
</style>