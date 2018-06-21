export const HOME = '/'
export const DEMO = `${HOME}demo`
export const LOGIN = `${HOME}login`

// arthur demo
export const ARTHUR = `${HOME}arthur` // arthur
export const ARTHUR_PAGE = `${HOME}arthur/page` // arthur / page
export const ARTHUR_PAGE_SUB = `${HOME}arthur/page/sub` // arthur / page / sub

// ===========================> 基础模块 <=========================== //

export const DATADICTIONARY = `${HOME}dictionary`
export const SYSLOG = `${HOME}systemLog` // 系统日志
export const BASE_MODULE = `${HOME}baseModule` // 基础模块
export const BASE_MODULE_DICTIONARY = `${BASE_MODULE}/dictionary` // 基础模块
export const ORG_MANAGE = `${HOME}orgManage` // 基础模块 / 组织管理
export const MENU_MANAGE = `${HOME}menuManage` // 基础模块 / 菜单管理
export const ORG_AUTHORITY = `${HOME}orgAuthority` // 基础模块 / 机构权限

// ===========================> 通用模块 <=========================== //
export const COMMONLY = `${HOME}commonly` // 通用模块

export const MEMBER = `${COMMONLY}/member` // 会员管理
export const MEMBERDETAIL = `${MEMBER}/detail` // 会员管理 / 明细详情
export const MEMBERADD = `${MEMBER}/add` // 会员管理 / 新增
export const MEMBEREDIT = `${MEMBER}/edit` // 会员管理 / 编辑
export const ROLE_MANAGE = `${COMMONLY}/roleManage` // 通用模块 / 角色管理
export const USER_MANAGE = `${COMMONLY}/userManage` // 通用模块  / 用户管理
export const USER_ADD = `${USER_MANAGE}/add` // 通用模块  / 用户新增
export const USER_EDIT = `${USER_MANAGE}/edit` // 通用模块  / 用户修改
export const ENROLL_MANAGE = `${COMMONLY}/enrollManage` // 通用模块  / 报名管理
export const BANNER_MANAGE = `${COMMONLY}/banner` // 基础通用模块模块  / BANBER管理
export const BANNER_MANAGE_ADD = `${BANNER_MANAGE}/add` // 通用模块  / BANBER管理 / 新增
export const BANNER_MANAGE_EDIT = `${BANNER_MANAGE}/edit` // 通用模块  / BANBER管理 / 编辑

export const ACTIVITY_CENTER = `${COMMONLY}/activity` // 基础模块／用户权限／活动中心
export const ACTIVITY_CENTER_ADD = `${ACTIVITY_CENTER}/add` // 基础模块／用户权限／活动中心/新增
export const ACTIVITY_CENTER_EDIT = `${ACTIVITY_CENTER}/edit`

export const CONSULT = `${COMMONLY}/consult` // 会员管理
export const CHANNEL_MANAGE = `${CONSULT}/channelManage` // 基础模块 / 用户权限 / 咨询管理／频道管理
export const CONSULT_MANAGE = `${CONSULT}/consultlManage` // 基础模块 / 用户权限 / 咨询管理／咨询管理
export const CONSULT_MANAGE_ADD = `${CONSULT_MANAGE}/add` // 基础模块 / 用户权限 /  咨询管理／咨询管理 / 新增
export const CONSULT_MANAGE_EDIT = `${CONSULT_MANAGE}/edit` // 基础模块 / 用户权限 /  咨询管理／咨询管理 / 新增

// ===========================> 教育模块 <=========================== //

