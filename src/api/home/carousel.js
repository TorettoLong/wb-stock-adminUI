import request from '@/utils/request'

export function getList(pageNum, pageSize) {
  return request({
    url: '/carousel/list/' + pageNum + '/' + pageSize,
    method: 'get'
  })
}

export function updateCarousel(carousel) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post',
    data: carousel
  })
}

export function addCarousel(carousel) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post',
    data: carousel
  })
}

export function updateStatus(carouselId) {
  return request({
    url: '/carousel/updateCarousel',
    method: 'post'
  })
}

export function del(carouselId) {
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
