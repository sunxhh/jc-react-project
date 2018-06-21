import { reducer as menuManageReducers } from './menuManage/reduck'
import { reducer as orgAuthority } from './orgAuthority/reduck'
import { reducer as org } from './orgManage/reduck'
import { reducer as dictionary } from './dictionary/reduck'
import { reducer as sysLog } from './systemLog/reduck'

export const reducers = {
  menuManageReducers,
  orgAuthority,
  org,
  dictionary,
  sysLog,
}