export const EDU_MODULE = `${HOME}edu` // 教育模块 / 教室设置
export const CLASS_ROOM_MANAGE = `${EDU_MODULE}/classRoomManage` // 教育模块 / 教室设置
export const EDU_COURSE_MANAGE = `${EDU_MODULE}/courseManage` // 教育模块 / 课程设置
export const EDU_COURSE_MANAGE_ADD = `${EDU_COURSE_MANAGE}/add` // 教育模块 / 课程新增
export const EDU_COURSE_MANAGE_EDIT = `${EDU_COURSE_MANAGE}/edit` // 教育模块 / 课程修改
export const EDU_TEXTBOOK_MANAGE = `${EDU_MODULE}/textbookManage` // 教育模块 / 教材设置
export const EDU_CLASS_MANAGE = `${EDU_MODULE}/classManage` // 教育模块 / 班级管理
export const EDU_CLASS_MANAGE_ADD = `${EDU_CLASS_MANAGE}/add` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_EDIT = `${EDU_CLASS_MANAGE}/edit` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL = `${EDU_CLASS_MANAGE}/detail` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_STUDENT = `${EDU_CLASS_MANAGE_DETAIL}/student` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_RECORD = `${EDU_CLASS_MANAGE_DETAIL}/record` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_RECORD_ADD = `${EDU_CLASS_MANAGE_DETAIL_RECORD}/add` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_RECORD_EDIT = `${EDU_CLASS_MANAGE_DETAIL_RECORD}/edit` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_RECORD_DETAIL = `${EDU_CLASS_MANAGE_DETAIL_RECORD}/detail` // 教育模块 / 班级管理新增
export const EDU_CLASS_MANAGE_DETAIL_SCORE = `${EDU_CLASS_MANAGE_DETAIL}/score` // 教育模块 / 班级管理新增
export const EDU_STUDENT_MANAGE = `${EDU_MODULE}/studentManage` // 教育模块 / 学员管理
export const EDU_STUDENT_DETAIL = `${EDU_STUDENT_MANAGE}/studentDetail` // 教育模块 / 学员明细
export const EDU_STUDENT_ADD = `${EDU_STUDENT_MANAGE}/add` // 学员管理 / 新增
export const EDU_STUDENT_EDIT = `${EDU_STUDENT_MANAGE}/editStudent` // 学员管理 / 编辑
export const EDU_ADD_TOUCH = `${EDU_STUDENT_MANAGE}/addTouch` // 学员管理 / 添加沟通
export const EDU_EDIT_TOUCH = `${EDU_STUDENT_MANAGE}/editTouch` // 学员管理 / 编辑沟通
export const EDU_CHANNEL_SET = `${EDU_MODULE}/channelSet` // 教育模块 / 渠道设置
export const HANDLE_CENTER = `${HOME}handleCenter` // 教育模块 / 办理中心
export const HANDLE_CENTER_ADD_CLASSROOM = `${HOME}handleCenter/addClassroom` // 教育模块 / 报班
export const HANDLE_CENTER_BACKOUT_CLASSROOM = `${HOME}handleCenter/backOutClassroom` // 教育模块 / 退班
export const HANDLE_CENTER_CHANGE_CLASSROOM = `${HOME}handleCenter/changeClassroom` // 教育模块 / 退班
export const HANDLE_CENTER_BUY_TEXTBOOK = `${HOME}handleCenter/buyTextBook` // 教育模块 / 购教材
export const HANDLE_CENTER_BACK_TEXTBOOK = `${HOME}handleCenter/backTextBook` // 教育模块 / 购教材
export const EDU_COURSE_LIST = `${EDU_MODULE}/courseList` // 教育模块 / 排课管理 / 课程列表
export const EDU_COURSE_ARRAY_ADD = `${EDU_COURSE_LIST}/add` // 教育模块 / 排课管理 / 课程列表 / 排课
export const EDU_COURSE_ARRAY_EDIT = `${EDU_COURSE_LIST}/edit` // 教育模块 / 排课管理 / 课程列表 / 编辑
export const EDU_COURSE_SYLLABUS = `${EDU_MODULE}/syllabus` // 教育模块 / 排课管理 / 课程表

// ===========================> 月子中心 <=========================== //

/* 月子中心 */
export const MATERNITY = `${HOME}maternity` // 月子中心
export const MATER_SCHEDULE_MANAGE = `${MATERNITY}/scheduleManage` // 月子中心 / 护士站管理 / 值班安排
export const MATER_BATCH_MANAGE = `${MATERNITY}/batchManage` // 月子中心 / 护士站管理 / 班次管理
export const MATER_DUTY_MANAGE = `${MATERNITY}/materDutyManage` // 月子中心 / 护士站管理 / 当值人员
export const MATER_ROOM_EXTEND_RECORD_INDEX = `${MATERNITY}/materRoomExtendRecord` // 月子中心 / 房态信息管理 / 续房记录
export const MATER_MANAGE_CHECK_ROOM_DETAIL = `${MATERNITY}/materRoomExtendRecord/extend` // 月子中心 / 房态信息管理 / 续房详情
export const MATER_MANAGE_CHECK_RECORD_INDEX = `${MATERNITY}/materRoomCheckRecord` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_MANAGE_CHECK_RECORD_INDEX_CHECKIN = `${MATER_MANAGE_CHECK_RECORD_INDEX}/checkIn` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_MANAGE_CHECK_RECORD_INDEX_CHECKOUT = `${MATER_MANAGE_CHECK_RECORD_INDEX}/checkOut` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_MANAGE_CHECK_RECORD_INDEX_ROOMCHANGE = `${MATER_MANAGE_CHECK_RECORD_INDEX}/roomChange` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_MANAGE_CHECK_RECORD_INDEX_CONTINUEDREDUCK = `${MATER_MANAGE_CHECK_RECORD_INDEX}/continuedReduck` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_MANAGE_CHECK_ROOM = `${MATERNITY}/materRoomCheckRecord/room` // 月子中心 / 房态信息管理 / 房间入住
export const MATER_CUSTOMER_MANAGE = `${MATERNITY}/materCustomerManage` // 月子中心 / 客户关系管理 / 客户管理
export const CUSTOMER_ADD = `${MATERNITY}/materCustomerManage/add` // 月子中心 / 客户关系管理 / 客户管理 ／ 新增
export const CUSTOMER_ADD_BASIC = `${MATERNITY}/materCustomerManage/add/basic` // 月子中心 / 客户关系管理 / 客户管理 ／ 新增基础
export const CUSTOMER_ADD_PRE = `${MATERNITY}/materCustomerManage/add/pre` // 月子中心 / 客户关系管理 / 客户管理 ／ 新增预产
export const CUSTOMER_SEE = `${MATERNITY}/materCustomerManage/see` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看
export const CUSTOMER_SEE_BASIC = `${MATERNITY}/materCustomerManage/see/seeBasic` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看基本信息
export const CUSTOMER_SEE_PRE = `${MATERNITY}/materCustomerManage/see/seePre` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看预产信息
export const CUSTOMER_SEE_ACCOUNT = `${MATERNITY}/materCustomerManage/see/seeAccount` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看账户信息
export const CUSTOMER_SEE_CHECK = `${MATERNITY}/materCustomerManage/see/seeCheck` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看入住信息
export const CUSTOMER_SEE_PROCESS = `${MATERNITY}/materCustomerManage/see/seeProcess` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看跟进信息
export const CUSTOMER_SEE_CONSUME = `${MATERNITY}/materCustomerManage/see/seeConsume` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看消费情况
export const CUSTOMER_CONSUME_DETAIL = `${MATERNITY}/materCustomerManage/see/consumeDetail` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看消费详情
export const CUSTOMER_CHECK_DETAIL = `${MATERNITY}/materCustomerManage/see/checkDetail` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看入住详情
export const CUSTOMER_SEE_CONTRACT = `${MATERNITY}/materCustomerManage/see/seeContract` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看合同列表
export const CUSTOMER_CONTRACT_INFO = `${MATERNITY}/materCustomerManage/see/contractInfo` // 月子中心 / 客户关系管理 / 客户管理 ／ 查看合同详情

