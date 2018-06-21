const apis = {
  book: {
    getList: '/api/gwc/reserved/list',
    getDetail: '/api/gwc/reserved/detail',
    bookHandle: '/api/gwc/reserved/process',
    export: '/api/gwc/reserved/export'
  },
  famous: {
    getList: '/api/gwc/artist/list',
    add: '/api/gwc/artist/add',
    modify: '/api/gwc/artist/modify',
    del: '/api/gwc/artist/del',
    getDetail: 'api/gwc/artist/detail',
    getAllList: '/api/gwc/artist/listAll'
  },
  getAliToken: '/api/gwc/file/sts/v1'
}

export default apis
