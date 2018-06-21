import * as urls from 'Global/urls'

export default{
  menu: '通用模块',
  menuKey: 'currency_module',
  menuIcon: 'laptop',
  menuUrl: 'currency_module',
  children: [
    {
      menu: '角色管理',
      menuKey: 'role_manage',
      menuIcon: 'team',
      menuUrl: urls.ROLE_MANAGE,
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
      menu: '用户管理',
      menuKey: 'user_manage',
      menuIcon: 'user',
      menuUrl: urls.USER_MANAGE,
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
      menu: '会员管理',
      menuKey: 'member',
      menuIcon: 'usergroup-add',
      menuUrl: urls.MEMBER,
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
      menu: '报名管理',
      menuKey: 'enroll',
      menuIcon: 'solution',
      menuUrl: urls.ENROLL_MANAGE,
      buttons: [
        {
          name: '补送积分',
          key: 'repair'
        },
        {
          name: '扣除积分',
          key: 'deduct'
        },
        {
          name: '审核',
          key: 'audit'
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
      menu: '首页banner管理',
      menuKey: 'banner',
      menuIcon: 'picture',
      menuUrl: urls.BANNER_MANAGE,
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
          name: '下架',
          key: 'down'
        },
        {
          name: '查看',
          key: 'check'
        }
      ]
    },
    {
      menu: '资讯中心',
      menuKey: 'consult',
      menuIcon: 'file-text',
      menuUrl: 'consult_center',
      children: [
        {
          menu: '频道管理',
          menuKey: 'channel',
          menuIcon: 'layout',
          menuUrl: urls.CHANNEL_MANAGE,
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
          },
          {
            name: '查看',
            key: 'check'
          }]
        },
        {
          menu: '资讯管理',
          menuKey: 'consultKey',
          menuIcon: 'layout',
          menuUrl: urls.CONSULT_MANAGE,
          buttons: [
            {
              name: '新增',
              key: 'add'
            },
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '发布',
              key: 'publish'
            },
            {
              name: '置顶',
              key: 'stick'
            },
            {
              name: '删除',
              key: 'delete'
            },
            {
              name: '修改',
              key: 'edit'
            },
            {
              name: '下架',
              key: 'under'
            }
          ]
        }
      ]
    },
    {
      menu: '活动中心',
      menuKey: 'activity',
      menuIcon: 'sound',
      menuUrl: urls.ACTIVITY_CENTER,
      buttons: [
        {
          name: '新增',
          key: 'add'
        },
        {
          name: '修改',
          key: 'edit'
        },
        {
          name: '下架',
          key: 'down'
        },
        {
          name: '查看',
          key: 'check'
        },
      ]
    },
  ]
}
