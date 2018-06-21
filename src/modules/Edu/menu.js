import * as urls from 'Global/urls'

export default {
  menu: '教育模块',
  menuKey: 'edu',
  menuIcon: 'book',
  menuUrl: urls.EDU_MODULE,
  children: [
    {
      menu: '教室设置',
      menuKey: 'edu_class_room_manage',
      menuIcon: 'laptop',
      menuUrl: urls.CLASS_ROOM_MANAGE,
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
      menu: '班级管理',
      menuKey: 'EDU_CLASS_MANAGE',
      menuIcon: 'calendar',
      menuUrl: urls.EDU_CLASS_MANAGE,
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
      menu: '课程管理',
      menuKey: 'course',
      menuIcon: 'layout',
      menuUrl: 'course',
      children: [
        {
          menu: '课程设置',
          menuKey: 'EDU_COURSE_MANAGE',
          menuIcon: 'layout',
          menuUrl: urls.EDU_COURSE_MANAGE,
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
          menu: '教材设置',
          menuKey: 'text_book_manage',
          menuIcon: 'book',
          menuUrl: urls.EDU_TEXTBOOK_MANAGE,
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
      menu: '学员中心',
      menuKey: 'student_center',
      menuIcon: 'team',
      menuUrl: 'student_manage',
      children: [
        {
          menu: '学员管理',
          menuKey: 'student_manage',
          menuIcon: 'team',
          menuUrl: urls.EDU_STUDENT_MANAGE,
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
              name: '添加沟通',
              key: 'addTouch'
            },
            {
              name: '编辑沟通',
              key: 'editTouch'
            },
            {
              name: '短信通知',
              key: 'sendMsg'
            },
            {
              name: '导出',
              key: 'export'
            }
          ]
        },
        {
          menu: '渠道设置',
          menuKey: 'channel_manage',
          menuIcon: 'team',
          menuUrl: urls.EDU_CHANNEL_SET,
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
      menu: '排课管理',
      menuKey: 'course_plan',
      menuIcon: 'area-chart',
      menuUrl: 'course_plan',
      children: [
        {
          menu: '课程列表',
          menuKey: 'course_list',
          menuIcon: 'user',
          menuUrl: urls.EDU_COURSE_LIST,
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
          menu: '课程表',
          menuKey: 'syllabus',
          menuIcon: 'user',
          menuUrl: urls.EDU_COURSE_SYLLABUS,
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
      ]
    },
    {
      menu: '办理中心',
      menuKey: 'handle_manage',
      menuIcon: 'book',
      menuUrl: urls.HANDLE_CENTER,
      buttons: [
        {
          name: '报班',
          key: 'add'
        },
        {
          name: '购教材',
          key: 'buyBook'
        },
        {
          name: '退班',
          key: 'backClass'
        },
        {
          name: '转班',
          key: 'changeClass'
        },
        {
          name: '退教材',
          key: 'backBook'
        }
      ]
    }
  ]
}
