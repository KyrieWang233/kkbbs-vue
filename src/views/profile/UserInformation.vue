<template>
  <div>
    <el-container>
      <el-header><Header></Header></el-header>
      <el-main>
        <el-row>
          <el-col :xs="24" :sm="5" :md="5" :lg="5" :xl="5">
            <Profilebar></Profilebar>
          </el-col>
          <el-col :xs="24" :sm="19" :md="19" :lg="19" :xl="19">
            <div >
              <el-card class="box-card" shadow="hover" style="min-height: 600px">
                <div slot="header" class="card-head">
                  <span>基本设置(github用户同步头像)</span>
                </div>

                <el-form ref="form" :model="form" label-width="80px" label-position="left" >
                  <el-form-item label="头像">
                    <div class="crop-demo">
                      <el-avatar shape="square" :size="100" :src="cropImg"></el-avatar>
<!--                      <img :src="cropImg" class="pre-img" />-->
                      <div v-show="form.register_way!='github'" class="crop-demo-btn">
                        选择图片
                        <input
                            class="crop-input"
                            type="file"
                            name="image"
                            accept="image/*"
                            @change="setImage"
                        />
                      </div>
                    </div>

                    <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="600px">
                      <vue-cropper
                          ref="cropper"
                          :src="imgSrc"
                          :ready="cropImage"
                          :zoom="cropImage"
                          :cropmove="cropImage"
                          style="width:100%;height:300px;"
                      ></vue-cropper>
                      <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="cancelCrop">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                      </template>
                    </el-dialog>
                  </el-form-item>
                  <el-form-item label="用户名">
                    <el-input v-model="form.name" style="max-width: 400px" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span class="time-information"> 时间</span>
                  </el-form-item>
                  <el-form-item label="注册途径">
                    <el-avatar style="background: rgb(255 255 255);"
                               :src="require('../../assets/img/LogoGitHub.png')"
                               fit="contain"
                    ></el-avatar>
                  </el-form-item>
                  <el-form-item>
                    <el-button v-show="form.register_way!='github'" type="primary" @click="onSubmit">确定</el-button>
                  </el-form-item>
                </el-form>
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
import Profilebar from "@/components/Profilebar";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  name: "UserInformation",
  components: {Profilebar, Header,VueCropper},
  data() {
    return {
      defaultSrc: require("/Users/wangyu/Documents/JavaCode/SpringbootWorkspace/kkbbs-vue/src/assets/img/wechat.jpg"),
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      avatar_file:'',
      form: {
        name: '',
        gmt_create:'',
        register_way:''
      }
    }
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        this.dialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper &&
        this.$refs.cropper.replace(event.target.result);
      }
      reader.readAsDataURL(file);
      console.log(this.dialogVisible)
    },
    cropImage() {
      //存储的是base64格式
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.avatar_file = this.base64toFile(this.cropImg)
    },
    cancelCrop() {
      this.dialogVisible = false;
      //this.cropImg = this.defaultSrc;
    },
    //base64转为普通文件格式
    base64toFile (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    onSubmit() {
      console.log('submit!');

      let userInfo = this.$store.getters.getUser
      //后续修改可以添加其他信息
      let formdata = new FormData();
      formdata.append('image', this.avatar_file);
      formdata.append('id',userInfo.id);
      this.$axios.post('/userInformation',formdata).then(res => {
        if (res.data.code === 200) {
          const userdata = res.data.data
          userInfo.avatar_url = userdata.avatar_url
          userInfo.gmt_modified = userdata.gmt_modified
          console.log(userInfo)
          this.$store.commit("SET_USERINFO", userInfo)
          this.cropImg = userInfo.avatar_url
          this.$alert('操作成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.reload()
            }
          });
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created() {
    const userInfo = this.$store.getters.getUser
    this.form.name = userInfo.name
    this.form.gmt_create = this.$moment(userInfo.gmt_create).format('YYYY-MM-DD')
    this.form.register_way = userInfo.register_way
    this.cropImg = userInfo.avatar_url
  }
}
</script>

<style scoped>
.card-head{
  color: #909399;
  font-size: 15px;
  font-weight: 500;
  padding-top: 6px;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
  object-fit: cover;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.time-information{
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>