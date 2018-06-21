import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import LibraryModule from 'bundle-loader?lazy!./'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, LibraryModule, parentPath)

export default [
  genRoute(urls.LIBRARY, '仿佛书屋'),
  genRoute(urls.LIBRARY_RECOMMEND, '图书荐购', urls.LIBRARY),
]
