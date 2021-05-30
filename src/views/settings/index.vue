<!-- 个人设置页面 -->
<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="14">
          <el-form
            ref="user-form"
            :model="user"
            label-width="100px"
            :rules="formRules"
          >
            <el-form-item label="编号：">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机：">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称：" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：" prop="intro">
              <el-input
                type="textarea"
                v-model="user.intro"
                :rows="8"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onUserInfo"
                :loading="saveLoading"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="4" :span="4">
          <label for="file">
            <el-avatar
              shape="square"
              :size="200"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpen"
      @closed="onDialogClose"
    >
      <div class="preview_image_wrap">
        <img class="preview_image" :src="previewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdataPhoto" :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, setUserImage, setUserInfo } from '@/api/user'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import bus from '@/utils/bus'
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      previewImage: '',
      cropper: null,
      loading: false,
      saveLoading: false,
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },

  computed: {},

  created () {
    this.loadUser()
  },

  mounted () {},

  methods: {
    onUserInfo () {
      this.$refs['user-form'].validate(valid => {
        if (!valid) {
          return 0
        } else {
          this.saveLoading = true
          const { name, intro, email } = this.user
          setUserInfo({
            name,
            intro,
            email
          })
            .then(res => {
              this.saveLoading = false
              bus.$emit('update-user', this.user)
              this.$message({
                type: 'success',
                message: '保存用户信息成功'
              })
            })
            .catch(_ => {
              this.saveLoading = false
              this.$message({
                type: 'error',
                message: '保存用户信息失败'
              })
            })
        }
      })
    },
    loadUser () {
      getUserInfo().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      this.dialogVisible = true
      this.$refs.file.value = ''
    },
    onDialogOpen () {
      const image = this.$refs['preview-image']
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return 0
      } else {
        this.cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'none',
          cropBoxResizable: false,
          movable: true
        })
      }
    },
    onDialogClose () {
      // this.cropper.destroy()
    },
    onUpdataPhoto () {
      this.loading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        setUserImage(fd).then(res => {
          this.user.photo = window.URL.createObjectURL(file)
          this.loading = false
          // this.user.photo = res.data.data.photo
          this.dialogVisible = false
          bus.$emit('update-user', this.user)
          this.$message({
            type: 'success',
            message: '头像上传成功'
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.preview_image_wrap {
  .preview_image {
    display: block;
    max-width: 100%;
    height: 250px;
  }
}
</style>
