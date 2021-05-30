<!-- 文章封面组件 -->
<template>
  <div class="upload-cover" @click="showDialog">
    <div class="cover-warp">
      <!-- <img ref="cover-image" class="cover-warp-img" :src="coverImage" /> -->
      <img ref="cover-image" class="cover-warp-img" :src="value" />
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <image-list
            :is-show-add="false"
            :is-show-action="false"
            ref="image-list"
            :is-show-selected="true"
          ></image-list>
        </el-tab-pane>
        <el-tab-pane label="上传封面" name="second" class="shangchuan">
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
          <label for="file">
            <img
              width="200"
              ref="preview-image"
              src="https://img1.baidu.com/it/u=2052255783,3171134435&fm=26&fmt=auto&gp=0.jpg"
              height="200"
            />
          </label>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImages } from '@/api/image'
import ImageList from '@/components/imagelist/index'
export default {
  name: 'UploadCover',
  components: { ImageList },
  // props: ['cover-image'],
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },

  computed: {},

  created () {},

  mounted () {},

  methods: {
    showDialog () {
      this.dialogVisible = true
    },
    onFileChange () {
      const file = this.$refs.file
      const blob = window.URL.createObjectURL(file.files[0])
      this.$refs['preview-image'].src = blob
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message({
            type: 'error',
            message: '请上传封面图片'
          })
        } else {
          const fd = new FormData()
          fd.append('image', file)
          uploadImages(fd).then(res => {
            this.dialogVisible = false
            // this.$refs['cover-image'].src = res.data.data.url

            this.$emit('input', res.data.data.url)
            // this.$emit('update-cover', res.data.data.url)
          })
        }
      } else if (this.activeName === 'first') {
        const imageList = this.$refs['image-list']
        let selected = null
        selected = imageList.selected
        if (selected == null) {
          this.$message({
            type: 'error',
            message: '请选择封面图片'
          })
          return
        }
        this.dialogVisible = false
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.upload-cover {
  margin-right: 10px;

  .cover-warp {
    width: 150px;
    height: 150px;
    border: 1px dotted #ccc;

    .image-slot-box {
      width: 100%;
      height: 100%;
    }

    .cover-warp-img {
      width: 100%;
      height: 100%;
    }
  }
}
.shangchuan {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
