<template>
  <div>
    <el-container>
      <!--导航栏-->
      <el-header><Header></Header></el-header>
      <el-main>
        <el-row :gutter="10">
          <!--左边分布-->
          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-card shadow="never" >
              <h3 class="question-title"><span>{{question.title}}</span></h3>
              <span class="text-desc">
                作者：<span>{{question.username}}</span> |
                发布时间：<span>{{question.creat_time}}</span> |
                阅读数： <span>{{question.view_count}}</span>
              </span>
              <router-link style="margin-left: 10px" :to="{name: 'Publish', params: {questionId: question.id}}" v-if="ownQuestion">
                <el-link icon="el-icon-edit">
                  编辑
                </el-link>
              </router-link>

              <el-divider></el-divider>
              <div style="min-height: 400px" class="markdown-body" v-html="question.content"></div>
              <el-divider></el-divider>

              <!--标签内容-->
              <div class="tag-group">
                <el-tag
                    v-for="Tag in question.tag"
                    :key="Tag"
                    effect="plain">
                  {{ Tag }}
                </el-tag>
              </div>
            </el-card>

            <!--评论模块-->
            <div style="margin-top: 10px">
              <el-card shadow="never">
                <h3><span>{{question.comment_count}}</span> 个回复</h3>
                <el-divider style="height: 0.5px"></el-divider>
                <!--评论内容-->
                <div>
                  <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
                    <el-avatar class="header-img" :size="40" :src="myHeader" style="background-color: #ffffff;"></el-avatar>
                    <div class="reply-info" >
                      <div
                          tabindex="0"
                          contenteditable="true"
                          id="replyInput"
                          spellcheck="false"
                          placeholder="输入评论..."
                          class="reply-input"
                          @focus="showReplyBtn"
                          @input="onDivInput($event)"
                      >
                      </div>
                    </div>
                    <div class="reply-btn-box" v-show="btnShow">
                      <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
                    </div>
                  </div>
                  <!--主评论列表-->
                  <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
                    <el-avatar class="header-img" :size="40" :src="item.user.avatar_url"></el-avatar>
                    <div class="author-info">
                      <span class="author-name">{{item.user.name}}</span>
                      <span class="author-time">{{item.gmt_create}}</span>
                    </div>
                    <div class="icon-btn">
                      <!--传入这个评论创建者的id-->
                      <span @click="showReplyInput(i,item.user.name,item.user.id)"><i class="iconfont el-icon-chat-dot-round"></i>{{item.comment_count}}</span>
                      <i class="iconfont el-icon-thumb"></i>{{item.like_count}}
                    </div>
                    <!--主评论内容-->
                    <div class="talk-box">
                      <p>
                        <span class="reply">{{item.content}}</span>
                      </p>
                    </div>
                    <!--二级评论列表-->
                    <div class="reply-box">
                      <div v-for="(reply,j) in item.replys" :key="j" class="author-title">
                        <el-avatar class="header-img" :size="40" :src="reply.user.avatar_url"></el-avatar>
                        <div class="author-info">
                          <span class="author-name">{{reply.user.name}}</span>
                          <span class="author-time">{{reply.gmt_create}}</span>
                        </div>
                        <div class="icon-btn">
                          <!--传入这个评论创建者的id和姓名-->
                          <span @click="showReplyInput(i,reply.user.name,reply.user.id)"><i class="iconfont el-icon-chat-dot-round"></i>回复</span>
                          <i class="iconfont el-icon-thumb"></i>{{reply.like_count}}
                        </div>
                        <div class="talk-box">
                          <p style="font-size: 14px">
                            <span>回复 {{reply.receiver_name}}:</span>
                            <span class="reply">{{reply.content}}</span>
                          </p>
                        </div>
                        <div class="reply-box">

                        </div>
                      </div>
                    </div>
                    <!--二级评论的输入框-->
                    <transition name="el-zoom-in-top">
                      <div  v-show="_inputShow(i)" class="my-reply my-comment-reply">
                        <el-avatar class="header-img" :size="40" :src="myHeader" style="background-color: #ffffff;"></el-avatar>
                        <div class="reply-info" >
                          <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>
                        </div>
                        <div class=" reply-btn-box">
                          <el-button class="reply-btn" size="medium" @click="sendCommentReply(i)" type="primary">发表评论</el-button>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </el-card>
            </div>

          </el-col>

          <!--右边分布-->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-card class="box-card" shadow="hover">
              <div class="card-header">
                <span>相关问题</span>
              </div>
              <div v-for=" related in relatedQuestions">
                <router-link :to="{name: 'Question', params: {questionId: related.id}}">
                  <el-link :underline="false" >
                    <span class="related-text">{{related.title}}</span>
                  </el-link>
                </router-link>

                <i style="padding: 5px 0px;color: #909399;margin-left: 10px" class="el-icon-chat-dot-square">
                  <span style="font-size: 13px"> {{related.comment_count}} </span>
                </i>
              </div>
              <div v-show="relatedQuestions.length===0" >
                  <div style="display: flex; justify-content: center;">
                    <span class="page-text">
                    暂无问题
                  </span>
                  </div>
              </div>

            </el-card>
            <el-card class="box-card" shadow="never">
              <div class="card-header">
                <span>作者微信</span>
              </div>
              <div  style="display: flex; justify-content: center;">
                <el-image class="avatar"
                          :src="require('../assets/img/wechat.jpg')"></el-image>
              </div>
              <p class="desc">我的快递，想寄就寄！</p>
              <div class="social">
                <div style=" padding: 8px;float: left;margin-top: 0px" class="desc">社交:</div>
                <li style="padding: 8px; list-style:none;text-align: center;">
                  <a target="_blank"><img class="link-img" src="../assets/img/QQ.png"  alt=""></a>
                  <a style="margin-left: 5%;" href="https://github.com/KyrieWang233" target="_blank"><img class="link-img" src="../assets/img/github.png" alt=""></a>
                  <a style="margin-left: 5%; margin-right: 10%" target="_blank"><img class="link-img" src="../assets/img/gitee.png"  alt=""></a>
                </li>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import 'github-markdown-css/github-markdown.css'; // 然后添加样式markdown-body
