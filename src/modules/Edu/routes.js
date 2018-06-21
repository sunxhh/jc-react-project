import * as urls from 'Global/urls'
import EduModule from 'bundle-loader?lazy!../Edu'

export default [
  {
    path: urls.EDU_MODULE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '教育模块',
    parentPath: urls.HOME
  },
  {
    path: urls.CLASS_ROOM_MANAGE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '教室设置',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_COURSE_MANAGE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '课程设置',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_TEXTBOOK_MANAGE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '教材设置',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_CLASS_MANAGE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '班级管理',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_CLASS_MANAGE_ADD,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '班级新增',
    parentPath: urls.EDU_CLASS_MANAGE
  },
  {
    path: urls.EDU_CLASS_MANAGE_EDIT,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '班级修改',
    parentPath: urls.EDU_CLASS_MANAGE
  },
  {
    path: urls.EDU_CLASS_MANAGE_DETAIL,
    exact: false,
    baseComponent: EduModule,
    breadcrumbName: '班级明细',
    parentPath: urls.EDU_CLASS_MANAGE
  },
  {
    path: urls.EDU_CLASS_MANAGE_DETAIL_STUDENT,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '学员信息',
    parentPath: urls.EDU_CLASS_MANAGE_DETAIL
  },
  {
    path: urls.EDU_COURSE_MANAGE_ADD,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '新增课程',
    parentPath: urls.EDU_COURSE_MANAGE
  },
  {
    path: `${urls.EDU_COURSE_MANAGE_EDIT}/:courseId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '编辑课程',
    parentPath: urls.EDU_COURSE_MANAGE
  },
  {
    path: urls.EDU_STUDENT_MANAGE,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '学员管理',
    parentPath: urls.HOME
  },
  {
    path: `${urls.EDU_STUDENT_DETAIL}/:id`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '学员明细',
    parentPath: urls.EDU_STUDENT_MANAGE
  },
  {
    path: urls.EDU_STUDENT_ADD,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '新增',
    parentPath: urls.EDU_STUDENT_MANAGE
  },
  {
    path: `${urls.EDU_STUDENT_EDIT}/:studentId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '编辑',
    parentPath: urls.EDU_STUDENT_MANAGE
  },
  {
    path: `${urls.EDU_ADD_TOUCH}/:id`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '添加沟通',
    parentPath: urls.EDU_STUDENT_MANAGE
  },
  {
    path: `${urls.EDU_EDIT_TOUCH}/:studentId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '编辑沟通',
    parentPath: urls.EDU_STUDENT_MANAGE
  },
  {
    path: urls.EDU_CHANNEL_SET,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '渠道设置',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_COURSE_LIST,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '课程列表',
    parentPath: urls.HOME
  },
  {
    path: urls.EDU_COURSE_ARRAY_ADD,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '排课',
    parentPath: urls.EDU_COURSE_LIST
  },
  {
    path: `${urls.EDU_COURSE_ARRAY_EDIT}/:scheduleNo/:scheduleId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '编辑单次',
    parentPath: urls.EDU_COURSE_LIST
  },
  {
    path: `${urls.EDU_COURSE_ARRAY_EDIT}/:scheduleNo`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '编辑多次',
    parentPath: urls.EDU_COURSE_LIST
  },
  {
    path: urls.EDU_COURSE_SYLLABUS,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '课程表',
    parentPath: urls.HOME
  },
  {
    path: urls.HANDLE_CENTER,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '办理中心',
    parentPath: urls.HOME
  },
  {
    path: urls.HANDLE_CENTER_ADD_CLASSROOM,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '报班',
    parentPath: urls.HANDLE_CENTER
  },
  {
    path: `${urls.HANDLE_CENTER_BACKOUT_CLASSROOM}/:orderId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '退班',
    parentPath: urls.HANDLE_CENTER
  },
  {
    path: `${urls.HANDLE_CENTER_CHANGE_CLASSROOM}/:orderId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '转班',
    parentPath: urls.HANDLE_CENTER
  },
  {
    path: urls.HANDLE_CENTER_BUY_TEXTBOOK,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '购教材',
    parentPath: urls.HANDLE_CENTER
  },
  {
    path: `${urls.HANDLE_CENTER_BACK_TEXTBOOK}/:orderId`,
    exact: true,
    baseComponent: EduModule,
    breadcrumbName: '退教材',
    parentPath: urls.HANDLE_CENTER
  }
]
