<template>
  <div style="margin-right: 10px">
    <el-menu
        style="height: 600px;"
        :default-active="this.$route.path"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF"
        router
    >
      <el-menu-item :index="'/profile/myquestion'">
        <i class="el-icon-menu"></i>
        <span slot="title">我的提问</span>
      </el-menu-item>
      <el-menu-item :index="'/profile/message'">
        <el-badge :hidden="unreadCount===0" :value="unreadCount" :max="99" class="item">
          <i class="el-icon-document"></i>
        </el-badge>
        <span slot="title">我的消息</span>
      </el-menu-item>
      <el-menu-item :index="'/profile/information'">
        <i class="el-icon-menu"></i>
        <span slot="title">基本设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Profilebar.vue",
  data(){
    return {
      unreadCount:'',
    }
  },
  methods: {
  },
  created() {
    this.$axios.get('/unreadCount').then((res) => {
      const userInfo = res.data.data
      this.unreadCount = userInfo.unreadCount
      //更新userinfo，主要更新未读消息
      this.$store.commit("SET_USERINFO", userInfo)
    })
  }
}
</script>

<style scoped>
</style>