/* Commonly */
import * as urls from 'Global/urls'

import CommonlyModule from 'bundle-loader?lazy!./index'

export default [
  // banner
  {
    path: urls.BANNER_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: 'banner管理',
    parentPath: urls.HOME
  },
  {
    path: urls.BANNER_MANAGE_ADD,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '新增',
    parentPath: urls.BANNER_MANAGE
  },
  {
    path: `${urls.BANNER_MANAGE_EDIT}/:id`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '编辑',
    parentPath: urls.BANNER_MANAGE
  },
  {
    path: urls.MEMBER,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '会员管理',
    parentPath: urls.HOME
  },
  {
    path: `${urls.MEMBERDETAIL}/:memberId`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '信息明细',
    parentPath: urls.MEMBER
  },
  {
    path: urls.MEMBERADD,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '新增',
    parentPath: urls.MEMBER
  },
  {
    path: `${urls.MEMBEREDIT}/:memberId`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '编辑',
    parentPath: urls.MEMBER
  },

  {
    path: urls.ROLE_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '角色管理',
    parentPath: urls.HOME
  },
  {
    path: urls.ENROLL_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '报名管理',
    parentPath: urls.HOME
  },
  {
    path: urls.USER_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '用户管理',
    parentPath: urls.HOME
  },
  {
    path: urls.USER_ADD,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '新增用户',
    parentPath: urls.USER_MANAGE
  },
  {
    path: `${urls.USER_EDIT}/:userId`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '编辑用户',
    parentPath: urls.USER_MANAGE
  },
  {
    path: urls.CHANNEL_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '频道管理',
    parentPath: urls.HOME
  },
  {
    path: urls.CONSULT_MANAGE,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '资讯管理',
    parentPath: urls.HOME
  },
  {
    path: urls.CONSULT_MANAGE_ADD,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '新增',
    parentPath: urls.CONSULT_MANAGE
  },
  {
    path: `${urls.CONSULT_MANAGE_EDIT}/:id`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '编辑',
    parentPath: urls.CONSULT_MANAGE
  },
  {
    path: urls.ACTIVITY_CENTER,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '活动中心',
    parentPath: urls.HOME
  },
  {
    path: urls.ACTIVITY_CENTER_ADD,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '新增',
    parentPath: urls.ACTIVITY_CENTER
  },
  {
    path: `${urls.ACTIVITY_CENTER_EDIT}/:id`,
    exact: true,
    baseComponent: CommonlyModule,
    breadcrumbName: '编辑',
    parentPath: urls.ACTIVITY_CENTER
  },
]
