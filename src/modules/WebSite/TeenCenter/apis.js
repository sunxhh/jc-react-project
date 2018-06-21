const apis = {
  bookManage: {
    bookList: '/api/prime/reserved/list', // 预约列表
    bookDetail: '/api/prime/reserved/detail', // 预约详情
    bookHandle: '/api/prime/reserved/process', // 预约处理
  },
  classManage: {
    classify: {
      list: '/api/prime/course/category/list', // list
      add: '/api/prime/course/category/add', // add
      delete: '/api/prime/course/category/del', // delete
      modify: '/api/prime/course/category/modify', // modify
      detail: '/api/prime/course/category/detail', // detail
      classAll: '/api/prime/course/listAll', // 课程列表
    },
    class: {
      list: '/api/prime/course/list', // list
      del: '/api/prime/course/del', // delete
      recommand: '/api/prime/course/changeRecommend', // recommand
      add: '/api/prime/course/add', // add
      edit: '/api/prime/course/modify', // modify
      detail: '/api/prime/course/detail' // detail
    }
  },
  teacherManage: {
    list: '/api/prime/teacher/list', // list
    del: 'api/prime/teacher/del', // del
    add: '/api/prime/teacher/add', // add
    detail: '/api/prime/teacher/detail', // detail
    modify: '/api/prime/teacher/modify' // modify
  }
}

export default apis
