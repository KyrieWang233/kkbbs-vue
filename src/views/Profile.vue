<template>
<div>
  <el-container>
    <el-header><Header></Header></el-header>
    <el-main>
      <el-row>
        <el-col :xs="24" :sm="4" :md="5" :lg="5" :xl="5">


        </el-col>
        <el-col :xs="24" :sm="20" :md="19" :lg="19" :xl="19">
          <div >
            <el-card class="box-card" shadow="hover" style="min-height: 600px">
              <div slot="header" class="clearfix">
                <span>作者微信</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
              <div style="display: flex; justify-content: center;">
                <el-image style="width: 300px; height: 300px; "
                          :src="require('../assets/img/wechat.jpg')"></el-image>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "Profile.vue",
  components: {Header},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>

</style>