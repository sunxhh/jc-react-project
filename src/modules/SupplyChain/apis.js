const apis = {
  common: {
    goodsList: 'api/supplychain/cargo/goods/sku/listforchose/v1', // 添加货物
    codeList: '/api/supplychain/common/codeList/v1',
    selectList: '/api/supplychain/common/selectList/v1',
    warehouseList: '/api/supplychain/warehouse/list/v1',
    goodscatgList: 'api/supplychain/cargo/goodscatg/list/v1',
    stockOrgList: '/api/sys/org/stockOrgList',
    printIp: '/api/supplychain/common/printServers/v1', // 获取打印机ip地址
    listForChoose: '/api/supplychain/cargo/goods/sku/listforchose/v1', // 货物列表弹框选择
  },
  order: {
    queryEorderList: '/api/supplychain/order/list/v1', // 订单列表查询
    queryEorderDetail: '/api/supplychain/order/detail/v1', // 业务订单详情
    shopList: '/api/supplychain/shop/list/v1', // 店铺列表(电商)
    sortorder: '/api/supplychain/sortorder/create/v1', // 分拣单生成
    allocation: '/api/supplychain/allocation/create/v1', // 调拨订单生成
    allocationList: '/api/supplychain/allocation/list/v1', // 调拨订单列表
    allocationDel: '/api/supplychain/allocation/delete/v1', // 调拨订单删除
    allocationDetail: '/api/supplychain/allocation/detail/v1', // 调拨订单详情
    allocationModify: '/api/supplychain/allocation/modify/v1', // 调拨订单编辑
    allocationCreate: '/api/supplychain/allocation/goods/v1/create', // 调拨单货物保存
    getStockGoods: '/api/supplychain/stock/getStockGoods/v1', // 调拨单创建添加货物
    supplyShopList: '/api/supplychain/shop/list/v1', // 供应链店铺列表
    supplyCreateShop: '/api/supplychain/business/shop/list/v1', // 电商店铺选择列表
    saveShop: '/api/supplychain/shop/create/v1', // 电商店铺选择保存
    delShop: '/api/supplychain/shop/delete/v1', // 电商店铺删除
    getShopWareHouse: '/api/supplychain/shop/warehouse/list/v1', // 获取店铺仓库
    // wareHouseList: '/api/supplychain/warehouse/list/v1', // 供应链仓库列表
    bindShopHouse: '/api/supplychain/shop/warehouse/bind/v1', // 店铺绑定仓库
    getWareHouseList: '/api/supplychain/warehouse/list/v1', // 获取仓库列表
    refurbishWareHouseList: '/api/supplychain/warehouse/refurbish/v1', // 仓库刷新
    wareHouseCity: '/api/supplychain/warehouse/city/list/v1', // 获取仓库城市列表
    wareHouseBindCity: '/api/supplychain/warehouse/city/bind/v1', // 获取仓库城市列表
  },
  depot: {
    stock: {
      check: '/api/supplychain/stock/stockSearch/v1',
      operate: 'api/supplychain/stock/list/v1',
      operateConfirm: '/api/supplychain/stock/confirmInOutBount/v1',
      operateDelete: '/api/supplychain/stock/deleteInOutBount/v1',
      createInbound: '/api/supplychain/stock/createInbound/v1',
      editInbound: '/api/supplychain/stock/editInbound/v1',
      inboundInfo: '/api/supplychain/stock/inboundInfo/v1',
      returnBound: '/api/supplychain/stock/returns/v1',
      createOutbound: '/api/supplychain/stock/createOutbound/v1',
      editOutbound: '/api/supplychain/stock/editOutbound/v1',
      outbountInfo: '/api/supplychain/stock/outbountInfo/v1',
      record: '/api/supplychain/stock/operateLog/v1',
      goods: 'api/supplychain/stock/getStockGoods/v1',
      inventory: '/api/supplychain/inventory/list/v1',
      createInventory: '/api/supplychain/inventory/createInventory/v1',
      inventoryDone: '/api/supplychain/inventory/doInventory/v1',
      inventoryDetail: '/api/supplychain/inventory/detail/v1',
      inventoryDelete: '/api/supplychain/inventory/delete/v1',
      difference: '/api/supplychain/inventory/diffList/v1',
      differenceDone: '/api/supplychain/inventory/doDiff/v1',
      differenceInfo: '/api/supplychain/inventory/diffDetail/v1',
      threshold: '/api/supplychain/stock/threshold/list/v1',
      thresholdUpdate: '/api/supplychain/stock/threshold/setThreshold/v1',
      thresholdUpdateDefault: '/api/supplychain/stock/threshold/setDefault/v1',
      thresholdDefault: '/api/supplychain/stock/threshold/getDefaultThreshold/v1',
      thresholdDefaultSet: '/api/supplychain/stock/threshold/setDefaultThreshold/v1',
      inventoryPrint: '/api/printer/inventory', // 盘点打印
      inventoryList: '/api/supplychain/inventory/print/v1', // 盘点打印详情
      inboundPrintInfo: '/api/supplychain/stock/inbound/receiptOrderInfo/v1',
    },
    watch: {
      watchList: '/api/supplychain/warehouse/periodmonitor/queryWhPeriodMonitorListByPager/v1'
    },
    houseArea: {
      areaList: '/api/supplychain/housearea/list/v1',
      delete: '/api/supplychain/housearea/delete/v1',
      add: '/api/supplychain/housearea/create/v1',
      detail: '/api/supplychain/housearea/detail/v1',
      modify: '/api/supplychain/housearea/update/v1',
      goodscatg: '/api/supplychain/cargo/goodscatg/list/v1',
      listByWarehouse: '/api/supplychain/housearea/listByWarehouse/v1'
    },
    depotGoods: {
      goodsList: '/api/supplychain/warehouse/goods/listWhGoods/v1',
      delete: '/api/supplychain/warehouse/goods/deleteWhGoods/v1',
      add: '/api/supplychain/warehouse/goods/addWhGoods/v1',
      detail: '/api/supplychain/cargo/goods/detail/v1',
      listGoodsCatg: '/api/supplychain/warehouse/goods/listGoodsCatg/v1',
    },
    sort: {
      sortList: '/api/supplychain/sortorder/list/v1',
      add: '/api/supplychain/sortorder/updateLogisOrderId/v1',
      detail: '/api/supplychain/sortorder/detail/v1',
      pick: '/api/supplychain/sortorder/operate/v1',
      printList: '/api/supplychain/sortorder/detailList/v1',
      logisticsCorps: '/api/logistics/common/logisticsCorps/v1',
      waybill: '/api/supplychain/sortorder/waybillCreate/v1',
    },
    library: {
      libraryList: '/api/supplychain/whlib/queryWhlibListByPager/v1',
      libraryAdd: '/api/supplychain/whlib/createWhlib/v1',
      libraryEdit: '/api/supplychain/whlib/updateWhlib/v1',
      libraryDelete: '/api/supplychain/whlib/deleteWhlib/v1',
      libraryBitDetail: '/api/supplychain/whlib/queryWhlibInfo/v1',
      libraryGoodsList: '/api/supplychain/whlib/queryWhLibGoodsListByPositionNo/v1',
    }
  },
  reportCost: {
    skuWeight: '/api/supplychain/report/skuweight/queryReportSkuWeightListByPager/v1', // 报表列表
    selectList: '/api/supplychain/common/selectList/v1', // 货物类别
    goodscatg: '/api/supplychain/cargo/goodscatg/list/v1' // 货物所属分类
  },
  logistics: {
    logisticsCorps: '/api/logistics/common/logisticsCorps/v1', // 物流列表
    bindShopLogistics: '/api/logistics/shop/bindLogisticsCorp/v1', // 店铺物流绑定
    getShopLogistics: '/api/logistics/shop/getLogisticsCorps/v1', // 获取店铺与物流公司绑定关系
    waybill: '/api/logistics/waybill/detail/v1', // 运单查询
    supplyShopList: '/api/supplychain/shop/list/v1', // 供应链店铺列表
  },
  import: {
    importList: '/api/supplychain/import/list/v1',
    importDetail: '/api/supplychain/import/detail/list/v1',
    importProcess: '/api/supplychain/import/process/list/v1'
  }
}

export default apis
