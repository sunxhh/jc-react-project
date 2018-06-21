// 青少年素能中心
import AntiqueModule from 'bundle-loader?lazy!../Antique'
import * as urls from 'Global/urls'

import { RouteHelper } from 'Utils/helper'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, AntiqueModule, parentPath)

// =============> 素能中心 <============= //
export default [
  genRoute(urls.ANTIQUE, '古玩城'),
  genRoute(urls.ANTIQUE_BOOK, '预约管理', urls.ANTIQUE),
  genRoute(urls.ANTIQUE_FAMOUS, '名家管理', urls.ANTIQUE),
  genRoute(urls.ANTIQUE_FAMOUS_ADD, '新增名家', urls.ANTIQUE),
  genRoute(`${urls.ANTIQUE_FAMOUS_ADD}/:id`, '编辑名家', urls.ANTIQUE),
]
