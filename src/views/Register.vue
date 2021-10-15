<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">注册账户</div>
      <el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="密码"
              v-model="param.password"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="secondPassword">
          <el-input
              type="password"
              placeholder="确认密码"
              v-model="param.secondPassword"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verCode">
          <el-input
            v-model="param.verCode"
            placeholder="验证码"
            maxlength="5"
            @keyup.enter="submitForm()"
            style="float: left; width: 155px;"
            >
            <template #prepend>
              <el-button icon="el-icon-key"></el-button>
            </template>
          </el-input>
          <img style="margin-left: 5px" :src="verImg" ref="code" @click="changeCode">
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">注册</el-button>
        </div>
        <p class="login-tips">Tips : 验证码不区分大小写。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register.vue",
  data() {
    return {
      verImg:"",
      param: {
        username: "",
        password: "",
        secondPassword:"",
        verKey:"",
        verCode:""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名（不小于3个字符）", trigger: "blur",min:3,max:25 }
        ],
        password: [
          { required: true, message: "请输入密码（不小于6个字符）", trigger: "blur",min:6,max:35 }
        ],
        secondPassword: [
          { required: true, message: "请确认密码", trigger: "blur",min:6,max:35 }
        ],
        verCode: [
          { required: true, message: "请输入验证码", trigger: "blur",min:5,max:5 }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.register.validate(valid => {
        if (valid) {
          const _this = this
          this.$axios.post('/register',this.param).then(res=>{
            //如果出现错误
            if(res.data.code!==200){
              this.$message.error(res.data.message);
            }else {
              this.$message.success("注册成功");
              this.$router.push("/login");
              //this.$router.push("/");
              //this.$router.go(0);
            }
          })
        } else {
          this.$message.error("请正确输入账号、密码和验证码");
          return false;
        }
      });
    },
    changeCode(){
      const _this = this
      this.$axios.get('/captcha').then(res=>{
        _this.param.verKey = res.data.data.key
        _this.verImg = res.data.data.image
      })
    }
  },
  created() {
    this.changeCode()
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>