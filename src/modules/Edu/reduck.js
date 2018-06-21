import { reducer as eduCourse } from './courseManage/reduck'
import { reducer as classroom } from './classRoomManage/reduck'
import { reducer as classManage } from './classManage/reduck'
import { reducer as textbookManage } from './textbookManage/reduck'
import { reducer as eduStudents } from './studentManage/reduck'
import { reducer as courseArray } from './courseArray/reduck'
import { reducer as handleCenter } from './handleCenter/reduck'

export const reducers = {
  eduCourse,
  classroom,
  classManage,
  textbookManage,
  handleCenter,
  eduStudents,
  courseArray,
}
