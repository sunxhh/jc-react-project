import { book } from './bookManage/reduck'
import { classify } from './classManage/classifyManage/reduck'
import { teacher } from './teacherManage/reduck'
import { classDetail } from './classManage/classDetail/reduck'

export const reducers = {
  book,
  classify,
  teacher,
  classDetail
}
