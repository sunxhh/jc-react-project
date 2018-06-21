import { arrayToMap } from 'Utils/helper'
// 状态处理状态 0 待处理 1 已安排 2 无人接听 3 号码错误 4 关闭
export const bookStatus = [
  { value: '0', name: '待处理', key: 'PENDING' },
  { value: '1', name: '已安排', key: 'ARRANGED' },
  { value: '2', name: '无人接听', key: 'UNANSWERED' },
  { value: '3', name: '号码错误', key: 'NONUMBER' },
  { value: '4', name: '关闭', key: 'CLOSED' }
]
export const bookStatusMap = arrayToMap(bookStatus, 'value')
export const bookStatusKeyMap = arrayToMap(bookStatus, 'key')
