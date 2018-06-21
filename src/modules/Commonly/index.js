import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Member from './member' // 会员管理
import MemberDetail from './member/detail' // 会员管理 / 明细详情
import MemberAdd from './member/add' // 会员管理 / 新增
import MemberEdit from './member/edit' // 会员管理 / 编辑
import Enroll from './enrollManage'
import RoleManage from './roleManage'
import UserManage from './userManage' // 用户管理 / 列表
import UserAdd from './userManage/add' // 用户管理 / 新增
import UserEdit from './userManage/edit' // 用户管理 / 编辑
import BannerMoudle from './bannerManage'
import BannerAdd from './bannerManage/add'
import BannerEdit from './bannerManage/edit'
import Consult from './consultManage/consultManage'
import Add from './consultManage/consultManage/add'
import Edit from './consultManage/consultManage/edit'
import Channel from './consultManage/channelManage'
import Activity from './activityCenter'
import ActivityAdd from './activityCenter/add'
import ActivityEdit from './activityCenter/edit'
import * as urls from '../../global/urls'

class CommonlyModule extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from={urls.COMMONLY} to={urls.BANNER_MANAGE} />
          <Route exact path={urls.BANNER_MANAGE} component={BannerMoudle} />
          <Route exact path={urls.BANNER_MANAGE_ADD} component={BannerAdd} />
          <Route exact path={`${urls.BANNER_MANAGE_EDIT}/:id`} component={BannerEdit} />
          <Route exact path={urls.MEMBER} component={Member} />
          <Route exact path={`${urls.MEMBERDETAIL}/:memberId`} component={MemberDetail} />
          <Route exact path={urls.MEMBERADD} component={MemberAdd} />
          <Route exact path={`${urls.MEMBEREDIT}/:memberId`} component={MemberEdit} />
          <Route exact path={urls.ROLE_MANAGE} component={RoleManage} />
          <Route exact path={urls.ENROLL_MANAGE} component={Enroll} />
          <Route exact path={urls.USER_MANAGE} component={UserManage} />
          <Route exact path={urls.USER_ADD} component={UserAdd} />
          <Route exact path={`${urls.USER_EDIT}/:userId`} component={UserEdit} />
          <Route exact path={urls.CHANNEL_MANAGE} component={Channel} />
          <Route exact path={urls.CONSULT_MANAGE} component={Consult} />
          <Route exact path={urls.CONSULT_MANAGE_ADD} component={Add} />
          <Route exact path={`${urls.CONSULT_MANAGE_EDIT}/:id`} component={Edit} />
          <Route exact path={urls.ACTIVITY_CENTER} component={Activity} />
          <Route exact path={urls.ACTIVITY_CENTER_ADD} component={ActivityAdd} />
          <Route exact path={`${urls.ACTIVITY_CENTER_EDIT}/:id`} component={ActivityEdit} />
        </Switch>
      </div>
    )
  }
}

export default CommonlyModule
