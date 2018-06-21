import { reducer as nurseBatch } from './nurse/batchManage/reduck'
import { reducer as nurseDuty } from './nurse/dutyManage/reduck'
import { reducer as nurseSchedule } from './nurse/scheduleManage/reduck'
import { reducer as gradeManageOrg } from './grade/gradeManage/reduck'
import { reducer as roomRecord } from './room/checkRecord/reduck'
import { reducer as extendRecordList } from './room/extendRecord/reduck'
import { reducer as customerManage } from './customer/customerManage/reduck'
import { roomInfo } from './room/roomInfo/roomInfoReduck'
import { appointment } from './room/roomInfo/reduck'
import { turnRoom } from './room/roomInfo/turnRoomReduck'

import { materClassRoom } from './room/roomManage/reduck'
import { materChangeRoom } from './room/changeRecord/reduck'
import { updRoomChange } from './room/changeRecord/updChangeReduck'
import { roomChange } from './room/roomInfo/checkChangeReduck'
import { afterReservationCheckIn } from './room/roomInfo/afterReservationCheckInReduck'
import { packages } from './packages/reduck'
import { service } from './service/reduck'
import { contract } from './contract/reduck'

export const reducers = {
  nurseBatch,
  nurseDuty,
  nurseSchedule,
  gradeManageOrg,
  roomRecord,
  extendRecordList,
  customerManage,
  roomInfo,
  appointment,
  turnRoom,
  materClassRoom,
  materChangeRoom,
  updRoomChange,
  roomChange,
  afterReservationCheckIn,
  packages,
  contract,
  service,
}
