import * as urls from 'Global/urls'

export default {
  menu: '体育模块',
  menuKey: 'sport',
  menuIcon: 'team',
  menuUrl: urls.SPORT_MODULE,
  children: [
    {
      menu: '教室设置',
      menuKey: 'sport_class_room_manage',
      menuIcon: 'laptop',
      menuUrl: urls.SPORT_ROOM,
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
      menuKey: 'sport_course_manage',
      menuIcon: 'team',
      menuUrl: urls.SPORT_COURSE,
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
          name: '导出',
          key: 'export'
        }
      ]
    },
    {
      menu: '排课管理',
      menuKey: 'sport_schedule_manage',
      menuIcon: 'area-chart',
      menuUrl: urls.SPORT_SCHEDULE,
      children: [
        {
          menu: '课程列表',
          menuKey: 'sport_schedule_list_manage',
          menuIcon: 'layout',
          menuUrl: urls.SPORT_SCHEDULE_LIST,
          buttons: [
            {
              name: '排课',
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
              name: '预约',
              key: 'subscribe'
            },
            {
              name: 'Excel导出',
              key: 'export'
            }
          ]
        },
        {
          menu: '预约信息',
          menuKey: 'sport_schedule_enroll_manage',
          menuIcon: 'team',
          menuUrl: urls.SPORT_SCHEDULE_SUBSCRIBE,
          buttons: [
            {
              name: '取消预约',
              key: 'cancel'
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
          menu: '课程表',
          menuKey: 'sport_schedule_syllabus',
          menuIcon: 'schedule',
          menuUrl: urls.SPORT_SCHEDULE_SYLLABUS,
          buttons: [
            {
              name: '打印',
              key: 'print'
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
      ]
    },
  ]
}
