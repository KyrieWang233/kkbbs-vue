<template>
  <div>
    <el-container>
      <el-header><Header></Header></el-header>
      <el-main>
            <el-card shadow="never" >
              <h3 style="font-family:Hiragino Sans GB;color: #409EFF"><i class="el-icon-reading"></i> 提问</h3>
              <div class="m-content">

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                  </el-form-item>

                  <el-form-item  label="内容" prop="description">
                    <mavon-editor style="height: 500px"
                                  ref="md"
                                  placeholder="请输入文档内容(上传文件小于3MB)..."
                                  @imgAdd="imgAdd"
                                  v-model="ruleForm.description"></mavon-editor>
                  </el-form-item>

                  <el-form-item label="标签" prop="tag">
                    <el-input v-model="ruleForm.tag"></el-input>
                  </el-form-item>

                  <!--标签栏-->
                  <el-tabs style="margin: 20px 0px 20px 35px;" >
                    <el-tab-pane v-for="selectCategory in tags"
                                 :label="selectCategory.categoryName"
                                 :name="selectCategory.categoryName">
                      <!--标签内容-->
                      <div class="tag-group">
                        <el-button
                            v-for="selectTag in selectCategory.tags"
                            :key="selectTag"
                            style="margin:5px"
                            type="primary"
                            plain
                            size="small"
                            @click="tagSelect(selectTag)">
                          {{ selectTag }}
                        </el-button>
                      </div>
                    </el-tab-pane>
                  </el-tabs>

                  <!--提交按钮-->
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>

                </el-form>
              </div>
            </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "Publish.vue",
  components: {Header},
  data() {
    return {
      ruleForm: {
        id: '',
        title: '',
        description: '',
        tag: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入问题描述', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '请输入标签内容', trigger: 'blur' }
        ]
      },
      tags: '',
    };
  },
  //方法
  methods: {
    // 将图片上传到服务器，返回地址替换到md中
    imgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append('image', $file);
      console.log(formdata.get('image'))
      //访问后台服务器方法
      this.$axios.post('/file/upload',formdata).then(res => {
        if (res.data.data.success === 1) {
          this.$refs.md.$img2Url(pos, res.data.data.url);
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          const _this = this
          this.$axios.post('/publish/add', this.ruleForm, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          }).then(res => {
            console.log(res)
            _this.$alert('操作成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push("/index")
              }
            });

          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    tagSelect(selectTag){
      const _this = this
      const previous = _this.ruleForm.tag
      if(previous){
        if(previous.indexOf(selectTag)==-1){
          _this.ruleForm.tag = previous+","+selectTag
        }
      }else {
        _this.ruleForm.tag = selectTag
        console.log(selectTag)
      }
    },
  },

  //创建时获取问题信息
  created() {
    const questionId = this.$route.params.questionId
    console.log(questionId)
    const _this = this
    if(questionId) {
      this.$axios.get('/publish/' + questionId).then(res => {
        const question= res.data.data.question
        _this.ruleForm.id = question.id
        _this.ruleForm.title = question.title
        _this.ruleForm.description = question.description
        _this.ruleForm.tag = question.tag
        _this.tags = res.data.data.tags
      })
    }
    else{
      this.$axios.get('/publish/add').then(res => {
        _this.tags = res.data.data
        console.log(_this.tags)
      })
    }
  }
}
</script>

<style scoped>
.m-content {
  text-align: center;
  margin: 20px 0px;
}
.tag-group{
  text-align: left;
}

</style>