export const CUSTOMER_EDIT = `${MATERNITY}/materCustomerManage/edit` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑
export const CUSTOMER_EDIT_BABY = `${MATERNITY}/materCustomerManage/editBaby` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑
export const CUSTOMER_EDIT_BASIC = `${MATERNITY}/materCustomerManage/edit/editBasic` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑 / 基本信息
export const CUSTOMER_EDIT_PRE = `${MATERNITY}/materCustomerManage/edit/editPre` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑 / 预产信息
export const CUSTOMER_EDIT_ACCOUNT = `${MATERNITY}/materCustomerManage/edit/editAccount` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑 / 预产信息
export const CUSTOMER_EDIT_CHECK = `${MATERNITY}/materCustomerManage/edit/editCheck` // 月子中心 / 客户关系管理 / 客户管理 ／ 编辑 / 预产信息
export const CUSTOMER_FOLLOW = `${MATERNITY}/materCustomerManage/follow` // 月子中心 / 客户关系管理 / 客户管理 ／ 跟进情况
export const MATER_GRADE_MANAGE = `${MATERNITY}/materGradeManage` // 月子中心 / 会员管理 / 等级管理
export const MATER_ROOM_MANAGE = `${MATERNITY}/materRoomManage` // 月子中心 / 房态信息管理 / 房间管理
export const MATER_ROOM_CHANGE_RECORD = `${MATERNITY}/materRoomChangeRecord` // 月子中心 / 房态信息管理 / 换房记录
export const MATER_ROOM_CHANGE_RECORD_EDIT = `${MATERNITY}/materRoomChangeRecord/edit`
export const MATER_ROOM_EXTEND_RECORD = `${MATERNITY}/materRoomExtendRecord` // 月子中心 / 房态信息管理 / 续放记录
export const MATER_MANAGE_CHECK_RECORD = `${MATERNITY}/materRoomCheckRecord` // 月子中心 / 房态信息管理 / 入住记录
export const MATER_ROOM_INFO = `${MATERNITY}/roomInfo`
export const MATER_ROOM_INFO_APPOINTMENT = `${MATERNITY}/roomInfo/appointment`
export const MATER_ROOM_INFO_CHECKIN = `${MATERNITY}/roomInfo/checkIn`
export const MATER_ROOM_INFO_CHECKOUT = `${MATERNITY}/roomInfo/checkOut`
export const ROOM_INFO_MATER_ROOM_CHANGE_RECORD = `${MATERNITY}/roomInfo/roomChange`
export const ROOM_INFO_MATER_ROOM_CONTINUED_REDUCK = `${MATERNITY}/roomInfo/continuedReduck`
export const ROOM_INFO_AGTER_RESERVATION_CHECK_IN = `${MATERNITY}/roomInfo/afterReservationCheckIn`
export const MATER_PACKAGES = `${MATERNITY}/packages` // 月子中心 / 套餐管理
export const MATER_PACKAGES_ADD = `${MATERNITY}/packages/add` // 月子中心 / 套餐管理 / 新增
export const MATER_PACKAGES_SEE = `${MATERNITY}/packages/see` // 月子中心 / 套餐管理 / 查看
export const MATER_PACKAGES_EDIT = `${MATERNITY}/packages/edit` // 月子中心 / 套餐管理 / 编辑
export const MATER_SERVICE = `${MATERNITY}/service` // 月子中心 / 服务管理
export const MATER_SERVICE_ADD = `${MATERNITY}/service/add` // 月子中心 / 套餐管理 / 新增
export const MATER_SERVICE_SEE = `${MATERNITY}/service/see` // 月子中心 / 套餐管理 / 查看
export const MATER_SERVICE_EDIT = `${MATERNITY}/service/edit` // 月子中心 / 套餐管理 / 编辑
export const MATER_CONTRACT = `${MATERNITY}/contract` // 月子中心 / 合同管理
export const MATER_CONTRACT_ADD = `${MATERNITY}/contract/add` // 月子中心 / 合同管理  / 新增
export const MATER_CONTRACT_EDIT = `${MATERNITY}/contract/edit` // 月子中心 / 合同管理  / 变更合同
export const MATER_CONTRACT_DETAIL = `${MATERNITY}/contract/detail` // 月子中心 / 合同管理  / 合同详情

