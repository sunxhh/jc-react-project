import * as urls from 'Global/urls'

// export default [
//   {
//     name: 'ARTHUR',
//     url: urls.ARTHUR,
//     icon: 'book',
//     children: [
//       {
//         name: 'ARTHUR_PAGE',
//         url: urls.ARTHUR_PAGE,
//         icon: 'book',
//         children: [
//           {
//             name: 'ARTHUR_PAGE_SUB',
//             url: urls.ARTHUR_PAGE_SUB,
//             icon: 'credit-card',
//           }
//         ],
//       }
//     ]
//   },
// ]

export default {
  menu: 'ARTHUR',
  menuKey: 'ARTHUR',
  menuIcon: 'shop',
  menuUrl: urls.ARTHUR,
  children: [
    {
      menu: 'ARTHUR_PAGE',
      menuKey: 'ARTHUR_PAGE',
      menuIcon: 'barcode',
      menuUrl: urls.ARTHUR_PAGE,
      children: [
        {
          menu: 'ARTHUR_PAGE_SUB',
          menuKey: 'ARTHUR_PAGE_SUB',
          menuIcon: 'schedule',
          menuUrl: urls.ARTHUR_PAGE_SUB,
        }
      ]
    }
  ]
}
