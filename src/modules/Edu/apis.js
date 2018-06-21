const apis = {
  eduCourse: {
    courseList: '/api/edu/course/queryList',
    courseDelete: '/api/edu/course/delete',
    courseDetail: '/api/edu/course/detail',
    courseAdd: '/api/edu/course/add',
    courseModify: '/api/edu/course/modify',
    codeList: '/api/sys/code/codeList',
    bookList: '/api/edu/textbook/queryAllList',
    orgList: '/api/web/member/org',
  },
  classRomm: {
    list: '/api/edu/classroom/queryList',
    add: '/api/edu/classroom/add',
    modify: '/api/edu/classroom/modify',
    detail: '/api/edu/classroom/detail',
    del: '/api/edu/classroom/delete',
    queryOrg: '/api/sys/org/myList',
  },
  class: {
    list: '/api/edu/class/queryList',
    add: '/api/edu/class/add',
    modify: '/api/edu/class/modify',
    detail: '/api/edu/class/detail',
    del: '/api/edu/class/delete',
    queryOrg: '/api/sys/org/myList',
    queryClassroom: '/api/edu/classroom/queryListAll',
    queryTeacher: '/api/base/user/queryUserListByOrg',
    lessonPageList: '/api/edu/course/queryList',
    classStudentList: '/api/edu/classStudent/list',
    classStudentScoreList: '/api/edu/classStudent/score/list',
    classStudentScoreDelete: '/api/edu/classStudent/score/del',
    classStudentScoreEdit: '/api/edu/classStudent/score/modify',
    classStudentAllList: '/api/edu/classStudent/listAll',
    sendMsg: '/api/edu/classStudent/sendMsg',
    recordList: '/api/edu/classStudent/record/list',
    recordDetail: '/api/edu/classStudent/record/detail',
    deleteRecord: '/api/edu/classStudent/record/del',
    addStudentScore: '/api/edu/classStudent/score/add',
    addRecord: '/api/edu/classStudent/record/add',
    editRecord: '/api/edu/classStudent/record/modify',
  },
  textbookManage: {
    add: '/api/edu/textbook/add',
    modify: '/api/edu/textbook/modify',
    detail: '/api/edu/textbook/detail',
    queryList: '/api/edu/textbook/queryList',
    delete: '/api/edu/textbook/delete',
    codeList: '/api/sys/code/codeList',
  },
  handleCenter: {
    queryList: '/api/edu/order/list',
    add: '/api/edu/order/add',
    getOrgList: '/api/sys/org/myList',
    queryClass: '/api/edu/order/queryClass',
    priceBy: '/api/edu/order/priceById',
    queryUserByOrg: '/api/base/user/queryAllUser',
    getStudentName: '/api/edu/student/listByNo',
    modify: '/api/edu/textbook/modify',
    detail: '/api/edu/textbook/detail',
    orderDetail: '/api/edu/order/detail',
    delete: '/api/edu/textbook/delete',
    codeList: '/api/sys/code/codeList',
    getBookList: 'api/edu/textbook/queryList',
    refFund: '/api/edu/order/refund',
    changeClassroom: '/api/edu/order/change',
    buyBook: '/api/edu/order/buyBook',
    refundBook: '/api/edu/order/refundBook'
  },
  studentManage: {
    queryOrg: '/api/sys/org/myList',
    queryAllUser: '/api/base/user/queryAllUser',
    channelListAll: '/api/edu/student/channel/listAll',
    studentCenter: '/api/edu/student/list',
    studentAdd: '/api/edu/student/add',
    delete: '/api/edu/student/del',
    detail: '/api/edu/student/detail',
    courseList: '/api/edu/course/queryList',
    StudentEdit: '/api/edu/student/modify',
    touchAdd: '/api/edu/student/touch/add',
    touchEdith: '/api/edu/student/touch/modify',
    msgNotice: '/api//edu/student/sendMsg',
    channelList: '/api/edu/student/channel/list',
    channelAdd: '/api/edu/student/channel/add',
    channelEdit: '/api/edu/student/channel/modify',
    channelDel: '/api/edu/student/channel/del',
    stuLinkType: '/api/sys/code/codeList',
  },
  courseArray: {
    getScheduleList: '/api/edu/class/schedule/home',
    getCourseList: '/api/edu/class/schedule/list',
    deleteRepeatDelete: '/api/edu/class/schedule/delNo',
    deleteSingleDelete: '/api/edu/class/schedule/del',
    queryOrg: '/api/sys/org/myList',
    getCourseArrayDetail: '/api/edu/class/schedule/detail',
    getCourseArrayDayDetail: '/api/edu/class/schedule/dayDetail',
    editSingleDetail: '/api/edu/class/schedule/modify',
    editRepeatDetail: '',
    addCourseArray: '/api/edu/class/schedule/add',
    editSingleCourseArray: '/api/edu/class/schedule/modifyId',
    editRepeatCourseArray: '/api/edu/class/schedule/modifyNo',
    queryTeacher: '/api/base/user/queryUserListByOrg',
    queryClassroom: '/api/edu/classroom/queryListAll',
  }
}

export default apis
