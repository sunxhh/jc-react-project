// 假的假的
export const FakeContent = [
  { value: 1, name: '假的假的' },
  { value: 2, name: '假的假的' }
]

// 页面类型
export const PageTypes = {
  NEW: 'NEW',
  EDIT: 'EDIT',
  INFO: 'INFO',
}

// 货物类型
export const GoodsTypes = [
  { value: '', name: '全部' },
  { value: '1', name: '外购商品' },
  { value: '2', name: '自产商品' },
  { value: '3', name: '现制商品' },
  { value: '4', name: '原材料' },
  { value: '5', name: '虚拟商品' },
  { value: '6', name: '卡券商品' },
  { value: '7', name: '其他' },
  { value: '8', name: '组合商品' }
]

// 供应商类别
export const SupplierTypes = [
  { value: '', name: '全部' },
  { value: '1', name: '零食' },
  { value: '2', name: '水果' },
  { value: '3', name: '酒水' },
]

// 库存状态
export const StockStatus = [
  { value: '1', name: '正常库存' },
  { value: '2', name: '低库存' },
  { value: '3', name: '高库存' }
]

// 操作类型
export const OperateTypes = [
  { value: '1', name: '入库' },
  { value: '2', name: '出库' }
]

// 操作状态
export const OperateStatus = [
  { value: '1', name: '未开始' },
  { value: '2', name: '盘点中' },
  { value: '3', name: '已完成' }
]

// 操作状态
export const ConfirmStatus = [
  { value: '0', name: '未确认' },
  { value: '1', name: '已确认' }
]

// 出入库单据类型
export const InOutBillTypes = [
  { value: '0', name: '全部' },
  { value: '1', name: '采购入库' },
  { value: '2', name: '盘点入库' },
  { value: '3', name: '电商退货入库' },
  { value: '4', name: '零售退货入库' },
  { value: '5', name: '调拨入库' },
  { value: '6', name: '自产入库' },
  { value: '7', name: '盘点出库' },
  { value: '8', name: '电商销售出库' },
  { value: '9', name: '零售销售出库' },
  { value: '10', name: '调拨出库' },
  { value: '11', name: '采购退货' },
  { value: '12', name: '不良出库' },
  { value: '13', name: '报废出库' },
  { value: '14', name: '过期出库' },
  { value: '15', name: 'OA出库' },
]

export const InOutBillTypesByCreate = [
  { value: '6', name: '自产入库' },
  { value: '12', name: '不良出库' },
  { value: '13', name: '报废出库' },
  { value: '14', name: '过期出库' },
  { value: '15', name: 'OA出库' },
]

// 盘点类型
export const InventoryTypes = [
  { value: '0', name: '全部' },
  { value: '1', name: '按仓库' },
  { value: '2', name: '按库区' },
  { value: '3', name: '按分类' },
  { value: '4', name: '按单品' }
]

// 盘点操作状态
export const InventoryStatus = [
  { value: '1', name: '未开始' },
  { value: '2', name: '盘点中' },
  { value: '3', name: '已完成' }
]

// 盘点少货差异处理状态
export const DifferenceStatus = [
  { value: '0', name: '未处理' },
  { value: '1', name: '处理中' },
  { value: '2', name: '已处理' }
]

// 预警类型
export const ThresholdTypes = [
  { value: '0', name: '默认' },
  { value: '1', name: '自定义' }
]
