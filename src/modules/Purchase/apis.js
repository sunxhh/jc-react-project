const apis = {
  common: {
    goodsList: 'api/supplychain/cargo/goods/sku/listforchose/v1', // 添加货物
    codeList: '/api/supplychain/common/codeList/v1',
    selectList: '/api/supplychain/common/selectList/v1',
    warehouseList: '/api/supplychain/warehouse/list/v1',
    goodscatgList: 'api/supplychain/cargo/goodscatg/list/v1',
    stockOrgList: '/api/sys/org/stockOrgList',
    printIp: '/api/supplychain/common/printServers/v1', // 获取打印机ip地址
    goodscatg: '/api/supplychain/cargo/goodscatg/list/v1',
  },
  goods: {
    classify: {
      list: '/api/supplychain/cargo/goodscatg/list/v1',
      detail: '/api/supplychain/cargo/goodscatg/detail/v1',
      add: '/api/supplychain/cargo/goodscatg/add/v1',
      delete: '/api/supplychain/cargo/goodscatg/delete/v1',
      update: '/api/supplychain/cargo/goodscatg/update/v1',
    },
    spec: {
      catg: '/api/supplychain/cargo/spec/catg/listall/v1',
      catgAdd: '/api/supplychain/cargo/spec/catg/add/v1',
      catgUpdate: '/api/supplychain/cargo/spec/catg/update/v1',
      catgDelete: '/api/supplychain/cargo/spec/catg/delete/v1',
      detail: '/api/supplychain/cargo/spec/detail/list/v1',
      detailAdd: '/api/supplychain/cargo/spec/detail/add/v1',
      detailUpdate: '/api/supplychain/cargo/spec/detail/update/v1',
      detailDelete: '/api/supplychain/cargo/spec/detail/delete/v1',
    },
    center: {
      list: '/api/supplychain/cargo/goods/sku/list/v2',
      goodsAdd: '/api/supplychain/cargo/goods/add/v1',
      goodsEdit: '/api/supplychain/cargo/goods/update/v1',
      goodsSpecEdit: '/api/supplychain/cargo/goods/skuSpec/update/v1',
      detail: '/api/supplychain/cargo/goods/detail/v1'
    }
  },
  purchase: {
    provider: {
      supplyQueryList: '/api/supplychain/supply/supplyQueryList/v1', // 供应商列表
      delete: '/api/supplychain/supply/deleteSupply/v1', // 删除
      add: '/api/supplychain/supply/addSupply/v1', // 新增
      detail: '/api/supplychain/supply/supplyDetail/v1',
      edit: '/api/supplychain/supply/updateSupply/v1'
    },
    contract: {
      contractList: '/api/supplychain/contract/contractQueryList/v1', // 合同列表
      add: '/api/supplychain/contract/addContract/v1', // add
      listForChoose: '/api/supplychain/cargo/goods/sku/listforchose/v1', // 货物列表弹框选择
      detail: '/api/supplychain/contract/contractDetail/v1', // detail
      edit: '/api/supplychain/contract/updateContract/v1',
      providerList: '/api/supplychain/supply/supplyList/v1',
      contractDetail: '/api/supplychain/contract/contractDetailList/v1', // 列表页合同明细列表
      delete: '/api/supplychain/contract/deleteContractGoods/v1',
      update: '/api/supplychain/contract/updatePurchasePrice/v1',
    },
    order: {
      purhcaseOrderQueryList: '/api/supplychain/purOrder/purhcaseOrderQueryList/v1', // 采购订单
      deletePurchaseOrder: '/api/supplychain/purOrder/deletePurchaseOrder/v1', // 采购订单删除
      purhcaseOrderDetail: '/api/supplychain/purOrder/purhcaseOrderDetail/v1', // 采购订单详情
      inboundInfo: '/api/supplychain/stock/inboundInfo/v1', // 入库单详情
      confirmSettlement: '/api/supplychain/purOrder/confirmSettlement/v1', // 确认结算
      confirmPurchase: '/api/supplychain/purOrder/confirmPurchase/v1', // 确认采购
      exportOrder: '/api/supplychain/purOrder/exportOrderInfo/v1', // 采购订单详情导出
      updatePurchaseOrder: '/api/supplychain/purOrder/updatePurchaseOrder/v1' // 采购订单编辑删除保存
    },
    plan: {
      planList: '/api/supplychain/purPlan/purchasePlanQueryList/v1', // 采购计划
      supplyList: '/api/supplychain/supply/supplyList/v1', // 采购计划供应商
      deletePurchasePlan: '/api/supplychain/purPlan/deletePurchasePlan/v1', // 删除采购计划
      placePurOrder: '/api/supplychain/purPlan/placePurOrder/v1', // 采购订单生成
      getPurchaseGoods: '/api/supplychain/stock/getPurchaseGoods/v1', // 获取添加货物
      addPurchasePlan: '/api/supplychain/purPlan/addPurchasePlan/v1' // 添加采购计划
    },
  },
}

export default apis
