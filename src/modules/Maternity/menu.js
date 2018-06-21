import * as urls from 'Global/urls'

export default {
  menu: '月子中心',
  menuKey: 'maternity_hotels',
  menuIcon: 'medicine-box',
  menuUrl: 'maternity_hotels',
  children: [
    {
      menu: '会员等级',
      menuKey: 'grade',
      menuIcon: 'layout',
      menuUrl: 'grade',
      children: [
        {
          menu: '等级管理',
          menuKey: 'grade_manage',
          menuIcon: 'solution',
          menuUrl: urls.MATER_GRADE_MANAGE,
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
        }
      ]
    },
    {
      menu: '客户关系',
      menuKey: 'mater_customer',
      menuIcon: 'link',
      menuUrl: 'mater_customer',
      children: [
        {
          menu: '客户管理',
          menuKey: 'mater_customer_manage',
          menuIcon: 'heart-o',
          menuUrl: urls.MATER_CUSTOMER_MANAGE,
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
              name: '置为无效',
              key: 'invalid'
            },
            {
              name: '跟进情况',
              key: 'follow'
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
      menu: '护士站',
      menuKey: 'nurse',
      menuIcon: 'usergroup-add',
      menuUrl: 'nurse',
      children: [
        {
          menu: '值班安排',
          menuKey: 'schedule_manage',
          menuIcon: 'calendar',
          menuUrl: urls.MATER_SCHEDULE_MANAGE,
          buttons: [
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '班次管理',
          menuKey: 'batch_manage',
          menuIcon: 'table',
          menuUrl: urls.MATER_BATCH_MANAGE,
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
              name: '置为无效',
              key: 'invalid'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '当值人员',
          menuKey: 'duty_manage',
          menuIcon: 'woman',
          menuUrl: urls.MATER_DUTY_MANAGE,
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
              name: '增加服务',
              key: 'service'
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
        }
      ]
    },
    {
      menu: '房态信息',
      menuKey: 'mater_room',
      menuIcon: 'home',
      menuUrl: 'mater_room',
      children: [
        {
          menu: '基本信息',
          menuKey: 'mater_room_info',
          menuIcon: 'home',
          menuUrl: urls.MATER_ROOM_INFO,
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
          menu: '房间管理',
          menuKey: 'mater_room_manage',
          menuIcon: 'bell',
          menuUrl: urls.MATER_ROOM_MANAGE,
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
              key: 'offline'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '换房记录',
          menuKey: 'mater_room_change',
          menuIcon: 'frown-o',
          menuUrl: urls.MATER_ROOM_CHANGE_RECORD,
          buttons: [
            {
              name: '编辑',
              key: 'edit'
            },
            {
              name: '审核',
              key: 'examine'
            },
            {
              name: '查看',
              key: 'check'
            }
          ]
        },
        {
          menu: '续房记录',
          menuKey: 'mater_room_extend',
          menuIcon: 'smile-o',
          menuUrl: urls.MATER_ROOM_EXTEND_RECORD_INDEX,
          buttons: [
            {
              name: '查看',
              key: 'see'
            },
            {
              name: '审核',
              key: 'examine'
            },
            {
              name: '编辑',
              key: 'edit'
            },
          ]
        },
        {
          menu: '入住记录',
          menuKey: 'mater_room_check',
          menuIcon: 'table',
          menuUrl: urls.MATER_MANAGE_CHECK_RECORD_INDEX,
          buttons: [
            {
              name: '查看',
              key: 'see'
            },
            {
              name: '入住',
              key: 'check'
            },
            {
              name: '转房',
              key: 'change'
            },
            {
              name: '续房',
              key: 'extend'
            },
            {
              name: '退房',
              key: 'checkout'
            }
          ]
        }
      ]
    },
    {
      menu: '套餐管理',
      menuKey: 'packages',
      menuIcon: 'folder',
      menuUrl: urls.MATER_PACKAGES,
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
          name: '查看',
          key: 'see'
        },
        {
          name: '修改状态',
          key: 'invalid'
        },
      ]
    },
    {
      menu: '服务管理',
      menuKey: 'service',
      menuIcon: 'heart-o',
      menuUrl: urls.MATER_SERVICE,
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
          name: '查看',
          key: 'see'
        },
        {
          name: '修改状态',
          key: 'invalid'
        },
      ]
    },
    {
      menu: '合同管理',
      menuKey: 'contract',
      menuIcon: 'file',
      menuUrl: urls.MATER_CONTRACT,
      buttons: [
        {
          name: '新增',
          key: 'add'
        },
        {
          name: '变更合同',
          key: 'change'
        },
        {
          name: '变更合同状态',
          key: 'changeStatus'
        },
        {
          name: '查看',
          key: 'check'
        }
      ]
    },
  ]
}
