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
                    :data="notifications"
                    style="width: 100%">
                  <el-table-column
                      label="我的消息">
                    <template slot-scope="scope">
                      <span>{{scope.row.out_username}} {{scope.row.typename}}  </span>
                      <el-button type="text" @click="notifyRead(scope.row.id,scope.row.outerid,scope.row.status)">{{scope.row.out_title}}</el-button>
                      <el-tag v-show="scope.row.status===0" type="danger" size="small">未读</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                      align="right">
                    <template slot-scope="scope">
                      <span class="text-desc">
                        {{scope.row.gmt_create }}
                      </span>
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
  name: "Message.vue",
  components: {Profilebar,Header},
  data() {
    return {
      notifications:[],
      total:0,
      currentPage: 1,
      pageSize: 5,
    }
  },
  methods: {
    page(currentPage) {
      const _this = this
      this.$axios.get('/profile/message/?page=' + currentPage).then((res) => {
        _this.notifications = res.data.data.notificationDtos
        for (const notification of _this.notifications) {
          notification.gmt_create = _this.$moment(notification.gmt_create).format('YYYY-MM-DD HH:mm')
        }
        _this.currentPage = res.data.data.currentPage
        _this.total = res.data.data.totalPages*_this.pageSize
      })
    },
    //发送请求更新消息状态并且跳转
    notifyRead(notificationId,outerid,status){
      const _this = this
      if(status===0){//如果当前消息没读，才调用接口修改状态，否则直接跳转
        this.$axios.post('/notification/'+notificationId).then((res) => {
          const userInfo = res.data.data
          //更新userinfo，主要更新未读消息
          _this.$store.commit("SET_USERINFO", userInfo)
        })
      }
      this.$router.push("/question/"+outerid)
    }
  },
  created() {
    this.page(1)
  },
}
</script>

<style scoped>

</style>