// ===========================> 素能中心 <=========================== //

export const TEENCENTER = `${HOME}teen`
export const BOOK_MANAGE = `${TEENCENTER}/bookManage` // 素能中心／预约管理
export const CLASS_MANAGE = `${TEENCENTER}/classManage` // 素能中心／class管理
export const CLASSIFY_MANAGE = `${CLASS_MANAGE}/classify` // 素能中心／class管理／分类管理
export const CLASS_DETAIL = `${CLASS_MANAGE}/classDetail` // 素能中心／class管理／分类管理/课程管理
export const CLASS_DETAIL_ADD = `${CLASS_MANAGE}/classDetail/add` // 素能中心／class管理／分类管理/课程管理 /add
export const CLASS_DETAIL_EDIT = `${CLASS_MANAGE}/classDetail/edit` // 素能中心／class管理／分类管理/课程管理 /edit
export const TEACHER_MANAGE = `${TEENCENTER}/teacher` // teacher manage
export const TEACHER_MANAGE_ADD = `${TEACHER_MANAGE}/add` // teacher manage / add
export const TEACHER_MANAGE_EDIT = `${TEACHER_MANAGE}/edit` // teacher manage / edit

// ===========================> 逸健康 <=========================== //
export const SPORT_MODULE = `${HOME}sport` // 逸健康
export const SPORT_ROOM = `${SPORT_MODULE}/room` // 逸健康 / 教室管理
export const SPORT_COURSE = `${SPORT_MODULE}/course` // 逸健康 / 基础课程管理
export const SPORT_COURSE_ADD = `${SPORT_MODULE}/course/add` // 逸健康 / 基础课程管理 / 新增
export const SPORT_COURSE_EDIT = `${SPORT_MODULE}/course/edit` // 逸健康 / 基础课程管理 / 编辑
export const SPORT_COACH = `${SPORT_MODULE}/coach` // 逸健康 / 教练管理
export const SPORT_COACH_ADD = `${SPORT_MODULE}/coach/add` // 逸健康 / 教练管理 / 注册
export const SPORT_COACH_EDIT = `${SPORT_MODULE}/coach/edit` // 逸健康 / 教练管理 / 编辑
export const SPORT_SCHEDULE = `${SPORT_MODULE}/schedule` // 逸健康 / 排课管理
export const SPORT_SCHEDULE_SYLLABUS = `${SPORT_MODULE}/schedule/syllabus` // 逸健康 / 排课管理 / 课程表
export const SPORT_SCHEDULE_LIST = `${SPORT_MODULE}/schedule/list` // 逸健康 / 排课管理 / 课程列表
export const SPORT_SCHEDULE_LIST_ADD = `${SPORT_MODULE}/schedule/list/add` // 逸健康 / 排课管理 / 课程列表 / 新增
export const SPORT_SCHEDULE_LIST_SUBSCRIBE = `${SPORT_MODULE}/schedule/list/subscribe` // 逸健康 / 排课管理 / 课程列表 / 预约
export const SPORT_SCHEDULE_LIST_EDIT = `${SPORT_MODULE}/schedule/list/edit` // 逸健康 / 排课管理 / 课程列表 / 编辑
export const SPORT_SCHEDULE_LIST_EDIT_REPEAT = `${SPORT_MODULE}/schedule/list/editRepeat` // 逸健康 / 排课管理 / 课程列表 / 编辑
export const SPORT_SCHEDULE_SUBSCRIBE = `${SPORT_MODULE}/schedule/subscribe` // 逸健康 / 排课管理 / 报名信息

// ===========================> 采购 <=========================== //
export const SUPPLY_CHAIN_PURCHASE_MODULE = `${HOME}purc` // 采购

