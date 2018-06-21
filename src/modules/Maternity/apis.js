const apis = {
  qiniuToken: '/api/sys/file/uptoken',
  materNurse: {
    batchManage: {
      batchInvalid: '/api/web/shift/invalid',
      batchNameList: '/api/web/shift/name',
      batchList: '/api/web/shift/list',
      batchModify: '/api/web/shift/modify',
      batchAdd: '/api/web/shift/add'
    },
    dutyManage: {
      accompanyList: '/api/web/personnel/accompany',
      dutyDelete: '/api/web/personnel/delete',
      dutyList: '/api/web/personnel/list',
      nurseList: '/api/web/personnel/staff',
      dutyModify: '/api/web/personnel/modify',
      dutyAdd: '/api/web/personnel/add',
      dutyAndBatchDetail: '/api/web/nurse/detail', // 班次详情与当值人员详情公用一个api
      serviceList: '/api/carecenter/web/contract/contractServices',
      serviceSelected: '/api/web/personnel/selected',
      serviceArrange: '/api/web/personnel/arrange',
    },
    scheduleManage: {
      nurseCenter: '/api/web/nurse/center',
      scheduleCancel: '/api/web/nurse/cancel',
      scheduleAdd: '/api/web/nurse/add',
      scheduleGrid: '/api/web/nurse/grid'
    },
    codeList: '/api/web/common/dict'
  },
  memberGrade: {
    memberGradeOrg: '/api/web/rank/ranks',
    getMemberGradeList: '/api/web/rank/list',
    deleteMemberGrade: '/api/web/rank/delete',
    addMemberGrade: '/api/web/rank/add',
    modifyMemberGrade: '/api/web/rank/modify',
    getCheckRankName: '/api/web/rank/check'
  },
  roomRecord: {
    getListConditions: '/api/carecenter/web/room/listConditions', // 获取所有月子中心
    checkinRecordList: '/api/carecenter/web/record/checkinlist', // 获取入住记录 列表
    extendRecordList: '/api/carecenter/web/record/continuedlist', // 获取续房列表
    extendDetail: '/api/carecenter/web/record/detailAudit', // 获取续房列表
    auditExtendRoom: '/api/carecenter/web/record/saveAudit', // 续房 审核
    modifyExtendRoom: '/api/carecenter/web/record/updateAuditXF', // 续房 审核
    confirmCheck: '/api/carecenter/web/record/saveBespeakCheckin', // 已预约 入住
    deleteRoom: '/api/carecenter/web/record/saveCheckout', // 退房
    getDetailRecord: '/api/carecenter/web/record/detailRecord', // 转房 续房 详情页
    getRoomList: '/api/carecenter/web/room/roomList', // 转房时获取房间列表
    saveExtendRoom: '/api/carecenter/web/record/saveContinued', // 保存续房信息
    saveChangeRoom: '/api/carecenter/web/record/saveChange', // 保存换房信息
    getMomInfo: '/api/web/customer/detail', // 获取妈妈信息
    getBabyInfo: '/api/web/customer/mombaby' // 获取宝宝信息
  },
  customerManage: {
    getQiniuToken: '/api/sys/file/uptoken', // 获取七牛token
    getCityList: '/api/web/customer/region', // 获取省市区信息
    customerList: '/api/web/customer/list', // 客户列表
    nurseCenter: '/api/web/nurse/center', // 所在中心
    changeStatus: '/api/web/customer/status/modify', // 修改状态
    addPreInfo: '/api/web/customer/pregant/modify', // 新增预产信息
    getNurseList: '/api/web/personnel/staff', // 新增预产信息
    addCoustomerInfo: '/api/web/customer/add', // 新增客户信息
    modifyCoustomerInfo: '/api/web/customer/modify', // 修改客户信息
    getBasicInfo: '/api/web/customer/detail', // 获取用户基本信息
    getBasicAndPreInfo: '/api/web/customer/whole', // 获取用户基本信息
    getPreInfo: '/api/web/customer/pregant/detail', // 获取用户 预产信息
    getAccountInfo: '/api/web/customer/account/detail', // 获取用户 账户信息
    getCheckInfo: '/api/carecenter/web/record/customerCheckinlist', // 获取用户 入住信息
    processList: '/api/web/customer/process/list', // 查看跟进信息
    consumeList: 'api/carecenter/web/consume/customerConsumeList', // 查看消费记录
    processConditons: '/api/web/customer/process/listConditions', // 跟进情况数据字典
    processModify: '/api/web/customer/process/modify', // 跟进情况修改
    processAdd: '/api/web/customer/process/add', // 跟进情况添加
    processDetail: '/api/web/customer/process/detail', // 跟进情况详情
    processCustomerInfo: '/api/web/customer/personal', // 跟进客户详情
    babyModify: '/api/web/customer/save', // 查询宝宝详情
    consumeDetail: '/api/carecenter/web/consume/detail', // 查看消费详情
    consumeConditions: '/api/carecenter/web/consume/listConditions', // 消费数据字典
    checkDetail: '/api/carecenter/web/record/detailRecordOfCustomer', // 查看入住详情
    contractList: '/api/carecenter/web/contract/listOfCustomer', // 查看合同列表
    contractInfo: '/api/carecenter/web/contract/detailOfCustomer', // 查看合同列表
  },
  roomInfo: {
    listInfo: '/api/carecenter/web/record/roomInformation',
    roomInfoDetail: '/api/carecenter/web/room/detail',
    dictionaryList: '/api/carecenter/web/room/listConditions',
    mombabyinfoList: '/api/web/customer/mombabyinfo',
    addAppointment: '/api/carecenter/web/record/saveBespeak',
    addCheckIn: '/api/carecenter/web/record/saveBespeakCheckin',
    addNowCheckIn: '/api/carecenter/web/record/saveNowCheckin',
    addCheckCheckOut: '/api/carecenter/web/record/saveCheckout',
    queryStatusNum: '/api/carecenter/web/room/roomStatusNum',
    getQueryList: '/api/carecenter/web/room/listConditions',
    roomChangeDetail: '/api/carecenter/web/record/detailRecord',
    roomChangeSave: '/api/carecenter/web/record/saveChange',
    roomContinuedSave: '/api/carecenter/web/record/saveContinued',
    nurseList: '/api/web/personnel/bednurse',
    queryContract: '/api/carecenter/web/contract/queryContract',
  },
  roomManage: {
    list: '/api/carecenter/web/room/list',
    add: '/api/carecenter/web/room/add',
    modify: '/api/carecenter/web/room/update',
    detail: '/api/carecenter/web/room/detail',
    listConditions: '/api/carecenter/web/room/listConditions',
    offAndOnLine: '/api/carecenter/web/room/roomOff'
  },
  roomChangeRecord: {
    list: '/api/carecenter/web/record/changelist',
    detail: '/api/carecenter/web/record/detailAudit',
    save: '/api/carecenter/web/record/updateAuditZF',
    getRoomNum: '/api/carecenter/web/room/roomList',
    saveAudit: '/api/carecenter/web/record/saveAudit'
  },
  packages: {
    list: '/api/web/combo/list',
    listConditions: '/api/web/combo/listConditions',
    detail: '/api/web/combo/detail',
    status: '/api/web/combo/status',
    add: '/api/web/combo/add',
    modify: '/api/web/combo/modify',
  },
  service: {
    list: '/api/web/service/list',
    detail: '/api/web/service/detail',
    status: '/api/web/service/status',
    add: '/api/web/service/add',
    modify: '/api/web/service/modify',
  },
  contract: {
    list: '/api/carecenter/web/contract/list',
    listConditions: '/api/carecenter/web/contract/listConditions',
    detail: '/api/carecenter/web/contract/detail',
    update: '/api/carecenter/web/contract/update',
    add: '/api/carecenter/web/contract/add',
    createContractNum: '/api/carecenter/web/contract/createContractNum',
    roomList: '/api/carecenter/web/room/roomList',
    changeStatus: '/api/carecenter/web/contract/changeStatus',
    comboChooseList: '/api/web/combo/list',
    momDetail: '/api/web/customer/detail',
    orderDetail: '/api/carecenter/web/order/detail',
    momBabyList: '/api/web/customer/mombabyinfo',
  }
}

export default apis
