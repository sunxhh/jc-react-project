const apis = {
  // qiniuToken: '/api/sys/file/uptoken',
  codeList: '/api/sys/code/codeList',
  dictionary: {
    dictionary: '/api/sys/code/queryCodesPageByTypeNo',
    treeData: '/api/sys/code/queryTypeTrees',
    add: '/api/sys/code/addCode',
    edit: '/api/sys/code/updateCode',
    detail: '/api/sys/code/codeDetail',
    del: '/api/sys/code/delCode',
    updAvailable: '/api/sys/code/available',
    delType: '/api/sys/code/delType',
    updType: '/api/sys/code/updateType',
    addType: '/api/sys/code/addType',
  },
  systemLog: {
    logList: '/api/sys/log/list'
  },
  orgAuthority: {
    list: '/api/sys/org/list',
    menuTree: '/api/sys/org/menuTree',
    save: 'api/sys/org/putMenu',
  },
  menu: {
    menuList: '/api/sys/menu/tree',
    menuAdd: '/api/sys/menu/add',
    menuModify: '/api/sys/menu/modify',
    menuDelete: '/api/sys/menu/delete',
    menuDetail: '/api/sys/menu/detail',
  },
  org: {
    orgList: '/api/sys/org/tree',
    orgAdd: '/api/sys/org/add',
    orgModify: '/api/sys/org/modify',
    orgDelete: '/api/sys/org/delete',
    orgDetail: '/api/sys/org/detail',
  },
}

export default apis
