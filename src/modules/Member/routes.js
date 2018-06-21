import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import MemberModule from 'bundle-loader?lazy!./'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, MemberModule, parentPath)

export default [
  genRoute(urls.MEMBER_LIST, '会员列表'),
  genRoute(`${urls.MEMBER_ADD}`, '录入会员', urls.MEMBER_LIST),
  genRoute(`${urls.MEMBER_EDIT}`, '编辑会员', urls.MEMBER_LIST),
  genRoute(`${urls.MEMBER_EDIT}/:useId`, '编辑会员', urls.MEMBER_LIST),
  genRoute(`${urls.MEMBER_DETAIL}/:useId`, '会员信息', urls.MEMBER_LIST),
  genRoute(urls.MEMBER_CUSTOM_FIELDS, '产业字段库'),
  genRoute(urls.MEMBER_CUSTOM_FIELDS_ADD, '产业字段设置', urls.MEMBER_CUSTOM_FIELDS),
  genRoute(`${urls.MEMBER_CUSTOM_FIELDS_EDIT}/:fieldId`, '产业字段设置', urls.MEMBER_CUSTOM_FIELDS),
  genRoute(urls.MEMBER_INTEGRAL, '积分管理'),
  genRoute(urls.MEMBER_INTEGRAL_RULE, '积分规则', urls.MEMBER_INTEGRAL),
  genRoute(urls.MEMBER_INTEGRAL_DETAIL, '查看', urls.MEMBER_INTEGRAL),
  genRoute(urls.MEMBER_RIGHT_MANAGE, '会员权益'),
  genRoute(urls.MEMBER_RIGHT_LIBRARY, '会员权益库'),
  genRoute(urls.MEMBER_CARD, '会员卡'),
  genRoute(`${urls.MEMBER_CARD_MEMBER_LIST}/:cardId`, '开卡会员', urls.MEMBER_CARD),
  genRoute(urls.MEMBER_CARD_ADD, '创建会员卡', urls.MEMBER_CARD),
  genRoute(`${urls.MEMBER_CARD_ADD_DETAIL}/:cardId/:orgCode`, '创建会员卡', urls.MEMBER_CARD),
  genRoute(`${urls.MEMBER_CARD_EDIT}/:cardId`, '编辑会员卡', urls.MEMBER_CARD),
  genRoute(`${urls.MEMBER_CARD_EDIT_DETAIL}/:cardId/:orgCode`, '编辑会员卡', urls.MEMBER_CARD),
]
