import request from '@/utils/request'

export default {
  createStatisticByDay(day) {
    return request({
      url: `/admin/statistics/daily/create/${day}`,
      method: 'post'
    })
  }
}
