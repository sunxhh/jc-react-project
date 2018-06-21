import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import PetModule from 'bundle-loader?lazy!./index'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, PetModule, parentPath)

export default [
  genRoute(urls.PET, '宠物模块'),
  genRoute(urls.PET_SPECIES, '宠物分类管理', urls.PET),
]
