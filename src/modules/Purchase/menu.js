import * as urls from 'Global/urls'
import { MenuHelper } from 'Utils/helper'

const { genMenu, Buttons, CRUDButtons } = MenuHelper

export default genMenu('采购模块', urls.SUPPLY_CHAIN_PURCHASE_MODULE, null, 'bank', [
  genMenu('货物管理', urls.SUPPLY_GOODS, null, 'profile', [
    genMenu('货物分类', urls.SUPPLY_GOODS_CLASSIFY, CRUDButtons, 'share-alt'),
    genMenu('货物规格', urls.SUPPLY_GOODS_SPEC, CRUDButtons, 'api'),
    genMenu('货物中心', urls.SUPPLY_GOODS_CENTER, [...CRUDButtons, Buttons.EXPORT(), Buttons.DEFINE('editSpec', '修改规格')], 'trademark'),
    genMenu('配方设置', urls.SUPPLY_GOODS_FORMULA, [Buttons.ADD('绑定'), Buttons.EDIT(), Buttons.CHECK()], 'coffee'),
  ]),

  genMenu('采购管理', urls.SUPPLY_PURCHASE, null, 'bank', [
    genMenu('供应商管理', urls.SUPPLY_PURCHASE_PROVIDER, [...CRUDButtons, Buttons.EXPORT()], 'flag'),
    genMenu('采购合同', urls.SUPPLY_PURCHASE_CONTRACT, [...CRUDButtons, Buttons.EXPORT()], 'profile'),
    genMenu('采购计划', urls.SUPPLY_PURCHASE_PLAN, [
      Buttons.ADD('添加货物'), Buttons.DEFINE('setOrder', '生成订单'), Buttons.DELETE(), Buttons.CHECK()
    ], 'form'),
    genMenu('采购订单', urls.SUPPLY_PURCHASE_ORDER, [
      Buttons.DEFINE('confirmPur', '确认采购'), Buttons.DEFINE('confirmFinal', '确认结算'), Buttons.EDIT(), Buttons.DELETE(), Buttons.CHECK()
    ], 'switcher'),
  ]),
])
