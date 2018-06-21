/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import MaterBatchManage from './nurse/batchManage'
import MaterScheduleManage from './nurse/scheduleManage'
import MaterDutyManage from './nurse/dutyManage'

import MaterGradeManage from './grade/gradeManage' // 等级管理

import MaterCustomerManage from './customer/customerManage' // 客户 列表
import AddIndex from './customer/customerManage/add' // 客户 列表
import CustomerProcess from './customer/customerManage/process' // 客户跟进情况
import ConsumeDetail from './customer/customerManage/add/consumeDetail' // 客户消费详情
import CheckDetail from './customer/customerManage/add/checkDetail' // 客户入住详情
import ContractInfo from './customer/customerManage/add/contractInfo' // 客户 合同详情
import BabyCustomer from './customer/customerManage/add/editBaby' // 编辑宝宝客户

import MaterExtendRecord from './room/extendRecord' // 续房记录
import MaterExtendDetail from './room/extendRecord/extendroomdetail' // 续房详情
import MaterCheckRecord from './room/checkRecord' // 入住记录
import MaterCheckRoom from './room/checkRecord/checkroom' // 入住 续房 转房

import MaterChangeRecord from './room/changeRecord'
import MaterRoomManage from './room/roomManage'
import RoomInfo from './room/roomInfo/index'

import Appointment from './room/roomInfo/Appoinment'
import UpdChangeRecord from './room/changeRecord/UpdChangeRecord'
import CheckIn from './room/roomInfo/CheckIn'
import CheckOut from './room/roomInfo/CheckOut'
import CheckChange from './room/roomInfo/CheckChange'
import ContinuedRoom from './room/roomInfo/ContinuedRoom'
import AfterReservationCheckIn from './room/roomInfo/AfterReservationCheckIn'

import PackageList from './packages' // 套餐管理
import PackageAdd from './packages/packageAdd' // 套餐管理 新增
import PackageSee from './packages/packageSee' // 套餐管理 查看
import PackageEdit from './packages/packageEdit' // 套餐管理 编辑

import ServiceList from './service' // 服务管理
import ServiceAdd from './service/serviceAdd' // 服务管理 新增
import ServiceSee from './service/serviceSee' // 服务管理 查看
import ServiceEdit from './service/serviceEdit' // 服务管理 编辑

import ContractList from './contract' // 合同管理
import ContractAdd from './contract/add' // 合同管理 新增
import ContractEdit from './contract/add' // 合同管理 变更合同
import ContractDetail from './contract/detail' // 合同管理 详情

