const apis = {
  login: '/api/user/login',
  logout: '/api/user/logout',
  qiniuToken: '/api/sys/file/uptoken',
  readMenuTree: 'api/sys/role/readMenuTree',
  queryOrg: '/api/sys/org/myList',
  // queryOrgByLevel: 'api/sys/org/myListByLevel',
  queryOrgByLevel: '/api/supplychain/warehouse/orgList/v1',
  // classRoomList: '/api/edu/classroom/queryListAll',
  modifyPass: '/api/user/updatePwd',
  regionv2: '/api/sys/common/regionv2',
  aliToken: '/api/supplychain/common/sts/v1',
  shopInfoList: '/api/sys/shop/info/detail',
  firstOrgList: '/api/sys/org/myListByLevel'
}

export default apis
