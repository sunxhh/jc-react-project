const apis = {
  common: {
    dictionaryList: '/api/dictionary/v1/detail',
    joblList: '/api/sysuser/v1/list',
    classRoomList: '/api/fitness/room/v1/alllist',
    courseList: '/api/fitness/course/v1/alllist',
  },
  room: {
    roomList: '/api/fitness/room/v1/list',
    roomAdd: '/api/fitness/room/v1/add',
    roomDetail: '/api/fitness/room/v1/detail',
    roomModify: '/api/fitness/room/v1/modify',
    roomDelete: '/api/fitness/room/v1/delete',
  },
  course: {
    courseList: '/api/fitness/course/v1/list',
    courseDetail: '/api/fitness/course/v1/detail',
    courseAdd: '/api/fitness/course/v1/add',
    courseModify: '/api/fitness/course/v1/modify',
    courseDelete: '/api/fitness/course/v1/delete',
  },
  schedule: {
    scheduleDelete: '/api/schedule/course/v1/delete',
    scheduleRepeatDelete: '/api/schedule/course/batch/v1/delete',
    scheduleModify: '/api/schedule/course/v1/modify',
    scheduleRepeatModify: '/api/schedule/course/batch/v1/modify',
    scheduleAdd: '/api/schedule/course/batch/v1/add',
    scheduleDetail: '/api/schedule/course/v1/detail',
    scheduleRepeatDetail: '/api/schedule/course/batch/v1/detail',
    scheduleList: '/api/schedule/course/v1/list',
    subscribeList: '/api/reservation/v1/list',
    cancelSub: '/api/reservation/v1/cancel',
    reservationRedirect: '/api/reservation/v1/redirect',
    memberInfoByIdOrPhone: '/api/reservation/v1/member/orders',
    syllabusList: '/api/schedule/course/v1/timetableList',
    reservation: '/api/reservation/v1/apply',
    reservationListByScheduleNo: '/api/schedule/course/reservation/v1/list',
  }
}

export default apis
