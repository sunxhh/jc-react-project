const apis = {
  member: {
    list: '/api/member/admin/member/list',
    orgMemberList: '/api/member/admin/org/member/list',
    query: '/api/member/admin/member/query',
    basicDetail: '/api/member/admin/member/detail',
    orgMemberDetail: '/api/member/admin/org/member/detail',
    add: '/api/member/admin/member/add',
    update: '/api/member/admin/member/update',
    firstOrgList: 'api/sys/org/myListByLevel'
  },
  customFields: {
    orgList: '/api/sys/org/orgByIndustry',
    extfieldList: '/api/member/admin/org/extfield/list',
    extfieldDetail: '/api/member/admin/org/extfield/detail',
    extfieldAdd: '/api/member/admin/org/extfield/save',
    extfieldDel: '/api/member/admin/org/extfield/delete',
    publish: '/api/member/admin/org/extfield/publish',
  },
  integral: {
    ruleList: '/api/member/admin/rule/list',
    ruleAdd: '/api/member/admin/rule/add',
    ruleDel: '/api/member/admin/rule/del',
    currencyRuleAdd: '/api/member/admin/currencyRule/add',
    currencyRuleDetail: '/api/member/admin/currencyRule/detail',
    ruleTempletList: '/api/member/admin/ruleTemplet/list',
    pointFlowList: '/api/member/admin/pointFlow/list',
    pointSurvey: '/api/member/admin/memberPoint/survey', // 积分明细
    pointList: '/api/member/admin/memberPoint/list', // 积分详情列表
    pointFlowDeduction: '/api/member/admin/memberPoint/deduction', // 积分扣除
    pointFlowAdd: '/api/member/admin/memberPoint/add', // 积分增加
    isMember: '/api/member/admin/memberPoint/isMember', // 用户是否过去
  },
  org: {
    list: '/api/sys/org/myListByLevel',
    subOrgList: '/api/sys/org/orgByLevelOneCode',
  },
  right: {
    list: '/api/member/admin/level/list',
    add: '/api/member/admin/level/add',
    detail: '/api/member/admin/level/detail',
    delete: '/api/member/admin/level/delete',
    update: '/api/member/admin/level/save',
    active: '/api/member/admin/level/active',
  },
  rightLibrary: {
    list: '/api/member/admin/right/list',
    add: '/api/member/admin/right/add',
    detail: '/api/member/admin/right/detail',
    delete: '/api/member/admin/right/delete',
    update: '/api/member/admin/right/update',
    active: '/api/member/admin/right/activated',
  },
  pet: {
    detail: '/api/pet/web/member/getMemberPetList/v1',
    unbindOpenId: '/api/pet/web/member/unbind/v1',
    bindOpenId: '/api/pet/web/member/bind/v1',
  },
  card: {
    list: '/api/card/admin/membercard/list',
    active: '/api/card/admin/membercard/isUsed',
    memberList: '/api/card/admin/membercard/detailMemberList',
    addBasicInfo: '/api/card/admin/membercard/addBasicInfo',
    addDetailInfo: '/api/card/admin/membercard/addDetailInfo',
    detail: '/api/card/admin/membercard/detail',
    updateBasicInfo: '/api/card/admin/membercard/updateBasicInfo',
    updateDetailInfo: '/api/card/admin/membercard/updateDetailInfo',
    fieldList: '/api/card/admin/membercard/fieldList',
  },

}

export default apis