export const SUPPLY_GOODS = `${SUPPLY_CHAIN_PURCHASE_MODULE}/goods` // 供应链 / 货物管理
export const SUPPLY_GOODS_CLASSIFY = `${SUPPLY_GOODS}/classify` // 供应链 / 货物管理 / 货物分类
export const SUPPLY_GOODS_SPEC = `${SUPPLY_GOODS}/spec` // 供应链 / 货物管理 / 货物规格
export const SUPPLY_GOODS_CENTER = `${SUPPLY_GOODS}/center` // 供应链 / 货物管理 / 货物中心
export const SUPPLY_GOODS_CENTER_ADD = `${SUPPLY_GOODS_CENTER}/add` // 供应链 / 货物管理 / 货物中心 / 新增货物
export const SUPPLY_GOODS_CENTER_EDIT = `${SUPPLY_GOODS_CENTER}/edit` // 供应链 / 货物管理 / 货物中心 / 货物编辑
export const SUPPLY_GOODS_CENTER_SPEC_EDIT = `${SUPPLY_GOODS_CENTER}/specedit` // 供应链 / 货物管理 / 货物中心 / 货物编辑
export const SUPPLY_GOODS_CENTER_DETAIL = `${SUPPLY_GOODS_CENTER}/detail` // 供应链 ／ 货物管理 ／ 货物中心 ／ 货物详情
export const SUPPLY_GOODS_FORMULA = `${SUPPLY_GOODS}/formula` // 供应链 / 货物管理 / 配方设置
export const SUPPLY_GOODS_FORMULA_BOUND = `${SUPPLY_GOODS}/formula/bind` // 供应链 / 货物管理 / 配方绑定
export const SUPPLY_GOODS_FORMULA_EDIT = `${SUPPLY_GOODS}/formula/edit` // 供应链 / 货物管理 / 配方编辑
export const SUPPLY_GOODS_FORMULA_INFO = `${SUPPLY_GOODS}/formula/info` // 供应链 / 货物管理 / 配方详情

export const SUPPLY_PURCHASE = `${SUPPLY_CHAIN_PURCHASE_MODULE}/purchase` // 供应链 / 采购管理
export const SUPPLY_PURCHASE_PROVIDER = `${SUPPLY_PURCHASE}/provider` // 供应链 / 采购管理 / 供应商管理
export const SUPPLY_PURCHASE_PROVIDER_ADD = `${SUPPLY_PURCHASE_PROVIDER}/add` // 供应链 / 采购管理 / 供应商管理 / 新增
export const SUPPLY_PURCHASE_PROVIDER_EDIT = `${SUPPLY_PURCHASE_PROVIDER}/edit` // 供应链 / 采购管理 / 供应商管理 / 编辑
export const SUPPLY_PURCHASE_PROVIDER_DETAIL = `${SUPPLY_PURCHASE_PROVIDER}/detail` // 供应链 / 采购管理 / 供应商管理 / 编辑

export const SUPPLY_PURCHASE_CONTRACT = `${SUPPLY_PURCHASE}/contract` // 供应链 / 采购管理 / 采购合同
export const SUPPLY_PURCHASE_CONTRACT_ADD = `${SUPPLY_PURCHASE_CONTRACT}/add` // 供应链 / 采购管理 / 采购合同
export const SUPPLY_PURCHASE_CONTRACT_DETAIL = `${SUPPLY_PURCHASE_CONTRACT}/detail` // 供应链 / 采购管理 / 采购合同详情
export const SUPPLY_PURCHASE_CONTRACT_EDIT = `${SUPPLY_PURCHASE_CONTRACT}/edit` // 供应链 / 采购管理 / 采购合同详情

export const SUPPLY_PURCHASE_PLAN = `${SUPPLY_PURCHASE}/plan` // 供应链 / 采购管理 / 采购计划
export const SUPPLY_PURCHASE_ORDER = `${SUPPLY_PURCHASE}/order` // 供应链 / 采购管理 / 采购订单
export const SUPPLY_PURCHASE_ORDERDETAIL = `${SUPPLY_PURCHASE}/orderdetail` // 供应链 / 采购管理 / 采购订单详情
export const SUPPLY_PURCHASE_WAREHOUSEDETAIL = `${SUPPLY_PURCHASE}/warehousedetail` // 供应链 / 采购管理 / 入库订单详情
export const SUPPLY_PURCHASE_EDITORDER = `${SUPPLY_PURCHASE}/editorder` // 供应链 / 采购管理 / 采购订单 / 编辑采购订单

// ===========================> 供应链 <=========================== //
export const SUPPLY_CHAIN_MODULE = `${HOME}supplyChain` // 供应链

export const SUPPLY_ORDER = `${SUPPLY_CHAIN_MODULE}/order` // 供应链 / 订单管理
export const SUPPLY_ORDER_EORDER = `${SUPPLY_ORDER}/eorder` // 供应链 / 订单管理 / 电商订单
export const SUPPLY_ORDER_DETAIL = `${SUPPLY_ORDER_EORDER}/eorderdetail` // 供应链 / 订单管理 / 电商订单详情
export const SUPPLY_CATE_ORDER = `${SUPPLY_ORDER}/allocateorder` // 供应链 / 订单管理 / 调拨订单
export const SUPPLY_CATE_ORDER_ADD = `${SUPPLY_ORDER}/allocateadd` // 供应链 / 订单管理 / 调拨订单新增
export const SUPPLY_CATE_ORDER_EDIT = `${SUPPLY_ORDER}/allocateedit` // 供应链 / 订单管理 / 编辑调拨订单
export const SUPPLY_CATE_DETAIL = `${SUPPLY_ORDER}/allocateDetail` // 供应链 / 订单管理 / 调拨订单/ 详情
export const SUPPLY_BIND_SHOP = `${SUPPLY_ORDER}/bindshop` // 供应链 / 订单管理 / 绑定店铺
export const SUPPLY_BIND_CITY = `${SUPPLY_ORDER}/bindcity` // 供应链 / 订单管理 / 绑定城市

