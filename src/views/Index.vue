<template>
  <div>
    <el-container>
      <el-header :class="isVisible?'slideDown':'slideUp'"><Header></Header></el-header>

      <el-main>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <!--左边的分布-->
            <div>
              <el-card shadow="never" >
                <h3 style="font-family:Hiragino Sans GB"><i class="el-icon-reading"></i> 芜湖~</h3>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="最新" name="first"></el-tab-pane>
                  <el-tab-pane label="周榜" name="second"></el-tab-pane>
                  <el-tab-pane label="月榜" name="third"></el-tab-pane>
                  <el-tab-pane label="消灭零回复" name="fourth"></el-tab-pane>
                </el-tabs>
              </el-card>
              <div class="line"></div>
              <!--问题列表-->
              <div v-for="question in questions" >

                <el-card shadow="hover" style="display: flex" >
                  <!--同层次div水平分布，然后在居中对齐align-items: center-->
                  <div style="display: flex; ">
                    <div class="block">
                      <el-link >
                        <el-avatar shape="square" :size="55" :src="question.user.avatar_url"></el-avatar>
                      </el-link>
                    </div>
                    <div style="margin-left: 10px">
                      <h4>
                        <router-link :to="{name: 'Question', params: {questionId: question.id}}">
                          <el-link style="font-size: 16px">{{question.title}}</el-link>
                        </router-link>
                      </h4>
<!--                      <p>{{question.description}}</p>-->
                      <div style="padding: 7px 0px;color: #909399;">
                        <!--传入这个评论创建者的id-->
                        <i class="iconfont el-icon-view"></i><span style="font-size: 15px"> {{question.view_count}} </span>
                        <i class="iconfont el-icon-chat-dot-square"></i><span style="font-size: 15px"> {{question.comment_count}} </span>
                        <i class="iconfont el-icon-time"></i><span style="font-size: 15px"> {{question.gmt_create}}</span>
                      </div>
                    </div>

                  </div>


                  <!--                <el-row :gutter="10">
                                    <el-col :span="2">

                                      <el-image :src="question.user.avatar_url"></el-image>
                                    </el-link>
                                    </el-col>
                                    <el-col :span="18">

                                    </el-col>
                                  </el-row>-->
                </el-card>
              </div>
            </div>
            <!--页码-->
            <el-pagination class="mpage"
                           background
                           layout="prev, pager, next"
                           :total="total"
                           :current-page="currentPage"
                           :page-size="pageSize"
                           @current-change="page"
                           >
            </el-pagination>
          </el-col>
          <!--右边分布-->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>作者微信</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
              <div style="display: flex; justify-content: center;">
                <el-image style="width: 300px; height: 300px; "
                          :src="require('../assets/img/wechat.jpg')"></el-image>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "Index.vue",
  components: {Header},
  data(){
    return{
      message:false,
      isVisible: true, //控制web端导航的隐藏和显示
      questions: {},
      total:0,
      currentPage: 1,
      pageSize: 5,
      activeName: 'second'//控制开头选项
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    page(currentPage) {
      //包含请求头，这样登录首页直接根据token登录
      const _this = this
      this.$axios.get('http://localhost:8081/?page=' + currentPage).then((res) => {
        _this.questions = res.data.data.questionDtos
        for (const question of _this.questions) {
          question.gmt_create = _this.$moment(question.gmt_create).format('YYYY-MM-DD')
        }
        _this.currentPage = res.data.data.currentPage
        _this.total = res.data.data.totalPages*_this.pageSize
      })
    }
  },
  created() {
    this.page(1)
  },
  mounted() {
    var that = this;
    var offset = 300;
    var after = 0;
    window.addEventListener("scroll", function () {
      let scrollTop = document.documentElement.scrollTop; //当前的的位置
      let scrollHeight = document.documentElement.scrollHeight; //最高的位置
      if (scrollTop > offset) {
        that.isCdTopVisible = true;
      } else {
        that.isCdTopVisible = false;
      }
      if (scrollTop > after) {
        that.isVisible = false;
      } else {
        that.isVisible = true;
      }
      after = scrollTop;
    });
  },
}
</script>

<style scoped>

.el-image{
  border-radius: 2px;
}
.el-card {
  border: 1px #EBEEF5;
  background-color: #FFF;
  color: #303133;
  border-radius: 1px;
  padding: 10px 20px;
}
/deep/ .el-card__body {
  padding: 0px;
}

</style>