const apis = {
  template: {
    list: '/api/order/web/template/list/v1',
    detail: '/api/order/web/template/detail/v1',
    add: '/api/order/web/template/add/v1',
    delete: '/api/order/web/template/delete/v1',
    update: '/api/order/web/template/update/v1',
    activate: '/api/order/web/template/activate/v1'
  },
  order: {
    list: '/api/order/web/orderQueryList/v1',
    detail: '/api/order/web/orderDetail/v1'
  },
  refund: {
    list: '/api/order/web/refundList/v1',
    detail: '/api/order/web/refundDetail/v1',
    updateStatus: '/api/order/web/refundCheck/v1',
    add: '/api/order/web/refundApply/v1'
  },
  dictionary: {
    dictionary: '/api/order/common/codeList/v1', // 订单类型(orderType)、提单类型(ladingType)、Ping码(pinCode)、订单状态(orderStatus)、退款状态(refundStatus)
    orgList: '/api/sys/org/list', // 获取机构列表
    myOrgList: '/api/sys/org/myList', // 获取授权的机构列表
    productTypeList: 'api/order/common/businessTypeList/v1' // 获取商品类型类别，二级数据
  }
}

export default apis
