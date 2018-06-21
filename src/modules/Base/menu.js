import * as urls from 'Global/urls'

export default {
  menu: '基础模块',
  menuKey: 'base_module',
  menuIcon: 'setting',
  menuUrl: 'base_module',
  children: [
    {
      menu: '组织管理',
      menuKey: 'org_manage',
      menuIcon: 'credit-card',
      menuUrl: urls.ORG_MANAGE,
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
        }
      ]
    },
    {
      menu: '菜单管理',
      menuKey: 'menu_manage',
      menuIcon: 'file-text',
      menuUrl: urls.MENU_MANAGE,
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
        }
      ]
    },
    {
      menu: '机构权限',
      menuKey: 'org_authority',
      menuIcon: 'file-add',
      menuUrl: urls.ORG_AUTHORITY,
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
    },
    {
      menu: '数字字典管理',
      menuKey: 'dictionary',
      menuIcon: 'laptop',
      menuUrl: urls.DATADICTIONARY,
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
        }
      ]
    },
    {
      menu: '系统日志管理',
      menuKey: 'system_log',
      menuIcon: 'file',
      menuUrl: urls.SYSLOG,
      buttons: [
        {
          name: '查看',
          key: 'check'
        }
      ]
    }
  ]
}
