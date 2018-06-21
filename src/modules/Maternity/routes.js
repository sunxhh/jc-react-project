/* 月子中心 */
import * as urls from 'Global/urls'
import MaternityModule from 'bundle-loader?lazy!./'

export default [
// =============> 月子中心 <============= //
  {
    path: urls.MATERNITY,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '月子中心',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_SCHEDULE_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '值班安排',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_BATCH_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '班次管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_DUTY_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '当值人员',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_ROOM_EXTEND_RECORD_INDEX,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '续房记录',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_MANAGE_CHECK_RECORD_INDEX,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '入住记录',
    parentPath: urls.HOME
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_ROOM}/:type/:id/:roomId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房间入住',
    parentPath: urls.MATER_MANAGE_CHECK_RECORD_INDEX
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_ROOM_DETAIL}/:id/:type`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '续房详情',
    parentPath: urls.MATER_ROOM_EXTEND_RECORD_INDEX
  },
  // 会员等级管理
  {
    path: urls.MATER_GRADE_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '等级管理',
    parentPath: urls.HOME
  },
  // 客户关系 客户管理
  {
    path: urls.MATER_CUSTOMER_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '客户管理',
    parentPath: urls.HOME
  },
  {
    path: urls.CUSTOMER_ADD,
    exact: false,
    baseComponent: MaternityModule,
    breadcrumbName: '新增',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 客户关系 客户管理 查看
  {
    path: `${urls.CUSTOMER_SEE}/:showType/:id/:type/:customerType`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 客户关系 客户管理 编辑
  {
    path: `${urls.CUSTOMER_EDIT}/:showType/:id/:type`,
    exact: false,
    baseComponent: MaternityModule,
    breadcrumbName: '编辑',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  {
    path: `${urls.CUSTOMER_EDIT_BABY}/:id/`,
    exact: false,
    baseComponent: MaternityModule,
    breadcrumbName: '编辑',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 跟进情况
  {
    path: `${urls.CUSTOMER_FOLLOW}/:id`,
    exact: false,
    baseComponent: MaternityModule,
    breadcrumbName: '跟进情况',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 消费情况
  {
    path: `${urls.CUSTOMER_CONSUME_DETAIL}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '消费详情',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 入住详情
  {
    path: `${urls.CUSTOMER_CHECK_DETAIL}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '入住详情',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  // 合同详情
  {
    path: `${urls.CUSTOMER_CONTRACT_INFO}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '合同详情',
    parentPath: urls.MATER_CUSTOMER_MANAGE
  },
  {
    path: urls.MATER_ROOM_MANAGE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房间管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_ROOM_INFO,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房态信息',
    parentPath: urls.HOME
  },
  {
    path: `${urls.MATER_ROOM_INFO_APPOINTMENT}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房间预约',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_ROOM_INFO_CHECKIN}/:roomId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房间入住',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CHECKIN}/:roomId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '房间入住',
    parentPath: urls.MATER_MANAGE_CHECK_RECORD_INDEX
  },
  {
    path: `${urls.ROOM_INFO_AGTER_RESERVATION_CHECK_IN}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '预约后入住',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_ROOM_INFO_CHECKOUT}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '退房',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CHECKOUT}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '退房',
    parentPath: urls.MATER_MANAGE_CHECK_RECORD_INDEX
  },
  {
    path: `${urls.ROOM_INFO_MATER_ROOM_CHANGE_RECORD}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '换房',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_RECORD_INDEX_ROOMCHANGE}/:recordId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '换房',
    parentPath: urls.MATER_MANAGE_CHECK_RECORD_INDEX
  },
  {
    path: `${urls.ROOM_INFO_MATER_ROOM_CONTINUED_REDUCK}/:recordId`, // 续房
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '续房',
    parentPath: urls.MATER_ROOM_INFO
  },
  {
    path: `${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CONTINUEDREDUCK}/:recordId`, // 续房
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '续房',
    parentPath: urls.MATER_MANAGE_CHECK_RECORD_INDEX
  },
  {
    path: urls.MATER_ROOM_CHANGE_RECORD,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '换房记录',
    parentPath: urls.HOME
  },
  {
    path: `${urls.MATER_ROOM_CHANGE_RECORD_EDIT}/:recordAuditId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '换房记录编辑',
    parentPath: urls.MATER_ROOM_CHANGE_RECORD
  },
  // 套餐管理
  {
    path: urls.MATER_PACKAGES,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '套餐管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_PACKAGES_ADD,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '新增',
    parentPath: urls.MATER_PACKAGES
  },
  {
    path: `${urls.MATER_PACKAGES_EDIT}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '编辑 ',
    parentPath: urls.MATER_PACKAGES
  },
  {
    path: `${urls.MATER_PACKAGES_SEE}/comboNo/:comboNo`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看',
    parentPath: urls.MATER_PACKAGES
  },
  {
    path: `${urls.MATER_PACKAGES_SEE}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看',
    parentPath: urls.MATER_PACKAGES
  },
  // 服务管理
  {
    path: urls.MATER_SERVICE,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '服务列表',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_SERVICE_ADD,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '新增服务',
    parentPath: urls.MATER_SERVICE
  },
  {
    path: `${urls.MATER_SERVICE_EDIT}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '编辑任务',
    parentPath: urls.MATER_SERVICE
  },
  {
    path: `${urls.MATER_SERVICE_SEE}/:id`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看服务',
    parentPath: urls.MATER_SERVICE
  },
  // 合同管理
  {
    path: urls.MATER_CONTRACT,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '合同管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MATER_CONTRACT_ADD,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '新增合同',
    parentPath: urls.MATER_CONTRACT
  },
  {
    path: `${urls.MATER_CONTRACT_EDIT}/:contractId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '变更合同',
    parentPath: urls.MATER_CONTRACT
  },
  {
    path: `${urls.MATER_CONTRACT_DETAIL}/:contractId`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看合同',
    parentPath: urls.MATER_CONTRACT
  },
  {
    path: `${urls.MATER_CONTRACT_DETAIL}/contractNum/:contractNum`,
    exact: true,
    baseComponent: MaternityModule,
    breadcrumbName: '查看合同',
    parentPath: urls.MATER_CONTRACT
  },
]
