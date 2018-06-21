import * as urls from 'Global/urls'

export default {
  menu: '会员中心',
  menuKey: 'member',
  menuIcon: 'solution',
  menuUrl: urls.INDUSTRY_MEMBER,
  children: [
    {
      menu: '会员管理',
      menuKey: 'member-manage',
      menuIcon: 'layout',
      menuUrl: urls.MEMBER_MANAGE,
      children: [
        {
          menu: '会员列表',
          menuKey: 'member-list',
          menuIcon: 'idcard',
          menuUrl: urls.MEMBER_LIST,
          buttons: [
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '会员录入',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            }
          ]
        },
        {
          menu: '产业字段库',
          menuKey: 'member-custom-fields',
          menuIcon: 'code-o',
          menuUrl: urls.MEMBER_CUSTOM_FIELDS,
          buttons: [
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '新增产业字段',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '删除',
              key: 'del'
            },
            {
              name: '启用',
              key: 'publish'
            },
          ]
        }
      ]
    },
    {
      menu: '积分管理',
      menuKey: 'member-integral',
      menuIcon: 'book',
      menuUrl: urls.MEMBER_INTEGRAL,
      buttons: [
        {
          name: '查看',
          key: 'check'
        },
        {
          name: '设置积分规则',
          key: 'add'
        },
        {
          name: '积分规则删除',
          key: 'delRule'
        },
        {
          name: '积分录入',
          key: 'addPoint'
        },
        {
          name: '积分扣除',
          key: 'delPoint'
        },
      ]
    },
    {
      menu: '会员权益',
      menuKey: 'member-right',
      menuIcon: 'gift',
      menuUrl: urls.MEMBER_RIGHT,
      children: [
        {
          menu: '会员权益',
          menuKey: 'member-right-manage',
          menuIcon: 'gift',
          menuUrl: urls.MEMBER_RIGHT_MANAGE,
          buttons: [
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '添加',
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
              name: '启用',
              key: 'active'
            }
          ]
        },
        {
          menu: '权益库',
          menuKey: 'member-right-library',
          menuIcon: 'profile',
          menuUrl: urls.MEMBER_RIGHT_LIBRARY,
          buttons: [
            {
              name: '查看',
              key: 'check'
            },
            {
              name: '添加权益库内容',
              key: 'add'
            },
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '删除',
              key: 'del'
            },
          ]
        }
      ]
    },
    {
      menu: '会员卡',
      menuKey: 'member-card',
      menuIcon: 'book',
      menuUrl: urls.MEMBER_CARD,
      buttons: [
        {
          name: '查看',
          key: 'check'
        },
        {
          name: '新增',
          key: 'add'
        },
        {
          name: '编辑',
          key: 'edit'
        },
        {
          name: '启用',
          key: 'active'
        },
      ]
    },
  ]
}
