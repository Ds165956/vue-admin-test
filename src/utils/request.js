import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router/'
import {
  Message
} from 'element-ui'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [function (data) {
    // 定义后端返回的原始数据处理
    try {
      return JSONbig.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// const req1 = axios.create()
// req1.defaults.baseURL = 'http://api-toutiao-web.itheima.net'

// 设置请求拦截器

request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  })

// 相应拦截器

request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const status = error.response.status
  console.log(status)
  if (status === 401) {
    window.localStorage.removeItem('user')
    Message.error('登陆状态无效，请重新登录')
    router.push('/login')
  } else if (status === 403) {
    // token 未携带或已过期
    Message.warning('没有操作权限')
  } else if (status === 404) {
    // 客户端参数错误
    Message.error('参数错误,请检查请求参数')
  } else if (status > 500) {
    // 服务端错误
    Message.error('内部异常，请稍后重试')
  }
  return Promise.reject(error)
})

export default request
