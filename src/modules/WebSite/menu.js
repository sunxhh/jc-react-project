import teenCenterMenus from './TeenCenter/menu'
import antiqueMenus from './Antique/menu'

export default {
  menu: '官网模块',
  menuKey: 'website',
  menuIcon: 'global',
  menuUrl: 'website',
  children: [
    teenCenterMenus,
    antiqueMenus
  ]
}

