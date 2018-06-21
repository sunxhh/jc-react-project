import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import BaseModule from 'bundle-loader?lazy!./'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, BaseModule, parentPath)

export default [
  genRoute(urls.ARTHUR, 'ARTHUR'),
  genRoute(urls.ARTHUR_PAGE, 'ARTHUR_PAGE', urls.ARTHUR),
  genRoute(urls.ARTHUR_PAGE_SUB, 'ARTHUR_PAGE_SUB', urls.ARTHUR_PAGE),
]
