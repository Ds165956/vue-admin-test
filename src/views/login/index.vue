<!-- 登录页 -->
<template>
  <div class="login_container">
    <particles></particles>
    <div class="loginmod">
      <img src="@/assets/logo.png" class="login_logo" alt="" />
      <el-form class="login_form" :rules="rules" ref="login-form" :model="user">
        <el-form-item prop="mobile">
          <el-input
            class="login_input"
            v-model="user.mobile"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            type="password"
            class="login_input"
            v-model="user.code"
            placeholder="请输入密码"
            prefix-icon="el-icon-view"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="status" class="login_status"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            class="login_btn"
            :loading="login_loading"
            type="primary"
            @click="onLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Particles from '@/components/particles/index'
import { login } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      rules: {
        mobile: [
          { required: true, message: '账号不能为空！', trigger: 'change' },
          {
            pattern: /^1[3|5|6|7|8|9]\d{9}$/,
            message: '手机号格式不正确'
          }
        ],
        code: [
          { required: true, message: '密码不能为空！', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '密码格式错误' }
        ]
      },
      status: false,
      login_loading: false
    }
  },

  components: {
    Particles
  },

  computed: {},

  mounted () {},

  methods: {
    onLogin () {
      // 表单验证
      if (this.status) {
        // 验证通过，提交登录
        this.$refs['login-form'].validate(valid => {
          if (valid) {
            this.login()
          } else {
            this.login_loading = false
            return false
          }
        })
      } else {
        this.$message.error('请同意用户协议和隐私条款')
      }
    },
    login () {
      this.login_loading = true
      login(this.user)
        .then(res => {
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          this.login_loading = false
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          // this.$router.push('/')
          this.$router.push({
            name: 'home'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message.error('账户或密码错误！')
          this.login_loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .loginmod {
    width: 400px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    box-shadow: 5px 5px 10px #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 40px;
    box-sizing: border-box;
    z-index: 1;

    .login_logo {
      width: 50px;
      height: 50px;
      margin-bottom: 50px;
    }

    .login_btn {
      width: 100%;
    }
    .login_status {
      color: #000;
      font-weight: bold;
    }
  }
}
</style>
