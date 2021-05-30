// 用户相关请求模块
import request from '@/utils/request.js'
// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}
// 用户资料
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}
// 编辑用户头像
export const setUserImage = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
// 编辑用户资料
export const setUserInfo = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
