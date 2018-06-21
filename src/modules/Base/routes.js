import * as urls from 'Global/urls'

/* Base */
import BaseModule from 'Modules/Base'
import SysLog from 'Modules/Base/systemLog' // 系统日志管理
import Dictionary from 'Modules/Base/dictionary/DictionaryList'
import OrgManage from 'Modules/Base/orgManage'
import MenuManage from 'Modules/Base/menuManage'
import OrgAuthority from 'Modules/Base/orgAuthority'

export default [
  {
    path: urls.BASE_MODULE,
    exact: false,
    component: BaseModule,
    breadcrumbName: '基础模块',
    parentPath: urls.HOME
  },
  {
    path: urls.DATADICTIONARY,
    exact: true,
    component: Dictionary,
    breadcrumbName: '数字字典管理'
  },
  {
    path: urls.SYSLOG,
    exact: true,
    component: SysLog,
    breadcrumbName: '系统日志管理',
    parentPath: urls.HOME
  },
  {
    path: urls.ORG_MANAGE,
    exact: true,
    component: OrgManage,
    breadcrumbName: '组织管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MENU_MANAGE,
    exact: true,
    component: MenuManage,
    breadcrumbName: '菜单管理',
    parentPath: urls.HOME
  },
  {
    path: urls.ORG_AUTHORITY,
    exact: true,
    component: OrgAuthority,
    breadcrumbName: '机构权限',
    parentPath: urls.HOME
  },
]

