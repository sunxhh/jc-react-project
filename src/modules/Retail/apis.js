const apis = {
  qiniuToken: '/api/sys/file/uptoken',
  categoryList: '/api/retail/admin/goodsControl/goodsCentre/categoryList',
  goodsTypeList: '/api/retail/admin/goodsControl/goodsCentre/goodsTypeList',
  goods: {
    list: '/api/retail/admin/goodsControl/goodsCentre/list',
    add: '/api/retail/admin/goodsControl/goodsCentre/add',
    modify: '/api/retail/admin/goodsControl/goodsCentre/modify',
    detail: '/api/retail/admin/goodsControl/goodsCentre/detail',
    export: '/api/retail/admin/goodsControl/goodsCentre/export',
    categoryList: '/api/retail/admin/goodsControl/goodsCentre/categoryList',
    goodsTypeList: '/api/retail/admin/goodsControl/goodsCentre/goodsTypeList',
  },
  stock: {
    chainStockList: '/api/retail/chain/stock/search',
    chainStockShelfDistribute: '/api/retail/chain/stock/sublist',
    list: '/api/retail/store/stock/search', // 库存查询
    shelfDistribute: '/api/retail/store/stock/shelfs', // 库存分布
    stockBySku: '/api/retail/store/stock/getBySku', // 查询物品库存
    inventoryList: '/api/retail/store/inventory/search', // 库存盘点列表
    inventoryDetail: '/api/retail/store/inventory/getByNo', // 盘点单详情
    shelfList: '/api/retail/admin/store/shelf/listAll', // 货架列表
    inventoryCreate: '/api/retail/store/inventory/create', // 创建库存盘点
    inventoryIn: '/api/retail/store/inventory/info', // 盘点录入详情
    inventorySave: '/api/retail/store/inventory/save', // 盘点录入保存
    inventoryCheck: '/api/retail/store/inventory/check', // 盘点录入检查
    inventoryDelete: '/api/retail/store/inventory/delete', // 盘点单删除
    inventoryFinish: '/api/retail/store/inventory/finish', // 盘点录入完成
    inventoryLossOverflowSearch: '/api/retail/store/inventory/lossOverflow/search', // 报损报溢列表
    inventoryLossOverflowExport: '/retail/store/inventory/lossOverflow/export', // 报损报溢导出
    inventoryLossOverflowIn: '/api/retail/store/inventory/lossOverflow/getByUuid', // 报损报溢详情
  },
  storeGoods: {
    list: '/api/retail/admin/goodsControl/storeGoods/list',
    add: '/api/retail/admin/goodsControl/storeGoods/add',
    detail: '/api/retail/admin/goodsControl/storeGoods/detail',
    shelves: '/api/retail/admin/goodsControl/storeGoods/shelves',
    del: '/api/retail/admin/goodsControl/storeGoods/del',
    sort: '/api/retail/admin/goodsControl/storeGoods/sort',
    addQuery: '/api/retail/admin/goodsControl/storeGoods/addQuery',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
    edit: '/api/retail/admin/goodsControl/storeGoods/edit',
    channelsList: '/api/retail/admin/goodsControl/goodsCentre/channelList',
    channels: '/api/retail/admin/goodsControl/storeGoods/channels',
    category: '/api/retail/admin/goodsControl/goodsCentre/categoryList',
    querySaleUnitList: '/api/retail/admin/goodsControl/storeGoods/querySaleUnitList',
    queryShopGoodsInfo: '/api/retail/admin/goodsControl/storeGoods/queryShopGoodsInfo',
  },
  category: {
    queryFrontCategory: '/api/retail/store/category/queryFrontCategory',
    queryNoAddCategory: '/api/retail/store/category/queryNoAddCategory',
    chainList: '/api/retail/chain/category/list',
    chainAdd: '/api/retail/chain/category/add',
    chainEdit: '/api/retail/chain/category/edit',
    storeList: '/api/retail/store/category/list',
    modify: '/api/retail/store/category/modif',
    sort: '/api/retail/store/category/sort',

  },
  goodsPrice: {
    list: '/api/retail/admin/goodsPrice/brandPrice/list',
    modify: '/api/retail/admin/goodsPrice/brandPrice/modify',
    export: '/api/retail/admin/goodsPrice/brandPrice/export',
  },
  sellingPrice: {
    list: '/api/retail/admin/goodsPrice/sellingPrice/list',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
    modify: '/api/retail/admin/goodsPrice/sellingPrice/modify',
    delete: '/api/retail/admin/goodsPrice/sellingPrice/delete',
    goodsList: '/api/retail/admin/goodsControl/storeGoods/list',
    add: '/api/retail/admin/goodsPrice/sellingPrice/add',
  },
  orderList: {
    list: '/api/retail/admin/orderControl/order/list',
    detail: '/api/retail/admin/orderControl/order/detail',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
    refund: '/api/retail/admin/orderControl/order/refund'
  },
  closeBill: {
    list: '/api/retail/admin/orderControl/orderReceipt/list',
    orderList: '/api/retail/admin/orderControl/order/list',
    orderDetail: '/api/retail/admin/orderControl/order/detail',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
  },
  goodsCate: {
    list: '/api/retail/admin/classification/query',
    sort: '/api/retail/admin/classification/modify',
    choose: '/api/retail/admin/classification/chose',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
  },
  report: {
    saleTimeLine: '/api/retail/admin/report/saleTimeLine',
    saleDetail: '/api/retail/admin/report/saleDetail',
    goods: '/api/retail/admin/report/saleRank/goods',
    category: '/api/retail/admin/report/saleRank/category',
    exportByGoods: '/api/retail/admin/report/saleRank/exportByGoods',
    shopList: '/api/retail/admin/goodsControl/storeGoods/orgList',
    exportByCategory: '/api/retail/admin/report/saleRank/exportByCategory',
  },
  shelfList: {
    list: 'api/retail/admin/store/shelf/list',
    listAll: 'api/retail/admin/store/shelf/listAll',
    detail: 'api/retail/admin/store/shelfInventory/list',
    shelfDelete: 'api/retail/admin/store/shelf/delete',
    shelfGoodsDelete: 'api/retail/admin/store/shelfInventory/delete',
    addShelf: 'api/retail/admin/store/shelf/add',
    modifyShelf: 'api/retail/admin/store/shelf/modify',
    setGoods: 'api/retail/admin/store/shelfInventory/list',
    addeGoods: 'api/retail/admin/store/shelfInventory/add',
    addQuery: 'api/retail/admin/store/shelfInventory/addQuery'
  },
  shelfMonitor: {
    list: 'api/retail/admin/store/shelf/monitor',
    addReples: 'api/retail/admin/store/replenishment/batchSave',
  },
  shelfWarn: {
    list: 'api/retail/store/warning/search',
    save: 'api/retail/store/warning/save',
  },
  replenishment: {
    list: 'api/retail/admin/store/replenishment/list',
    delete: 'api/retail/admin/store/replenishment/delete',
    detail: 'api/retail/admin/store/replenishment/view',
    add: 'api/retail/admin/store/replenishment/detail',
    save: 'api/retail/admin/store/replenishment/save',
    finish: 'api/retail/admin/store/replenishment/save',
    print: 'api/retail/admin/store/replenishment/printView',
  }
}

export default apis
