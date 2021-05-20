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
                <el-table
                    :data="questions.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
                    style="width: 100%">
                  <el-table-column
                      label="我发布的问题">
                    <template slot-scope="scope">
                      <router-link :to="{name: 'Question', params: {questionId: scope.row.id}}">
                        <el-link>{{scope.row.title}}</el-link>
                      </router-link>
                      <div>
                        <span class="text-desc">
                        <span>{{scope.row.comment_count}}</span> 个评论 •
                        <span>{{scope.row.view_count}}</span> 次浏览 •
                        <span>{{scope.row.gmt_modified}}</span>更新 </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="right">
                    <template slot="header" slot-scope="scope">
                      <el-input
                          v-model="search"
                          size="mini"
                          placeholder="输入关键字搜索"/>
                    </template>
                    <template slot-scope="scope">
                      <el-button
                          size="mini"
                          @click="handleEdit(scope.row.id)">Edit</el-button>
                      <el-button
                          size="mini"
                          type="danger"
                          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
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
import Profilebar from "../../components/Profilebar";
export default {
  name: "Myquestion.vue",
  components: {Profilebar, Header},
  data() {
    return {
      questions:[],
      total:0,
      currentPage: 1,
      pageSize: 5,
      search: ''
    }
  },
  methods: {
    page(currentPage) {
      const _this = this
      this.$axios.get('/profile/myquestion/?page=' + currentPage).then((res) => {
        _this.questions = res.data.data.questionDtos
        for (const question of _this.questions) {
          question.gmt_create = _this.$moment(question.gmt_create).format('YYYY-MM-DD')
          question.gmt_modified = _this.$moment(question.gmt_modified).format('YYYY-MM-DD')
        }
        _this.questions.search=''
        _this.currentPage = res.data.data.currentPage
        _this.total = res.data.data.totalPages*_this.pageSize
      })
    },
    handleEdit(questionId) {
      this.$router.push("/publish/"+questionId);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
  created() {
    this.page(1)
  },
}
</script>

<style scoped>

</style>