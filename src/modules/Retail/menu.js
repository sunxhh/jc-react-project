import * as urls from 'Global/urls'

export default {
  menu: '零售模块',
  menuKey: 'retail',
  menuIcon: 'shop',
  menuUrl: urls.RETAIL,
  children: [
    {
      menu: '商品管理',
      menuKey: 'goods-manage',
      menuIcon: 'barcode',
      menuUrl: 'goods-manage',
      children: [
        {
          menu: '商品中心',
          menuKey: 'goods',
          menuIcon: 'schedule',
          menuUrl: urls.RETAIL_GOODS,
          buttons: [
            {
              name: '新增',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '导出',
              key: 'export'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '分类管理',
          menuKey: 'category',
          menuIcon: 'schedule',
          menuUrl: urls.RETAIL_CATEGORY,
          buttons: [
            {
              name: '新增分类',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '删除',
              key: 'delete'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '门店商品',
          menuKey: 'store-goods',
          menuIcon: 'schedule',
          menuUrl: urls.RETAIL_STORE_GOODS,
          buttons: [
            {
              name: '添加商品',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '删除',
              key: 'delete'
            },
            {
              name: '下架',
              key: 'shelves'
            },
            {
              name: '调整顺序',
              key: 'sort'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '品牌价格',
          menuKey: 'goods-price',
          menuIcon: 'pay-circle-o',
          menuUrl: urls.RETAIL_BRAND_PRICE,
          buttons: [
            {
              name: '导出',
              key: 'export'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '差异价格',
          menuKey: 'selling-price',
          menuIcon: 'pay-circle-o',
          menuUrl: urls.RETAIL_SELLING_PRICE,
          buttons: [
            {
              name: '添加商品',
              key: 'add'
            },
            {
              name: '删除',
              key: 'delete'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '类别显示',
          menuKey: 'store-goods-cate',
          menuIcon: 'tag-o',
          menuUrl: urls.RETAIL_GOODS_CATE,
          buttons: [
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        }
      ]
    },
    {
      menu: '订单管理',
      menuKey: 'order-manage',
      menuIcon: 'bar-chart',
      menuUrl: 'order-manage',
      children: [
        {
          menu: '零售订单',
          menuKey: 'order',
          menuIcon: 'profile',
          menuUrl: urls.RETAIL_ORDER,
          buttons: [
            {
              name: '导出',
              key: 'export'
            },
            {
              name: '申请退款',
              key: 'refund'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '关帐单据',
          menuKey: 'closeBill',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_BILL,
          buttons: [
            {
              name: '查看',
              key: 'check'
            }
          ]
        }
      ]
    },
    {
      menu: '库存管理',
      menuKey: 'stock',
      menuIcon: 'layout',
      menuUrl: 'stock',
      children: [
        {
          menu: '库存查询',
          menuKey: 'list',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_STOCK_LIST,
          buttons: [
            {
              name: '库存分布',
              key: 'stockDistribute'
            }
          ]
        },
        {
          menu: '库存盘点',
          menuKey: 'inventory',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_STOCK_INVENTORY,
          buttons: [
            {
              name: '创建',
              key: 'stockInventoryCreate'
            },
            {
              name: '打印',
              key: 'stockInventoryPrint'
            },
            {
              name: '录入',
              key: 'stockInventoryRecord'
            },
            {
              name: '删除',
              key: 'stockInventoryDel',
            }
          ]
        },
        {
          menu: '报损报溢',
          menuKey: 'lossOverflow',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_STOCK_LOSS_OVERFLOW,
          buttons: [
            {
              name: '打印',
              key: 'stockLossOverflowPrint'
            },
            {
              name: '导出',
              key: 'stockLossOverflowExport',
            },
            {
              name: '导出详情',
              key: 'stockLossOverflowDetailExport'
            },
          ]
        }
      ]
    },
    {
      menu: '报表管理',
      menuKey: 'report-manage',
      menuIcon: 'line-chart',
      menuUrl: 'report-manage',
      children: [
        {
          menu: '销售时间带分析',
          menuKey: 'saleTimeLine',
          menuIcon: 'dot-chart',
          menuUrl: urls.RETAIL_REPORT_TIME,
          buttons: [
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '销售明细表',
          menuKey: 'saleDetail',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_SALE_DETAIL,
          buttons: [
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '销量排行表',
          menuKey: 'saleRank',
          menuIcon: 'line-chart',
          menuUrl: urls.RETAIL_SALE_RANK,
          buttons: [
            {
              name: '导出',
              key: 'export'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        }
      ]
    },
    {
      menu: '货架管理',
      menuKey: 'shelf-manage',
      menuIcon: 'layout',
      menuUrl: 'shelf-manage',
      children: [
        {
          menu: '货架列表',
          menuKey: 'shelfList',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_SHELF_LIST,
          buttons: [
            {
              name: '新增',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '删除',
              key: 'delete'
            },
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '商品配置',
              key: 'set'
            }
          ]
        },
        {
          menu: '货架监控',
          menuKey: 'shelfMonitor',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_SHELF_MONITOR,
          buttons: [
            {
              name: '生成补货单',
              key: 'add'
            }
          ]
        },
        {
          menu: '预警设置',
          menuKey: 'shelfWarn',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_SHELF_WARN,
          buttons: [
            {
              name: '保存',
              key: 'add'
            }
          ]
        },
        {
          menu: '补货单',
          menuKey: 'shelfReple',
          menuIcon: 'file-text',
          menuUrl: urls.RETAIL_SHELF_REPLE,
          buttons: [
            {
              name: '补货录入',
              key: 'add'
            },
            {
              name: '打印',
              key: 'print'
            },
            {
              name: '删除',
              key: 'delete'
            },
          ]
        }

      ]
    }
  ]
}
