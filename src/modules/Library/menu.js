import * as urls from 'Global/urls'

export default {
  menu: '仿佛书屋',
  menuKey: 'library',
  menuIcon: 'api',
  menuUrl: urls.LIBRARY,
  children: [
    {
      menu: '图书荐购',
      menuKey: 'library_recommend',
      menuIcon: 'book',
      menuUrl: urls.LIBRARY_RECOMMEND,
      buttons: [
        {
          name: '查看',
          key: 'check'
        },
      ]
    }
  ]
}