export const SUPPLY_DEPOT = `${SUPPLY_CHAIN_MODULE}/depot` // 供应链 / 仓库管理
export const SUPPLY_STOCK_MANAGE = `${SUPPLY_DEPOT}/stock` // 供应链 ／ 仓库管理 ／ 库存管理
export const SUPPLY_STOCK_CHECK = `${SUPPLY_STOCK_MANAGE}/check` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存查询
export const SUPPLY_STOCK_OPERATE = `${SUPPLY_STOCK_MANAGE}/operate` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作
export const SUPPLY_STOCK_OPERATE_INBOUND_NEW = `${SUPPLY_STOCK_MANAGE}/operate/inbound/new` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 创建入库单
export const SUPPLY_STOCK_OPERATE_INBOUND_EDIT = `${SUPPLY_STOCK_MANAGE}/operate/inbound/edit` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 编辑入库单
export const SUPPLY_STOCK_OPERATE_INBOUND_INFO = `${SUPPLY_STOCK_MANAGE}/operate/inbound/info` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 入库单详情
export const SUPPLY_STOCK_OPERATE_RETURN = `${SUPPLY_STOCK_MANAGE}/operate/return` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 采购退货
export const SUPPLY_STOCK_OPERATE_OUTBOUND_NEW = `${SUPPLY_STOCK_MANAGE}/operate/outbound/new` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 创建出库单
export const SUPPLY_STOCK_OPERATE_OUTBOUND_EDIT = `${SUPPLY_STOCK_MANAGE}/operate/outbound/edit` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 编辑出库单
export const SUPPLY_STOCK_OPERATE_OUTBOUND_INFO = `${SUPPLY_STOCK_MANAGE}/operate/outbound/info` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存操作 / 出库单详情
export const SUPPLY_STOCK_RECORD = `${SUPPLY_STOCK_MANAGE}/record` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 操作记录
export const SUPPLY_STOCK_INVENTORY = `${SUPPLY_STOCK_MANAGE}/inventory` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存盘点
export const SUPPLY_STOCK_INVENTORY_ENTRY = `${SUPPLY_STOCK_MANAGE}/inventory/entry` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存盘点 / 进入盘点
export const SUPPLY_STOCK_INVENTORY_INFO = `${SUPPLY_STOCK_MANAGE}/inventory/info` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 库存盘点 / 盘点详情
export const SUPPLY_STOCK_DIFFERENCE = `${SUPPLY_STOCK_MANAGE}/difference` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 盘点少货差异
export const SUPPLY_STOCK_DIFFERENCE_EDIT = `${SUPPLY_STOCK_MANAGE}/difference/edit` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 盘点少货差异 / 差异处理
export const SUPPLY_STOCK_DIFFERENCE_INFO = `${SUPPLY_STOCK_MANAGE}/difference/info` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 盘点少货差异 / 差异详情
export const SUPPLY_STOCK_THRESHOLD = `${SUPPLY_STOCK_MANAGE}/threshold` // 供应链 ／ 仓库管理 ／ 库存管理 ／ 预警设置
export const SUPPLY_SORT_MANAGE = `${SUPPLY_DEPOT}/sort` // 供应链 ／ 仓库管理 ／ 分拣单管理
export const SUPPLY_SORT_BEGINORCONTINUE = `${SUPPLY_SORT_MANAGE}/pick` // 供应链 ／ 仓库管理 ／ 分拣单管理
export const SUPPLY_SORT_CONTINUE = `${SUPPLY_SORT_MANAGE}/continue` // 供应链 ／ 仓库管理 ／ 分拣单管理
export const SUPPLY_SORTLOGISTICS_MANAGE = `${SUPPLY_DEPOT}/logistics` // 供应链 ／ 仓库管理 ／ 分拣单管理

export const SUPPLY_SORT_DETAIL = `${SUPPLY_SORT_MANAGE}/detail` // 供应链 ／ 仓库管理 ／ 分拣单详情
export const SUPPLY_DEPOT_GOODS = `${SUPPLY_DEPOT}/goods` // 供应链 ／ 仓库管理 ／ 仓库货物
export const SUPPLY_DEPOT_GOODS_DETAIL = `${SUPPLY_DEPOT_GOODS}/detail` // 供应链 ／ 仓库管理 ／ 仓库货物 ／ 货物详情
export const SUPPLY_DEPOT_RESERVOIR = `${SUPPLY_DEPOT}/reservoir` // 供应链 ／ 仓库管理 ／ 库区设置
export const SUPPLY_DEPOT_LIBRARY = `${SUPPLY_DEPOT}/library` // 供应链 ／ 仓库管理 ／ 库位设置
export const SUPPLY_DEPOT_WATCH = `${SUPPLY_DEPOT}/watch` // 供应链 ／ 仓库管理 ／ 保质期监控

export const SUPPLY_REPORT = `${SUPPLY_CHAIN_MODULE}/report` // 供应链 / 报表管理
export const SUPPLY_REPORT_COST = `${SUPPLY_CHAIN_MODULE}/reportcost` // 供应链 / 报表管理/移动加权成本