class MaternityModule extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from={urls.MATERNITY} to={urls.MATER_SCHEDULE_MANAGE} />
          <Route exact path={urls.MATER_SCHEDULE_MANAGE} component={MaterScheduleManage} />
          <Route exact path={urls.MATER_BATCH_MANAGE} component={MaterBatchManage} />
          <Route exact path={urls.MATER_DUTY_MANAGE} component={MaterDutyManage} />

          {/* 会员管理*/}
          <Route exact path={urls.MATER_CUSTOMER_MANAGE} component={MaterCustomerManage} />
          <Route exact={false} path={urls.CUSTOMER_ADD} component={AddIndex} />
          <Route exact={false} path={`${urls.CUSTOMER_SEE}/:showType/:id/:type/:customerType`} component={AddIndex} />
          <Route exact path={`${urls.CUSTOMER_EDIT}/:showType/:id/:type`} component={AddIndex} />
          <Route exact path={`${urls.CUSTOMER_FOLLOW}/:id`} component={CustomerProcess} />
          <Route exact path={`${urls.CUSTOMER_EDIT_BABY}/:id/`} component={BabyCustomer} />
          <Route exact path={`${urls.CUSTOMER_CONSUME_DETAIL}/:id`} component={ConsumeDetail} />
          <Route exact path={`${urls.CUSTOMER_CHECK_DETAIL}/:id`} component={CheckDetail} />
          <Route exact path={`${urls.CUSTOMER_CONTRACT_INFO}/:id`} component={ContractInfo} />

          {/* 房间管理*/}
          <Route exact path={urls.MATER_ROOM_EXTEND_RECORD_INDEX} component={MaterExtendRecord} />
          <Route exact path={`${urls.MATER_MANAGE_CHECK_ROOM_DETAIL}/:id/:type`} component={MaterExtendDetail} />
          <Route exact path={urls.MATER_MANAGE_CHECK_RECORD_INDEX} component={MaterCheckRecord} />
          <Route exact path={`${urls.MATER_MANAGE_CHECK_ROOM}/:type/:id/:roomId`} component={MaterCheckRoom} />
          {/* 等级管理*/}
          <Route exact path={urls.MATER_GRADE_MANAGE} component={MaterGradeManage} />
          {/* 房间管理*/}
          <Route exact path={urls.MATER_ROOM_INFO} component={RoomInfo} />
          <Route exact path={`${urls.MATER_ROOM_INFO_APPOINTMENT}/:roomId`} component={Appointment} />
          <Route exact path={`${urls.MATER_ROOM_CHANGE_RECORD_EDIT}/:recordAuditId`} component={UpdChangeRecord} />

          <Route exact path={`${urls.ROOM_INFO_MATER_ROOM_CHANGE_RECORD}/:recordId`} component={CheckChange} />
          <Route exact path={`${urls.MATER_ROOM_INFO_CHECKIN}/:roomId`} component={CheckIn} />
          <Route exact path={`${urls.MATER_ROOM_INFO_CHECKOUT}/:recordId`} component={CheckOut} />
          <Route exact path={urls.MATER_ROOM_MANAGE} component={MaterRoomManage} />
          <Route exact path={urls.MATER_ROOM_CHANGE_RECORD} component={MaterChangeRecord} />
          <Route exact path={`${urls.ROOM_INFO_MATER_ROOM_CONTINUED_REDUCK}/:recordId`} component={ContinuedRoom} />

          <Route exact path={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CHECKIN}/:roomId`} component={CheckIn} />
          <Route exact path={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CHECKOUT}/:recordId`} component={CheckOut} />
          <Route exact path={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_ROOMCHANGE}/:recordId`} component={CheckChange} />
          <Route exact path={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CONTINUEDREDUCK}/:recordId`} component={ContinuedRoom} />

          <Route exact path={`${urls.ROOM_INFO_AGTER_RESERVATION_CHECK_IN}/:recordId`} component={AfterReservationCheckIn} />

          {/* 套餐管理*/}
          <Route exact path={urls.MATER_PACKAGES} component={PackageList} />
          <Route exact path={urls.MATER_PACKAGES_ADD} component={PackageAdd} />
          <Route path={`${urls.MATER_PACKAGES_SEE}/comboNo/:comboNo`} component={PackageSee} />
          <Route path={`${urls.MATER_PACKAGES_SEE}/:id`} component={PackageSee} />
          <Route exact path={`${urls.MATER_PACKAGES_EDIT}/:id`} component={PackageEdit} />

          {/* 服务管理*/}
          <Route exact path={urls.MATER_SERVICE} component={ServiceList} />
          <Route exact path={urls.MATER_SERVICE_ADD} component={ServiceAdd} />
          <Route path={`${urls.MATER_SERVICE_SEE}/:id`} component={ServiceSee} />
          <Route exact path={`${urls.MATER_SERVICE_EDIT}/:id`} component={ServiceEdit} />

          {/* 合同管理*/}
          <Route exact path={urls.MATER_CONTRACT} component={ContractList} />
          <Route exact path={urls.MATER_CONTRACT_ADD} component={ContractAdd} />
          <Route exact path={`${urls.MATER_CONTRACT_EDIT}/:contractId`} component={ContractEdit} />
          <Route exact path={`${urls.MATER_CONTRACT_DETAIL}/:contractId`} component={ContractDetail} />
          <Route exact path={`${urls.MATER_CONTRACT_DETAIL}/contractNum/:contractNum`} component={ContractDetail} />
        </Switch>
      </div>
    )
  }
}

export default MaternityModule
