import { reducer as roleManage } from './roleManage/reduck'
import { reducer as baseUser } from './userManage/reduck'
import { reducer as member } from './member/reduck'
import { reducer as enroll } from './enrollManage/reduck'
import { banner } from './bannerManage/reduck'
import { channel } from './consultManage/channelManage/reduck'
import { activity } from './activityCenter/reduck'
import { consult } from './consultManage/consultManage/reduck'

export const reducers = {
  roleManage,
  baseUser,
  member,
  enroll,
  banner,
  channel,
  activity,
  consult,
}
