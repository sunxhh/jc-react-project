import { arrayToMap } from 'Utils/helper'
// 订单状态，0-待激活，1-待付款，2-待商家确认，3-商家已接单，4-配送中，5-未使用，6-已付款，7-已使用，8-待收货，9-交易完成，10-交易关闭
export const OrderStatus = [
  { value: '0', name: '待激活', key: 'INIT' },
  { value: '1', name: '待付款', key: 'WAIT_PAY' },
  { value: '2', name: '待商家确认', key: 'WAIT_CONFIRM' },
  { value: '3', name: '商家已接单', key: 'CONFIRMED' },
  { value: '4', name: '配送中', key: 'DISPATCHING' },
  { value: '5', name: '未使用', key: 'NOT_USED' },
  { value: '6', name: '已付款', key: 'PAID' },
  { value: '7', name: '已使用', key: 'USED' },
  { value: '8', name: '待收货', key: 'WAIT_RECEIVED' },
  { value: '9', name: '交易完成', key: 'FINISH' },
  { value: '10', name: '交易关闭', key: 'CLOSED' }
]
export const OrderStatusMap = arrayToMap(OrderStatus, 'value')
export const OrderStatusKeyMap = arrayToMap(OrderStatus, 'key')

// 业务子类型:0:纽堡迪,1:仿佛,2:金诚慈善
export const BusinessType = [
  { value: '0', name: '纽堡迪', key: 'NBD' },
  { value: '1', name: '仿佛', key: 'FF' },
  { value: '2', name: '金诚慈善', key: 'JCCS' }
]
export const BusinessTypeMap = arrayToMap(BusinessType, 'value')
export const BusinessTypeKeyMap = arrayToMap(BusinessType, 'key')

// 订单来源，1：金诚逸，2：客如云，3：金诚TV，4：收银台'
export const OrderFrom = [
  { value: '1', name: '金诚逸', key: 'JCY' },
  { value: '2', name: '客如云', key: 'KRY' },
  { value: '3', name: '金诚TV', key: 'JCTV' },
  { value: '4', name: '收银台', key: 'SY' },
]
export const OrderFromMap = arrayToMap(OrderFrom, 'value')
export const OrderFromKeyMap = arrayToMap(OrderFrom, 'key')

// 销售渠道，线上网店和线下门店、无人终端
export const SaleChannel = [
  { value: '1', name: '线上网店', key: 'ONLINE' },
  { value: '2', name: '线下门店', key: 'OFFLINE' },
  { value: '3', name: '无人终端', key: 'UNMANNED' },
]
export const SaleChannelMap = arrayToMap(SaleChannel, 'value')
export const SaleChannelKeyMap = arrayToMap(SaleChannel, 'key')

// 身份类型，1：金诚逸，2：支付宝，3：微信
export const UserType = [
  { value: '1', name: '金诚逸', key: 'JCY' },
  { value: '2', name: '支付宝', key: 'ALIPAY' },
  { value: '3', name: '微信', key: 'WXPAY' },
]
export const UserTypeMap = arrayToMap(UserType, 'value')
export const UserTypeKeyMap = arrayToMap(UserType, 'key')

// 支付方式，1：金诚币，2：支付宝，3：微信，4：现金
export const PayMethod = [
  { value: '1', name: '金诚币', key: 'JCB' },
  { value: '2', name: '支付宝', key: 'ALIPAY' },
  { value: '3', name: '微信', key: 'WXPAY' },
  { value: '4', name: '现金', key: 'CASH' },
]
export const PayMethodMap = arrayToMap(PayMethod, 'value')
export const PayMethodKeyMap = arrayToMap(PayMethod, 'key')

// 支付类型，自付和代付
export const PayType = [
  { value: '1', name: '自付', key: 'SELF' },
  { value: '2', name: '代付', key: 'OTHER' },
]
export const PayTypeMap = arrayToMap(PayType, 'value')
export const PayTypeKeyMap = arrayToMap(PayType, 'key')

// 支付进度状态，0-未支付，2-支付中，3-已支付，4-支付失败
export const PayStatus = [
  { value: '0', name: '未支付', key: 'NO_PAY' },
  { value: '1', name: '支付中', key: 'PAYING' },
  { value: '2', name: '已支付', key: 'PAID' },
  { value: '3', name: '支付失败', key: 'PAY_FAILED' },
]
export const PayStatusMap = arrayToMap(PayStatus, 'value')
export const PayStatusKeyMap = arrayToMap(PayStatus, 'key')

// 发货状态，1-已发货， 2-未发货
export const SentStatus = [
  { value: '1', name: '已发货', key: 'SENDED' },
  { value: '2', name: '未发货', key: 'NO_SEND' },
]
export const SentStatusMap = arrayToMap(SentStatus, 'value')
export const SentStatusKeyMap = arrayToMap(SentStatus, 'key')

