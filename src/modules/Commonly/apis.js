const apis = {
  qiniuToken: '/api/sys/file/uptoken',
  roleManage: {
    detail: '/api/sys/role/detail',
    add: '/api/sys/role/add',
    list: '/api/sys/role/myList',
    modify: '/api/sys/role/modify',
    del: '/api/sys/role/delete',
    orgForAddRole: '/api/sys/role/queryOrgForAddRole',
    menuTree: '/api/sys/role/menuTree',
  },
  member: {
    memberList: '/api/web/member/list',
    memberDel: '/api/web/member/delete',
    memberDetail: '/api/web/member/detail',
    phoneNumberSearch: '/api/web/member/info',
    add: '/api/web/member/add',
    modify: '/api/web/member/modify',
    orgList: '/api/web/member/org'
  },
  baseUser: {
    addUser: '/api/base/user/addUser',
    modifyUser: '/api/base/user/modifyUser',
    searchUserById: '/api/base/user/searchUserById',
    queryUser: '/api/base/user/queryUser',
    delUser: '/api/base/user/delUser',
    roleList: '/api/sys/role/myListByOrg',
    orgList: '/api/sys/org/myList',
    codeList: '/api/sys/code/codeList',
    outerUserNum: '/api/base/user/genUserNumber',
    innerUserInfo: '/api/base/user/searchUserByWorkNo'
  },
  enroll: {
    enrollList: '/api/charity/web/sign/list', // 活动报名列表
    enrollReview: '/api/charity/web/sign/review', // 活动报名审核
    enrollDetail: '/api/charity/web/sign/detail', // 活动报名详情
    activityList: '/api/charity/web/activity/name', // 活动名称列表
    departmentList: '/api/charity/web/sign/department', // 部门名称列表
    giveIntergrate: '/api/charity/web/integral/append', // 补送/扣除积分
  },
  banner: {
    bannerList: '/api/officialsite/common/banner/list', // 列表
    orgList: '/api/sys/org/myOrgListForPrime', // organization level one
    changeStatus: 'api/officialsite/common/banner/changestatus', // change status
    addBanner: '/api/officialsite/common/banner/add', // add
    editBanner: '/api/officialsite/common/banner/modify', // edit
    detailBanner: '/api/officialsite/common/banner/detail' // detail
  },
  consult: {
    channel: {
      list: '/api/officialsite/common/channel/list', // list
      delete: '/api/officialsite/common/channel/delete', // delete
      add: '/api/officialsite/common/channel/add', // add
      detail: '/api/officialsite/common/channel/detail', // detail
      modify: '/api/officialsite/common/channel/modify',
    },
    consult: {
      list: '/api/officialsite/common/news/list', // list
      channelList: '/api/officialsite/common/channel/listall', // channelList
      delete: '/api/officialsite/common/news/delete', // delete
      changetop: '/api/officialsite/common/news/changetop', // changetop
      changestatus: '/api/officialsite/common/news/changestatus', // changestatus
      add: '/api/officialsite/common/news/add', // add
      detail: '/api/officialsite/common/news/detail', // detail
      edit: '/api/officialsite/common/news/modify', // edit
      cancelTop: '/api/officialsite/common/news/canceltop'
    }
  },
  activity: {
    list: '/api/officialsite/common/activity/list', // list
    changeStatus: '/api/officialsite/common/activity/changestatus', // 下架
    add: '/api/officialsite/common/activity/add', // add
    detail: '/api/officialsite/common/activity/detail', // detail
    edit: '/api/officialsite/common/activity/modify' // edit
  }
}

export default apis
