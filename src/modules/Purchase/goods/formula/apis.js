const apis = {
  common: {
    selectList: '/api/supplychain/common/selectList/v1'
  },
  goods: {
    formula: {
      goodsSelect: '/api/supplychain/cargo/goods/sku/listforchose/v1',
      list: '/api/supplychain/cargo/formula/list/v1',
      info: '/api/supplychain/cargo/formula/detail/v1',
      bound: '/api/supplychain/cargo/formula/bind/v1',
    }
  }
}

export default apis
