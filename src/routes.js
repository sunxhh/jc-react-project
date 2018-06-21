import * as urls from 'Global/urls'
import Home from './app/pages/home'

import baseRoutes from 'Modules/Base/routes'
import commonRoutes from 'Modules/Commonly/routes'
import eduRoutes from 'Modules/Edu/routes'
import materRoutes from 'Modules/Maternity/routes'
import teenRoutes from 'Modules/WebSite/TeenCenter/routes'
import sportRoutes from 'Modules/Sport/routes'
import retailRoutes from 'Modules/Retail/routes'
import supplyChainRoutes from 'Modules/SupplyChain/routes'
import purchaseRoutes from 'Modules/Purchase/routes'
import arthurRoutes from 'Modules/Arthur/routes'
import memberRoutes from 'Modules/Member/routes'
import libraryRoutes from 'Modules/Library/routes'
import orderCenter from './modules/OrderCenter/routes'
import PetRoutes from 'Modules/Pet/routes'
import antiqueRoutes from 'Modules/WebSite/Antique/routes'

const routes = [
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  ...baseRoutes,
  ...commonRoutes,
  ...eduRoutes,
  ...materRoutes,
  ...sportRoutes,
  ...teenRoutes,
  ...retailRoutes,
  ...supplyChainRoutes,
  ...purchaseRoutes,
  ...arthurRoutes,
  ...memberRoutes,
  ...libraryRoutes,
  ...orderCenter,
  ...PetRoutes,
  ...antiqueRoutes,
]
export default routes
