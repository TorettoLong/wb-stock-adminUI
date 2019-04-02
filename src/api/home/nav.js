import request from '@/utils/request'

export function getList(pageNum, pageSize) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function updateNav(nav) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function addNav(nav) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function updateStatus(navId) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function del(navId) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function updateSort(ids) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}