export const SUPPLY_LOGISTICS = `${SUPPLY_CHAIN_MODULE}/logistic` // 供应链 / 物流管理
export const SUPPLY_LOGISTICS_SHOP = `${SUPPLY_LOGISTICS}/shoplogistic` // 供应链 / 店铺物流绑定
export const SUPPLY_LOGISTICS_WAYBILL_DETAIL = `${SUPPLY_LOGISTICS}/waybill/detail` // 供应链 / 运单 / 详情

export const SUPPLY_IMPORT = `${SUPPLY_CHAIN_MODULE}/import` // 供应链 / 导入管理
export const SUPPLY_IMPORT_OPERATE = `${SUPPLY_IMPORT}/operate` // 供应链 / 导入管理 / 导入操作

// ===========================> 零售 <=========================== //
export const RETAIL = `${HOME}retail` // 零售
export const RETAIL_GOODS = `${RETAIL}/goods` // 零售 / 门店商品
export const RETAIL_GOODS_ADD = `${RETAIL_GOODS}/add` // 零售 / 门店商品 / 新增
export const RETAIL_GOODS_EDIT = `${RETAIL_GOODS}/edit` // 零售 / 门店商品 / 编辑
export const RETAIL_GOODS_DETAIL = `${RETAIL_GOODS}/detail` // 零售 / 门店商品 / 详情
export const RETAIL_CATEGORY = `${RETAIL}/categoryManage` // 零售 / 分类管理
export const RETAIL_STORE_GOODS = `${RETAIL}/storeGoods` // 零售 / 门店商品
export const RETAIL_STORE_GOODS_DETAIL = `${RETAIL_STORE_GOODS}/detail` // 零售 / 门店商品 / 详情
export const RETAIL_BRAND_PRICE = `${RETAIL}/brandPrice` // 零售 / 门店商品 / 品牌价格
export const RETAIL_SELLING_PRICE = `${RETAIL}/sellingPrice` // 零售 / 门店商品 / 差异价格
export const RETAIL_GOODS_CATE = `${RETAIL}/categoryList` // 零售 / 门店商品 / 类别显示
export const RETAIL_ORDER = `${RETAIL}/order` // 零售 / 零售订单
export const RETAIL_ORDER_DETAIL = `${RETAIL_ORDER}/detail` // 零售 / 零售订单 / 详情
export const RETAIL_BILL = `${RETAIL}/closeBill` // 零售 / 关账单据
export const RETAIL_BILL_ORDER = `${RETAIL_BILL}/billOrder` // 零售 / 关账单据订单列表
export const RETAIL_BILL_ORDER_DETAIL = `${RETAIL_BILL_ORDER}/detail` // 零售 / 关账单据订单列表
export const RETAIL_REPORT = `${RETAIL}/report` // 零售 报表管理
export const RETAIL_REPORT_TIME = `${RETAIL_REPORT}/timeLine` // 零售 报表管理 销售时间带分析
export const RETAIL_SALE_DETAIL = `${RETAIL_REPORT}/detail` // 零售 报表管理 销售明细表
export const RETAIL_SALE_RANK = `${RETAIL_REPORT}/rank` // 零售 报表管理 销售排行
export const RETAIL_SHELF = `${RETAIL}/shelf` // 零售 货架管理
export const RETAIL_SHELF_LIST = `${RETAIL_SHELF}/list` // 零售 / 货架管理 / 货架列表
export const RETAIL_SHELF_LIST_ADD = `${RETAIL_SHELF_LIST}/add` // 零售 / 货架管理 / 货架列表 / 商品配置
export const RETAIL_SHELF_LIST_EDIT = `${RETAIL_SHELF_LIST}/edit` // 零售 / 货架管理 / 货架列表 / 编辑
export const RETAIL_SHELF_LIST_DETAIL = `${RETAIL_SHELF_LIST}/detail` // 零售 / 货架管理 / 货架列表 / 查看库存
export const RETAIL_SHELF_MONITOR = `${RETAIL_SHELF}/monitor` // 零售 / 货架管理 / 货架监控
export const RETAIL_SHELF_WARN = `${RETAIL_SHELF}/warn` // 零售 / 货架管理 / 预警
export const RETAIL_SHELF_REPLE = `${RETAIL_SHELF}/reple` // 零售 / 货架管理 / 补货单
export const RETAIL_SHELF_REPLE_ADD = `${RETAIL_SHELF_REPLE}/add` // 零售 / 货架管理 / 补货单 / 补货单录入
export const RETAIL_SHELF_REPLE_DETAIL = `${RETAIL_SHELF_REPLE}/detail` // 零售 / 货架管理 / 补货单 / 补货单详情
export const RETAIL_STOCK = `${HOME}stock` // 零售 库存管理
export const RETAIL_STOCK_LIST = `${RETAIL_STOCK}/list` // 零售 库存管理 库存查询
export const RETAIL_STOCK_DISTRIBUTE = `${RETAIL_STOCK_LIST}/distribute` // 零售 库存管理 库存查询 库存分布列表
export const RETAIL_STOCK_INVENTORY = `${RETAIL_STOCK}/inventory` // 零售 库存管理 库存盘点
export const RETAIL_STOCK_INVENTORY_DETAIL = `${RETAIL_STOCK}/inventory/detail` // 零售 库存管理 库存盘点 库存盘点详情
export const RETAIL_STOCK_INVENTORY_RECORD = `${RETAIL_STOCK}/inventory/record` // 零售 库存管理 库存盘点 库存盘点录入
export const RETAIL_STOCK_LOSS_OVERFLOW = `${RETAIL_STOCK}/lossOverflow` // 零售 库存管理 报损报溢单
export const RETAIL_STOCK_LOSS_OVERFLOW_DETAIL = `${RETAIL_STOCK}/lossOverflow/detail` // 零售 库存管理 报损报溢单 详情

