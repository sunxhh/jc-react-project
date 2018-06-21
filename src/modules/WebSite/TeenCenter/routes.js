// 青少年素能中心
import TeenModule from 'bundle-loader?lazy!../TeenCenter'
import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, TeenModule, parentPath)

// =============> 素能中心 <============= //
export default [
  genRoute(urls.TEENCENTER, '素能中心'),
  genRoute(urls.BOOK_MANAGE, '预约管理', urls.TEENCENTER),
  genRoute(urls.CLASSIFY_MANAGE, '分类管理', urls.TEENCENTER),
  genRoute(urls.CLASS_DETAIL, '课程详情', urls.TEENCENTER),
  genRoute(urls.CLASS_DETAIL_ADD, '新增', urls.TEENCENTER),
  genRoute(`${urls.CLASS_DETAIL_EDIT}/:id`, '编辑', urls.TEENCENTER),
  genRoute(urls.TEACHER_MANAGE, '教师管理', urls.TEENCENTER),
  genRoute(urls.TEACHER_MANAGE_ADD, '新增', urls.TEACHER_MANAGE),
  genRoute(`${urls.TEACHER_MANAGE_EDIT}/:id`, '编辑', urls.TEACHER_MANAGE),
]
