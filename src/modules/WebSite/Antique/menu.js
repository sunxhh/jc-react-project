import * as urls from 'Global/urls'

export default {
  menu: '古玩城',
  menuKey: 'antique_site',
  menuIcon: 'bulb',
  menuUrl: urls.ANTIQUE,
  children: [
    {
      menu: '预约管理',
      menuKey: 'book',
      menuIcon: 'layout',
      menuUrl: urls.ANTIQUE_BOOK,
      buttons: [{
        name: '导出表格',
        key: 'export'
      },
      {
        name: '查看',
        key: 'check'
      },
      {
        name: '立即处理',
        key: 'handle'
      }]
    },
    {
      menu: '名家管理',
      menuKey: 'famous',
      menuIcon: 'team',
      menuUrl: urls.ANTIQUE_FAMOUS,
      buttons: [{
        name: '新增',
        key: 'add'
      },
      {
        name: '删除',
        key: 'delete'
      },
      {
        name: '修改',
        key: 'edit'
      }]
    },
  ]
}