// 收货状态，1-已收货，2-未收货
export const ReceiveStatus = [
  { value: '1', name: '已收货', key: 'RECEIVED' },
  { value: '2', name: '未收货', key: 'NO_RECEIVE' },
]
export const ReceiveStatusMap = arrayToMap(ReceiveStatus, 'value')
export const ReceiveStatusKeyMap = arrayToMap(ReceiveStatus, 'key')

// 订单退款状态，0-初始状态，1；退款中，2；退款成功
export const RefundStatus = [
  { value: '0', name: '待审核', key: 'INIT' },
  { value: '1', name: '退款中', key: 'PROCESS' },
  { value: '2', name: '已完成', key: 'SUCCESS' },
  { value: '3', name: '已取消', key: 'CANCEL' },
  { value: '4', name: '未通过', key: 'FAIL' },
]
export const RefundStatusMap = arrayToMap(RefundStatus, 'value')
export const RefundStatusKeyMap = arrayToMap(RefundStatus, 'key')

// 退款类型：目前仅支持1
export const RefundType = [
  { value: '1', name: '仅退款', key: 'MONEY' },
  { value: '2', name: '退货退款', key: 'GOOD_MONEY' },
]
export const RefundTypeMap = arrayToMap(RefundType, 'value')
export const RefundTypeKeyMap = arrayToMap(RefundType, 'key')

// 退款方式
export const RefundGoodFlag = [
  { value: '0', name: '按单退款', key: 'BY_ORDER' },
  { value: '1', name: '商品行退款', key: 'BY_PRODUCT' },
]
export const RefundGoodFlagMap = arrayToMap(RefundGoodFlag, 'value')
export const RefundGoodFlagKeyMap = arrayToMap(RefundGoodFlag, 'key')

// 交易类型，1:款到发货2:货到付款'
export const TransactionType = [
  { value: '1', name: '款到发货', key: 'PAY_BEFORE' },
  { value: '2', name: '货到付款', key: 'PAY_AFTER' },
]
export const TransactionTypeMap = arrayToMap(TransactionType, 'value')
export const TransactionTypeKeyMap = arrayToMap(TransactionType, 'key')

// 提单类型，0: 初始状态 1:自提单,2:外卖单,3:物流单
export const LadingType = [
  { value: '1', name: '自提单', key: 'SELF' },
  { value: '2', name: '外卖单', key: 'TAKE_OUT' },
  { value: '3', name: '物流单', key: 'LOGISTICS' },
  { value: '4', name: '无需配送', key: 'NO_LOGISTICS' },
]
export const LadingTypeMap = arrayToMap(LadingType, 'value')
export const LadingTypeKeyMap = arrayToMap(LadingType, 'key')

// 模板启用状态
export const TemplateStatus = [
  { value: '0', name: '未启用', key: 'OFF' },
  { value: '1', name: '启用', key: 'ON' },
]
export const TemplateStatusMap = arrayToMap(TemplateStatus, 'value')
export const TemplateStatusKeyMap = arrayToMap(TemplateStatus, 'key')

export const AlignCenter = {
  align: 'center'
}

export const ServiceName = [
  { value: '0', name: 'diyige' },
  { value: '1', name: 'dierge' }
]

// 订单类型
export const OrderType = [
  { value: '1', name: '商品订单', key: 'COMMODITY_ORDER' },
  { value: '2', name: '虚拟商品', key: 'VIRTUAL_COMMODITY' },
  { value: '3', name: '充值订单', key: 'RECHANGE_ORDER' },
  { value: '4', name: '付款订单', key: 'PAYMENT_ORDER' },
]

// Pin码
export const PinCode = [
  { value: '1', name: '逸健康（01）', key: 'TY012018051101' },
  { value: '2', name: '逸健康（02）', key: 'TY012018051102' },
  { value: '3', name: 'J-coffee（01）', key: 'SC012018051101' },
  { value: '4', name: '无人货架（02）', key: 'SC022018051101' },
  { value: '5', name: '慈善（01）', key: 'CS012018051101' },
  { value: '', name: '全部', key: '' },
]

export const PinCodeMap = arrayToMap(PinCode, 'key')

// B端订单外部状态显示
export const OrderShowStatus = {
  // 默认业务
  default: {
    // 订单内部状态-支付状态-退款状态
    '0_1_0': '待付款',
    '2_1_0': '交易关闭',
    '1_3_0': '交易完成',
    '1_3_1': '交易完成-退款中',
    '1_3_2': '交易完成-已退款'
  }
}

// 慈善机构编码：用于判断特殊业务（此处为硬编码，注意线上慈善机构编码）
export const CS_ORG_TYPE = '48d77964cc4345b3b3e051ef682925df'
// 慈善机构订单模板Pin码：此处为硬编码
export const CS_PIN_CODE = 'CS012018051101'
