<!-- 布局组件 -->
<template>
  <el-container class="layout_container">
    <el-aside width="auto">
      <app-aside class="aside_menu" :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="avater_left">
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>Ds后台</span>
        </div>
        <el-dropdown>
          <div class="avater_right">
            <img :src="user.photo" class="avater" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserInfo } from '@/api/user'
import bus from '@/utils/bus'

export default {
  name: 'LayoutIndex',
  components: { AppAside },
  props: {},
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },

  computed: {},

  created () {
    this.loadUserInfo()
    bus.$on('update-user', data => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },

  mounted () {},

  methods: {
    loadUserInfo () {
      getUserInfo().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.localStorage.removeItem('user')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
.layout_container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #292c35;
}

.el-aside {
  background-color: #d3dce6;
}
.aside_menu {
  height: 100%;
  border: none;
}
.avater_left {
  color: #fff;
}
.avater_right {
  display: flex;
  align-items: center;
  color: #fff;
}
.avater {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.el-main {
  background-color: #e9eef3;
}
</style>
