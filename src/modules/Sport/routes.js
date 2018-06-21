import * as urls from 'Global/urls'
import SportModule from 'bundle-loader?lazy!../Sport'

export default [
  {
    path: urls.SPORT_MODULE,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '体育模块',
  },
  {
    path: urls.SPORT_ROOM,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '教室管理',
    parentPath: urls.HOME
  },
  {
    path: urls.SPORT_COURSE,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '课程管理',
    parentPath: urls.HOME
  },
  {
    path: urls.SPORT_COURSE_ADD,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '新增',
    parentPath: urls.SPORT_COURSE
  },
  {
    path: urls.SPORT_COURSE_EDIT + '/:courseNo',
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '编辑',
    parentPath: urls.SPORT_COURSE
  },
  {
    path: urls.SPORT_SCHEDULE_LIST,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '课程列表',
    parentPath: urls.HOME
  },
  {
    path: urls.SPORT_SCHEDULE_LIST_ADD,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '排课',
    parentPath: urls.SPORT_SCHEDULE_LIST
  },
  {
    path: urls.SPORT_SCHEDULE_LIST_SUBSCRIBE,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '预约',
    parentPath: urls.SPORT_SCHEDULE_LIST
  },
  {
    path: urls.SPORT_SCHEDULE_LIST_EDIT_REPEAT + '/:batchNo',
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '编辑批次',
    parentPath: urls.SPORT_SCHEDULE_LIST
  },
  {
    path: urls.SPORT_SCHEDULE_LIST_EDIT + '/:scheduleNo',
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '编辑单次',
    parentPath: urls.SPORT_SCHEDULE_LIST
  },
  {
    path: urls.SPORT_SCHEDULE_SYLLABUS,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '课程表',
    parentPath: urls.HOME
  },
  {
    path: urls.SPORT_SCHEDULE_SUBSCRIBE + '/:scheduleNo',
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '预约信息',
    parentPath: urls.HOME
  },
  {
    path: urls.SPORT_SCHEDULE_SUBSCRIBE,
    exact: true,
    baseComponent: SportModule,
    breadcrumbName: '预约信息',
    parentPath: urls.HOME
  },
]
