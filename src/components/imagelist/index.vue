<!-- 素材库组件 -->
<template>
  <div class="image-list">
    <div class="top_group">
      <el-radio-group v-model="radioValue" size="mini" @change="radioChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button></el-radio-group
      >
      <el-button
        v-if="isShowAdd"
        type="success"
        size="mini"
        @click="dialogUploadVisible = true"
        >上传素材</el-button
      >
    </div>
    <div>
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
          class="image_box"
          @click.native="selected = index"
        >
          <el-image style="height: 135px" :src="img.url" fit="cover" lazy>
          </el-image>
          <div
            v-if="isShowSelected && selected === index"
            class="selected"
          ></div>
          <div class="image_btn" v-if="isShowAction">
            <el-button
              circle
              size="small"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              @click="onCollectImage(img)"
              :loading="img.loading"
            ></el-button>
            <el-button
              circle
              size="small"
              icon="el-icon-delete-solid"
              @click="onDelectImage(img.id)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pageCount"
      @current-change="onPageChange"
      :current-page.sync="page"
      :page-size="pageSize"
    >
    </el-pagination>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      append-to-body
      width="400px"
    >
      <el-upload
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :show-file-list="true"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectionImages, deleteImages } from '@/api/image'
export default {
  name: 'ImageList',
  components: {},
  props: {
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      radioValue: false,
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      page: 1,
      pageCount: 0,
      pageSize: 10,
      selected: null
    }
  },

  computed: {},

  created () {
    this.loadImages(1)
  },

  mounted () {},

  methods: {
    loadImages (page, collect = false) {
      getImages({
        collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.pageCount = res.data.data.total_count
      })
    },
    radioChange (value) {
      this.page = 1
      this.loadImages(1, value)
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.page = 1
      this.loadImages(1, false)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.page = page
      this.loadImages(page, false)
    },
    onCollectImage (img) {
      img.loading = true
      collectionImages(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        if (!img.is_collected) {
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
        }
        img.loading = false
        // this.loadImages(this.page, false)
      })
    },
    onDelectImage (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteImages(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          this.loadImages(this.page, false)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.top_group {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image_box {
  position: relative;
}
.image_btn {
  height: 40px;
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
  background: rgba(204, 204, 204, 0.5);
  color: #fff;
  font-size: 22px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.selected {
  background: url('./success.png') no-repeat;
  background-size: 135px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