// ===========================> 产业会员 <=========================== //
export const INDUSTRY_MEMBER = `${HOME}member`
export const MEMBER_MANAGE = `${INDUSTRY_MEMBER}/manage`
export const MEMBER_LIST = `${MEMBER_MANAGE}/list`
export const MEMBER_ADD = `${MEMBER_MANAGE}/add`
export const MEMBER_EDIT = `${MEMBER_MANAGE}/edit`
export const MEMBER_DETAIL = `${MEMBER_MANAGE}/detail`
export const MEMBER_CUSTOM_FIELDS = `${MEMBER_MANAGE}/customFields`
export const MEMBER_CUSTOM_FIELDS_ADD = `${MEMBER_MANAGE}/customFields/add`
export const MEMBER_CUSTOM_FIELDS_EDIT = `${MEMBER_MANAGE}/customFields/edit`
export const MEMBER_INTEGRAL = `${INDUSTRY_MEMBER}/integral`
export const MEMBER_INTEGRAL_RULE = `${INDUSTRY_MEMBER}/integral/rule`
export const MEMBER_INTEGRAL_DETAIL = `${INDUSTRY_MEMBER}/integral/detail`
export const MEMBER_RIGHT = `${INDUSTRY_MEMBER}/right`
export const MEMBER_RIGHT_MANAGE = `${MEMBER_RIGHT}/manage`
export const MEMBER_RIGHT_LIBRARY = `${MEMBER_RIGHT}/library`
export const MEMBER_CARD = `${INDUSTRY_MEMBER}/card` // 会员中心 会员卡 列表
export const MEMBER_CARD_MEMBER_LIST = `${MEMBER_CARD}/member/list` // 会员中心 会员卡 开卡列表
export const MEMBER_CARD_ADD = `${MEMBER_CARD}/add` // 会员中心 会员卡 新增
export const MEMBER_CARD_ADD_DETAIL = `${MEMBER_CARD}/addDetail` // 会员中心 会员卡 新增 详细信息
export const MEMBER_CARD_EDIT = `${MEMBER_CARD}/edit` // 会员中心 会员卡 编辑
export const MEMBER_CARD_EDIT_DETAIL = `${MEMBER_CARD}/editDetail` // 会员中心 会员卡 编辑 详细信息

// ===========================> 仿佛世界 <=========================== //
export const LIBRARY = `${HOME}library`
export const LIBRARY_RECOMMEND = `${LIBRARY}/recommend`

// ===========================> 订单中心 <=========================== //
export const ORDER_CENTER = `${HOME}orderCenter` // 订单中心
export const ORDER_CENTER_TEMPLATE = `${ORDER_CENTER}/template` //  订单中心 / 模板管理
export const ORDER_CENTER_TEMPLATE_DETAIL = `${ORDER_CENTER_TEMPLATE}/detail` // 订单中心 /  模板管理 / 模板详情
export const ORDER_CENTER_TEMPLATE_ADD = `${ORDER_CENTER_TEMPLATE}/add` //  订单中心 /  模板管理 / 新增模板
export const ORDER_CENTER_ORDER = `${ORDER_CENTER}/order` // 订单中心 / 订单列表
export const ORDER_CENTER_ORDER_DETAIL = `${ORDER_CENTER_ORDER}/detail` // 订单中心 / 订单详情
export const ORDER_CENTER_REFUND = `${ORDER_CENTER}/refund` // 订单中心 / 退款管理
export const ORDER_CENTER_REFUND_DETAIL = `${ORDER_CENTER_REFUND}/detail` // 订单中心 / 退款详情
export const ORDER_CENTER_REFUND_ADD = `${ORDER_CENTER_REFUND}/add` // 订单中心 / 退款申请
// ===========================> 宠物模块 <=========================== //
export const PET = `${HOME}pet`
export const PET_SPECIES = `${PET}/species`

// ===========================> 古玩城官网 <=========================== //
export const ANTIQUE = `${HOME}antique`
export const ANTIQUE_BOOK = `${ANTIQUE}/book` // 古玩城官网 / 预约管理
export const ANTIQUE_FAMOUS = `${ANTIQUE}/famous` // 古玩城官网 / 名家管理
export const ANTIQUE_FAMOUS_ADD = `${ANTIQUE_FAMOUS}/add` // 古玩城官网 / 名家新增
