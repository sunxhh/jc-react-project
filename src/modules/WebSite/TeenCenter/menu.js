import * as urls from 'Global/urls'

export default {
  menu: '青少年素能中心',
  menuKey: 'teen',
  menuIcon: 'bulb',
  menuUrl: urls.TEENCENTER,
  children: [
    {
      menu: '预约管理',
      menuKey: 'book',
      menuIcon: 'layout',
      menuUrl: urls.BOOK_MANAGE,
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
      menu: '课程管理',
      menuKey: 'teen_course',
      menuIcon: 'table',
      menuUrl: 'class_classify',
      children: [
        {
          menu: '分类管理',
          menuKey: 'teen_classify',
          menuIcon: 'pie-chart',
          menuUrl: urls.CLASSIFY_MANAGE,
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
            key: 'modify'
          }]
        },
        {
          menu: '课程详情',
          menuKey: 'class_detail',
          menuIcon: 'book',
          menuUrl: urls.CLASS_DETAIL,
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
            key: 'modify'
          }]
        }
      ]
    },
    {
      menu: '教师管理',
      menuKey: 'teacher',
      menuIcon: 'team',
      menuUrl: urls.TEACHER_MANAGE,
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
