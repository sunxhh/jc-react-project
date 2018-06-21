const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const webpackCommon = {
  resolve: {
    alias: {
      Utils: resolve('src/utils/'),
      Assets: resolve('src/assets/'),
      Global: resolve('src/global/'),
      Components: resolve('src/components'),
      Modules: resolve('src/modules'),
    },
  }
}

module.exports = {
  entry: 'src/app/index.js',
  babel: {
    plugins: [
      // ['import', [{ libraryName: 'antd', style: 'css' }]],
      ['import', { libraryName: 'antd', style: true }],
    ],
  },
  webpack: {
    dev: {
      ...webpackCommon
    },
    prod: {
      ...webpackCommon,
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'moment': 'moment',
        'moment/locale/zh-cn': 'moment.locale',
      },
    },
    vendor: ['draft', 'immutable']
  },
  proxy: {
    "/api/gwc":{
      "target": "http://10.100.122.162:8038",
      "changeOrigin": true
    },
    // "/api/printer/printTemplate":{
    //   "target": "http://10.100.120.104:8011",
    //   "changeOrigin": true
    // },
    "/api/member/admin/memberPoint":{
      "target": "http://test-wapi-member-point.dx-groups.com",
      "changeOrigin": true
    },
    "/api/sysuser/": {
      "target": "http://test-wapi-health.dx-groups.com",
      "changeOrigin": true
    },
    "/api/pet/": {
      "target": "http://test-wapi-pet-club.dx-groups.com",
      "changeOrigin": true
    },
    "/api/retail/admin/report": {
      "target": "http://test-wapi-report-retail.dx-groups.com",
      "changeOrigin": true
    },
    "/api/retail": {
      "target": "http://test-wapi-retail.dx-groups.com",
      "changeOrigin": true
    },
    "/api/supplychain": {
      "target": "http://dev-wapi-supply-chain.dx-groups.com",
      "changeOrigin": true
    },
    "/api/logistics": {
      "target": "http://test-wapi-logistics.dx-groups.com",
      "changeOrigin": true
    },
    "/api/printer": {
      "target": "http://10.100.122.114:8011",
      "changeOrigin": true
    },
    "/api/dictionary": {
      "target": "http://dev-wapi-health.dx-groups.com",
      "changeOrigin": true
    },
    "/api/sys/org/orgByIndustry": {
      "target": "http://dev-wapi-industry.dx-groups.com",
      "changeOrigin": true
    },
    "/api/fitness": {
      "target": "http://dev-wapi-health.dx-groups.com",
      "changeOrigin": true
    },
    "/api/schedule": {
      "target": "http://dev-wapi-health.dx-groups.com",
      "changeOrigin": true
    },
    "/api/reservation": {
      "target": "http://dev-wapi-health.dx-groups.com",
      "changeOrigin": true
    },
    "/api/web/member": {
      "target": "http://test-wapi-jccard.dx-groups.com",
      "changeOrigin": true
    },
    "/api/web": {
      "target": "http://dev-wapi-jccarecenter.dx-groups.com",
      "changeOrigin": true
    },
    "/api/carecenter/web": {
      "target": "http://dev-wapi-jccarecenter.dx-groups.com",
      "changeOrigin": true
    },
    "/api/member": {
      "target": "http://dev-wapi-member.dx-groups.com",
      "changeOrigin": true
    },
    "/api/order": {
      "target": "http://dev-wapi-order.dx-groups.com",
      "changeOrigin": true
    },
    "/api": {
      "target": "http://dev-wapi-industry.dx-groups.com",
      "changeOrigin": true
    }
  },
  serviceWorker: path.resolve(__dirname, 'src/service-worker.js')
}
