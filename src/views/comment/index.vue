<!-- 评论管理页面 -->
<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="commentData" style="width: 100%" stripe>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.disabled"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, modifyArticleStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      commentData: [],
      page: 1,
      totalCount: 0,
      perPage: 10
    }
  },

  computed: {},

  created () {
    this.loadArticles()
  },

  mounted () {},

  methods: {
    handleSizeChange (val) {
      this.perPage = val
      this.page = 1
      this.loadArticles(1)
    },
    handleCurrentChange (val) {
      this.page = val
      this.loadArticles(val)
    },
    loadArticles (page = 1) {
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.perPage
      }).then(res => {
        const results = res.data.data.results
        results.forEach(comment => {
          comment.disabled = false
        })
        this.commentData = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (comment) {
      comment.disabled = true
      modifyArticleStatus(comment.id.toString(), comment.comment_status).then(
        res => {
          comment.disabled = false
          if (!comment.comment_status) {
            this.$message({
              type: 'info',
              message: '已关闭评论'
            })
          } else {
            this.$message({
              type: 'success',
              message: '已打开评论'
            })
          }
        }
      )
    }
  }
}
</script>
<style lang="less" scoped></style>
