let baseUrl = '/'
let memberUrl = '/'
let maternityUrl = '/'
let retailUrl = '/'
let reportUrl = '/'
let sportUrl = '/'
let supplyChainUrl = '/'
let logisticsUrl = '/'
let memberCenterUrl = '/'
let memberPointUrl = '/'
let memberCardUrl = '/'
let orderCenterUrl = '/'
let petUrl = '/'

if (process.env.NODE_ENV === 'production') {
  switch (process.env.BUILD_ENV) {
    case 'dev': {
      console.log('in DEV')
      baseUrl = 'http://dev-wapi-industry.dx-groups.com'
      memberUrl = 'http://dev-wapi-jccard.dx-groups.com'
      maternityUrl = 'http://dev-wapi-jccarecenter.dx-groups.com'
      retailUrl = 'http://dev-wapi-retail.dx-groups.com'
      reportUrl = 'http://dev-wapi-report-retail.dx-groups.com'
      sportUrl = 'http://dev-wapi-health.dx-groups.com'
      supplyChainUrl = 'http://dev-capi-supply-chain.dx-groups.com:8084'
      logisticsUrl = 'http://dev-wapi-logistics.dx-groups.com'
      memberCenterUrl = 'http://dev-wapi-member.dx-groups.com'
      memberPointUrl = 'http://dev-wapi-member-point.dx-groups.com'
      memberCardUrl = 'http://dev-wapi-card.dx-groups.com'
      orderCenterUrl = 'http://dev-wapi-order.dx-groups.com'
      petUrl = 'http://dev-wapi-pet-club.dx-groups.com'
      break
    }
    case 'test': {
      console.log('in TEST')
      baseUrl = 'http://test-wapi-industry.dx-groups.com'
      memberUrl = 'http://test-wapi-jccard.dx-groups.com'
      maternityUrl = 'http://test-wapi-jccarecenter.dx-groups.com'
      retailUrl = 'http://test-wapi-retail.dx-groups.com'
      reportUrl = 'http://test-wapi-report-retail.dx-groups.com'
      sportUrl = 'http://test-wapi-health.dx-groups.com'
      supplyChainUrl = 'http://test-wapi-supply-chain.dx-groups.com'
      logisticsUrl = 'http://test-wapi-logistics.dx-groups.com'
      memberCenterUrl = 'http://test-wapi-member.dx-groups.com'
      memberPointUrl = 'http://test-wapi-member-point.dx-groups.com'
      memberCardUrl = 'http://test-wapi-card.dx-groups.com'
      orderCenterUrl = 'http://test-wapi-order.dx-groups.com'
      petUrl = 'http://test-wapi-pet-club.dx-groups.com'
      break
    }
    case 'pre': {
      console.log('in PRE')
      baseUrl = 'https://pre-wapi-industry.dx-groups.com'
      memberUrl = 'https://pre-wapi-jccard.dx-groups.com'
      maternityUrl = 'https://pre-wapi-jccarecenter.dx-groups.com'
      retailUrl = 'https://pre-wapi-retail.dx-groups.com'
      reportUrl = 'https://pre-wapi-report-retail.dx-groups.com'
      sportUrl = 'https://pre-wapi-health.dx-groups.com'
      supplyChainUrl = 'https://pre-wapi-supply-chain.dx-groups.com'
      logisticsUrl = 'https://pre-wapi-logistics.dx-groups.com'
      memberCenterUrl = 'https://pre-wapi-member.dx-groups.com'
      memberPointUrl = 'https://pre-wapi-member-point.dx-groups.com'
      memberCardUrl = 'https://pre-wapi-card.dx-groups.com'
      orderCenterUrl = 'https://pre-wapi-order.dx-groups.com'
      petUrl = 'https://pre-wapi-pet-club.dx-groups.com'
      break
    }
    default: {
      console.log('in PROD')
      baseUrl = 'https://wapi-industry.dx-groups.com'
      memberUrl = 'https://wapi-jccard.dx-groups.com'
      maternityUrl = 'https://wapi-jccarecenter.dx-groups.com'
      retailUrl = 'https://wapi-retail.dx-groups.com'
      reportUrl = 'https://wapi-report-retail.dx-groups.com'
      sportUrl = 'https://wapi-health.dx-groups.com'
      supplyChainUrl = 'https://wapi-supply-chain.dx-groups.com'
      logisticsUrl = 'https://wapi-logistics.dx-groups.com'
      memberCenterUrl = 'https://wapi-member.dx-groups.com'
      memberPointUrl = 'https://wapi-member-point.dx-groups.com'
      memberCardUrl = 'https://wapi-card.dx-groups.com'
      orderCenterUrl = 'https://wapi-order.dx-groups.com'
      petUrl = 'https://wapi-pet-club.dx-groups.com'
    }
  }
}

export {
  baseUrl,
  memberUrl,
  maternityUrl,
  sportUrl,
  supplyChainUrl,
  retailUrl,
  logisticsUrl,
  reportUrl,
  memberCenterUrl,
  memberPointUrl,
  memberCardUrl,
  orderCenterUrl,
  petUrl,
}
