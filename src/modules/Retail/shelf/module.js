import shelfListMoudle from './list/module'
import shelfMonitorMoudle from './monitor/module'
import shelfWarnMoudle from './warn/module'
import shelfRepleMoudle from './replenishment/module'

// ===========================> Action Types <=========================== //

export default {
  namespace: 'shelf',

  state: {
    title: 'this is shelf list',
    page: {
      currentPage: 1,
      pageSize: 20
    },
  },

  actions: {

  },

  reducers: {

  },

  children: [
    shelfListMoudle,
    shelfMonitorMoudle,
    shelfWarnMoudle,
    shelfRepleMoudle
  ]
}
