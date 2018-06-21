import * as urls from 'Global/urls'
import { MenuHelper } from 'Utils/helper'

const { genMenu, CRUDButtons } = MenuHelper

export default genMenu('宠物模块', urls.PET, null, 'eye-o', [
  genMenu('宠物分类管理', urls.PET_SPECIES, CRUDButtons, 'car'),
])