import Header from "@/components/Header";
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
export default {
  name: "Question.vue",
  components: {Header},
  inject:['reload'],
  data(){
    return{
      question: {
        id: "",
        title: "",
        content: "",
        tag:"",
        username:"",
        creat_time:"",
        view_count:"",
        comment_count:"",
      },
      comments:{
      },
      relatedQuestions:{},
      ownQuestion: false,
      btnShow: false,
      index:'0',//当前输入框对应的一级评论
      replyComment:'',//h回复的内容
      myName:'匿名用户',
      myHeader:require('../assets/img/default_avatar.png'),
      myId:19870621,
      receiver_name:'',//用于表示当前输入框中的评论要发送的对象名称
      receiver_id:-1,//评论要发送的对象id
    }
  },

  created() {
    const questionId = this.$route.params.questionId
    const _this = this
    this.$axios.get('/question/' + questionId).then(res => {
      const question = res.data.data.question
      _this.comments = res.data.data.comments
      //做时间格式化处理
      for (const comment of _this.comments) {
        comment.gmt_create = _this.$moment(comment.gmt_create).format('YYYY-MM-DD')
        for (const reply of comment.replys) {
          reply.gmt_create = _this.$moment(reply.gmt_create).format('YYYY-MM-DD')
        }
      }
      _this.relatedQuestions = res.data.data.relatedQuestions
      _this.question.id = question.id
      _this.question.title = question.title
      _this.question.tag = question.tag.split(",")
      _this.question.username = question.user.name
      _this.question.creat_time = _this.$moment(question.gmt_create).format('YYYY-MM-DD')
      _this.question.view_count = question.view_count
      _this.question.comment_count = question.comment_count

      var MardownIt = require("markdown-it")
      var md = new MardownIt()

      var result = md.render(question.description)
      _this.question.content = result
      if(_this.$store.getters.getUser!=null){
        _this.ownQuestion = (question.creator === _this.$store.getters.getUser.id)
      }
    })
    if(this.$store.getters.getUser&&this.$store.getters.getUser.name) {
      const userInfo = this.$store.getters.getUser
      this.myHeader = userInfo.avatar_url
      this.myName = userInfo.name
      this.id = userInfo.id
      this.hasLogin = true
    }
  },
  watch: {
    '$route.params.questionId':function(val, old) {
      if (val !== old) {
        this.reload()
      }
    },
  },
  directives: {clickoutside},
  methods: {
    inputFocus(){
      var replyInput = document.getElementById('replyInput');
      replyInput.style.padding= "8px 8px"
      replyInput.style.border ="2px solid blue"
      replyInput.focus()
    },
    showReplyBtn(){
      this.btnShow = true
    },
    hideReplyBtn(){
      this.btnShow = false
      replyInput.style.padding= "10px"
      replyInput.style.border ="none"
    },
    //输入将要发送评论对象的id和name，更新当前输入框评论对象的信息
    showReplyInput(i,name,id){
      this.comments[this.index].inputShow = false
      this.index =i
      this.comments[i].inputShow = true
      this.receiver_name = name
      this.receiver_id = id
    },
    _inputShow(i){
      return this.comments[i].inputShow
    },
    //发表主评论主评论就不用带回复的id了，直接查问题作业就行
    sendComment(){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }//判断用户有没有登录
      else if(!this.$store.getters.getUser||!this.$store.getters.getUser.name){
        this.$message({
          showClose: true,
          type:'error',
          message:'请先登录账户'
        })
      }
      else{
        let a ={}
        let input =  document.getElementById('replyInput')
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        let user = {}
        let commentDto = {}//和后端传输需要的数据保持一致
        commentDto.parent_id = this.question.id
        commentDto.content = this.replyComment
        commentDto.type = 1//表示回复的是问题
        a.user = user
        a.user.name= this.myName
        a.content =this.replyComment
        a.user.avatar_url = this.myHeader
        a.gmt_create = time
        a.comment_count = 0
        a.like_count = 0
        this.comments.unshift(a)
        //this.comments.push(a)
        this.replyComment = ''
        input.innerHTML = '';
        //发送一个post请求
        this.$axios.post('/comment', commentDto, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          this.$alert('操作成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });

        })
      }
    },
    //发表二级评论带上接受者的id，这样方便通知
    sendCommentReply(i){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }
      else if(!this.$store.getters.getUser||!this.$store.getters.getUser.name){
        this.$message({
          showClose: true,
          type:'error',
          message:'请先登录账户'
        })
      }
      else{
        let a ={}
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        let user = {}
        let commentDto = {}//和后端传输需要的数据保持一致
        commentDto.parent_id = this.comments[i].id
        commentDto.content = this.replyComment
        commentDto.type = 2//表示回复的是评论
        commentDto.receiver_id = this.receiver_id
        a.user = user
        a.user.name= this.myName
        a.receiver_name = this.receiver_name
        a.user.avatar_url = this.myHeader
        a.content =this.replyComment
        a.gmt_create = time
        a.comment_count = 0
        a.like_count = 0
        this.comments[i].replys.push(a)
        this.replyComment = ''
        document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
        //发送一个post请求
        this.$axios.post('/comment', commentDto, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          this.$alert('操作成功', '提示', {
            confirmButtonText: '确定'
          });

        })
      }
    },
    onDivInput: function(e) {
      this.replyComment = e.target.innerHTML;
    },
    dateStr(date){
      //获取js 时间戳
      var time=new Date().getTime();
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time=parseInt((time-date)/1000);
      //存储转换值
      var s;
      if(time<60*10){//十分钟内
        return '刚刚';
      }else if((time<60*60)&&(time>=60*10)){
        //超过十分钟少于1小时
        s = Math.floor(time/60);
        return  s+"分钟前";
      }else if((time<60*60*24)&&(time>=60*60)){
        //超过1小时少于24小时
        s = Math.floor(time/60/60);
        return  s+"小时前";
      }else if((time<60*60*24*30)&&(time>=60*60*24)){
        //超过1天少于30天内
        s = Math.floor(time/60/60/24);
        return s+"天前";
      }else{
        //超过30天ddd
        var date= new Date(parseInt(date));
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
      }
    }
  },
}
</script>

<style scoped>
@import "../assets/css/comment.css";
.el-divider--horizontal{
  height: 0.5px;
}
.related-text{
  display: inline-block;
  max-width: 22em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /*超出部分用...代替*/
}
.page-text{
  line-height: 30px;
  width: 50%;
  color: #909399;
  text-align: center;
  justify-content: center;
}
.box-card{
  margin-bottom: 10px;
}
.avatar{
  position: relative;
  margin: 30px auto 15px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  z-index: 9
}
.card-header{
  padding: 10px 0px;

}
.desc{
  font-size: 15px;
  color: #878d99;
  line-height: 30px;
  font-weight: 100;
  text-align: center;
}
.social{
  padding: 0 20px;
  margin-top: 15px;
}
.link-img{
  display: inline-block;
  width: 44px;
  height: 44px;
  margin: auto;
}
</style>