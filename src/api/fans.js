import request from '@/utils/request'

// 获取粉丝列表
export const uploadImages = (page, perPage) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params: {
      page,
      per_page: perPage
    }
  })
}
