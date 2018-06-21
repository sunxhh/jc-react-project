import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import CustomFields from './customFields'
import CustomAdd from './customFields/add'
import Integral from './integral'
import IntegralDetail from './integral/detail'
import MemberList from './member'
import Rule from './integral/rule'
import MemberEdit from './member/edit'
import MemberDetail from './member/detail'
import RightList from './right'
import RightLibraryList from './rightLibrary'
import MemberCard from './card'
import MemberCardMemberList from './card/memberList'
import MemberCardAdd from './card/add'
import MemberCardAddDetail from './card/addDetail'
import MemberCardEdit from './card/edit'
import MemberCardEditDetail from './card/editDetail'

class MemberModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.INDUSTRY_MEMBER} to={urls.MEMBER_LIST} />
        <Route exact path={urls.MEMBER_LIST} component={MemberList} />
        <Route exact path={`${urls.MEMBER_EDIT}`} component={MemberEdit} />
        <Route exact path={`${urls.MEMBER_ADD}`} component={MemberEdit} />
        <Route exact path={`${urls.MEMBER_EDIT}/:userId`} component={MemberEdit} />
        <Route exact path={`${urls.MEMBER_DETAIL}/:userId`} component={MemberDetail} />
        <Route exact path={urls.MEMBER_CUSTOM_FIELDS} component={CustomFields} />
        <Route exact path={urls.MEMBER_CUSTOM_FIELDS_ADD} component={CustomAdd} />
        <Route exact path={`${urls.MEMBER_CUSTOM_FIELDS_EDIT}/:fieldId`} component={CustomAdd} />
        <Route exact path={urls.MEMBER_INTEGRAL} component={Integral} />
        <Route exact path={urls.MEMBER_INTEGRAL_RULE} component={Rule} />
        <Route exact path={urls.MEMBER_DETAIL} component={MemberDetail} />
        <Route exact path={urls.MEMBER_INTEGRAL_DETAIL} component={IntegralDetail} />
        <Route exact path={urls.MEMBER_RIGHT_MANAGE} component={RightList} />
        <Route exact path={urls.MEMBER_RIGHT_LIBRARY} component={RightLibraryList} />
        <Route exact path={urls.MEMBER_CARD} component={MemberCard} />
        <Route exact path={`${urls.MEMBER_CARD_MEMBER_LIST}/:cardId`} component={MemberCardMemberList} />
        <Route exact path={urls.MEMBER_CARD_ADD} component={MemberCardAdd} />
        <Route exact path={`${urls.MEMBER_CARD_ADD_DETAIL}/:cardId/:orgCode`} component={MemberCardAddDetail} />
        <Route exact path={`${urls.MEMBER_CARD_EDIT}/:cardId`} component={MemberCardEdit} />
        <Route exact path={`${urls.MEMBER_CARD_EDIT_DETAIL}/:cardId/:orgCode`} component={MemberCardEditDetail} />
      </Switch>
    )
  }
}
export default MemberModule
