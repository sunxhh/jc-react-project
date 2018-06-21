import * as urls from 'Global/urls'
import { MenuHelper } from 'Utils/helper'

const { genMenu, Buttons, CRUDButtons } = MenuHelper

export default genMenu('供应链模块', urls.SUPPLY_CHAIN_MODULE, null, 'paper-clip', [
  genMenu('订单管理', urls.SUPPLY_ORDER, null, 'form', [
    genMenu('业务订单', urls.SUPPLY_ORDER_EORDER, [
      Buttons.CHECK(), Buttons.DEFINE('creatOrder', '生成分拣单'), Buttons.DEFINE('concatOrder', '合单分拣')
    ], 'file-word'),
    genMenu('调拨订单', urls.SUPPLY_CATE_ORDER, [
      Buttons.ADD('创建'), Buttons.EDIT(), Buttons.DELETE(), Buttons.CHECK(), Buttons.DEFINE('setOrder', '生成分拣单')]
      , 'file-excel'),
    genMenu('店铺仓库绑定', urls.SUPPLY_BIND_SHOP, [Buttons.SAVE(), Buttons.DEFINE('add', '新增'), Buttons.DEFINE('delete', '删除')], 'bulb'),
    genMenu('仓库城市绑定', urls.SUPPLY_BIND_CITY, [Buttons.SAVE()], 'environment-o'),
  ]),

  genMenu('仓库管理', urls.SUPPLY_DEPOT, null, 'trademark', [
    genMenu('库存管理', urls.SUPPLY_STOCK_MANAGE, null, 'database', [
      genMenu('库存查询', urls.SUPPLY_STOCK_CHECK, [Buttons.CHECK(), Buttons.EXPORT()], 'question-circle-o'),
      genMenu('库存操作', urls.SUPPLY_STOCK_OPERATE, [
        Buttons.CHECK(), Buttons.DEFINE('inbound', '自产入库'), Buttons.DEFINE('outbound', '创建出库'), Buttons.DEFINE('inboundEdit', '入库编辑'),
        Buttons.DEFINE('inboundDelete', '入库删除'), Buttons.DEFINE('inboundConfirm', '入库确认'), Buttons.DEFINE('return', '采购退货'),
        Buttons.DEFINE('outboundConfirm', '出库确认'), Buttons.DEFINE('outboundEdit', '出库编辑'),
      ], 'edit'),
      genMenu('操作记录', urls.SUPPLY_STOCK_RECORD, [Buttons.CHECK(), Buttons.EXPORT()], 'profile'),
      genMenu('库存盘点', urls.SUPPLY_STOCK_INVENTORY, [
        Buttons.CHECK(), Buttons.ADD('创建'), Buttons.DEFINE('begin', '开始盘点'), Buttons.DEFINE('continue', '继续盘点'), Buttons.DELETE()
      ], 'tags-o'),
      genMenu('盘点少货差异', urls.SUPPLY_STOCK_DIFFERENCE, [
        Buttons.CHECK(), Buttons.DEFINE('begin', '开始处理'), Buttons.DEFINE('continue', '继续处理')
      ], 'minus-circle-o'),
      genMenu('预警设置', urls.SUPPLY_STOCK_THRESHOLD, [
        Buttons.CHECK(), Buttons.SAVE(), Buttons.CANCEL(), Buttons.DEFINE('selfSet', '自定义'), Buttons.DEFINE('default', '使用默认'), Buttons.EDIT()
      ], 'warning'),
    ]),
    genMenu('分拣单管理', urls.SUPPLY_SORT_MANAGE, [
      Buttons.CHECK(), Buttons.DEFINE('begin', '开始分拣'), Buttons.DEFINE('continue', '继续分拣'), Buttons.EDIT('修改运单号'), Buttons.ADD('添加运单号')
    ], 'scan'),
    // genMenu('分拣单管理（物流）', urls.SUPPLY_SORTLOGISTICS_MANAGE, [
    //   Buttons.CHECK(), Buttons.DEFINE('begin', '开始分拣'), Buttons.DEFINE('continue', '继续分拣'), Buttons.EDIT('修改运单号'), Buttons.ADD('添加运单号'), Buttons.DEFINE('a4print', 'A4打印'), Buttons.DEFINE('logprint', '运单打印')
    // ]),
    genMenu('仓库货物', urls.SUPPLY_DEPOT_GOODS, [
      Buttons.CHECK(), Buttons.ADD('添加货物'), Buttons.DELETE(), Buttons.PRINT('打印条形码')
    ], 'exception'),
    genMenu('库区设置', urls.SUPPLY_DEPOT_RESERVOIR, CRUDButtons, 'rocket'),
    genMenu('库位设置', urls.SUPPLY_DEPOT_LIBRARY, CRUDButtons, 'environment'),
    genMenu('保质期监控', urls.SUPPLY_DEPOT_WATCH, [Buttons.CHECK(), Buttons.EXPORT()], 'schedule'),
  ]),

  genMenu('报表管理', urls.SUPPLY_REPORT, null, 'pie-chart', [
    genMenu('移动加权成本', urls.SUPPLY_REPORT_COST, [Buttons.EXPORT()], 'paper-clip'),
  ]),
  genMenu('物流管理', urls.SUPPLY_LOGISTICS, null, 'car', [
    genMenu('店铺物流绑定', urls.SUPPLY_LOGISTICS_SHOP, [Buttons.EXPORT()], 'barcode'),
    genMenu('运单查询', urls.SUPPLY_LOGISTICS_WAYBILL_DETAIL, [Buttons.CHECK()], 'eye-o'),
  ]),
  genMenu('导入管理', urls.SUPPLY_IMPORT, null, 'upload', [
    genMenu('导入操作', urls.SUPPLY_IMPORT_OPERATE, [
      Buttons.DEFINE('goodsTemplate', '货物导入模板下载'),
      Buttons.DEFINE('purchaseTemplate', '采购计划导入模板下载'),
      Buttons.DEFINE('goodsImport', '货物导入'),
      Buttons.DEFINE('purchaseImport', '采购计划导入'),
    ]),
  ]),
])
