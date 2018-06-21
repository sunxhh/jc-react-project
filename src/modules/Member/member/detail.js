import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Card, Row, Col, Form, Radio, Avatar, Tag, Tabs, Table, Button } from 'antd'
import Module from './module'
import moment from 'moment'
import storage from 'Utils/storage'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'
import DescriptionList from 'Components/DescriptionList'
import { genPagination } from 'Utils/helper'
import { educationTypes, certTypes, regSourceTypes, genderTypes } from './dict'
import PetInfo from './petInfo'

const Meta = Card.Meta
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { Description } = DescriptionList
const TabPane = Tabs.TabPane

const petOrgCode = 'jcpet'

class MemberDetail extends Component {
  constructor(props) {
    super(props)
    const userInfo = storage.get('userInfo')
    this.state = {
      coverImages: [], // 货物封面图片
      userId: '',
      orgCode: '', // 默认产业Code
      previewVisible: false,
      previewImage: '',
      area: [],
      customFieldst: [],
      basicInfo: {},
      orgMemeberInfo: {},
      integraDetail: {},
      integraPage: {},
      orgLevel: userInfo.orgLevel,
      showPetModal: false,
      petInfo: {},
      petOpenId: undefined,
    }
  }

  componentWillMount() {
    const { match, dispatch } = this.props
    const userId = match.params.userId
    const { orgLevel } = this.state
    this.setState({
      userId: userId
    })
    dispatch(Module.actions.getBasicDetail({ userId })).then(res => {
      if (res.status === 'success') {
        this.setState({
          basicInfo: res.result
        }, () => {
          let orgList = !isEmpty(res.result) ? res.result.orgList : ''
          let orgCode = ''
          if (!isEmpty(orgList)) {
            // 超级管理员默认选中第一个
            if (orgLevel === '0') {
              orgCode = orgList[0].orgCode
            } else {
              orgCode = res.result.currentOrgCode
            }
            dispatch(Module.actions.getOrgMemberDetail({ userId, orgCode })).then(res => {
              if (res.status === 'success') {
                this.setState({
                  orgCode,
                  orgMemeberInfo: res.result
                })
              }
            })
            dispatch(Module.actions.getIntegraDetail({ userId, orgCode, currentPage: 1, pageSize: 10 })).then(res => {
              if (res.status === 'success') {
                this.setState({
                  integraDetail: res.result.data,
                  integraPage: {
                    pageNo: isEmpty(res.result) ? '' : res.result.pageNo,
                    pageSize: isEmpty(res.result) ? '' : res.result.pageSize,
                    records: isEmpty(res.result) ? '' : res.result.records,
                    pages: isEmpty(res.result) ? '' : res.result.pages,
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  _handleChange = (e) => {
    let orgCode = e.target.value
    const { dispatch, match } = this.props
    const userId = match.params.userId
    dispatch(Module.actions.getOrgMemberDetail({ userId, orgCode })).then(res => {
      if (res.status === 'success') {
        this.setState({
          orgCode,
          orgMemeberInfo: res.result
        })
      }
    })
    dispatch(Module.actions.getIntegraDetail({ userId, orgCode, currentPage: 1, pageSize: 10 })).then(res => {
      if (res.status === 'success') {
        this.setState({
          integraDetail: res.result.data,
          integraPage: {
            pageNo: isEmpty(res.result) ? '' : res.result.pageNo,
            pageSize: isEmpty(res.result) ? '' : res.result.pageSize,
            records: isEmpty(res.result) ? '' : res.result.records,
            pages: isEmpty(res.result) ? '' : res.result.pages,
          }
        })
      }
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { dispatch } = this.props
    const { integraPage, orgCode, userId } = this.state
    const { current, pageSize } = pagination
    dispatch(Module.actions.getIntegraDetail({ userId, orgCode, currentPage: integraPage.pageSize !== pageSize ? 1 : current, pageSize: pageSize })).then(res => {
      if (res.status === 'success') {
        this.setState({
          integraDetail: res.result.data,
          integraPage: {
            pageNo: res.result.pageNo,
            pageSize: res.result.pageSize,
            records: res.result.records,
            pages: res.result.pages,
          }
        })
      }
    })
  }

  columns = [
    {
      title: '积分日期',
      dataIndex: 'createTime',
    },
    {
      title: '积分明细',
      dataIndex: 'sourceDesc',
    },
    {
      title: '积分数',
      dataIndex: 'originPoint',
      render(text, record) {
        if (record.optionType === '1') {
          return <span style={{ color: 'green' }}>+ {text}</span>
        } else if (record.optionType === '2') {
          return <span style={{ color: 'red' }}>- {text}</span>
        }
      }
    },
    {
      title: '积分过期',
      dataIndex: 'effectiveDate',
      render(effectiveDate, record) {
        if (isEmpty(effectiveDate) && record.effectiveDateType === '1') {
          return '永久有效'
        } else if (record.effectiveDateType === '1' && !isEmpty(effectiveDate)) {
          return moment(effectiveDate).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
  ]

  _getCustomFields = () => {
    const { orgMemeberInfo } = this.state
    if (!isEmpty(orgMemeberInfo.customFields)) {
      orgMemeberInfo.customFields = orgMemeberInfo.customFields.map(customField => {
        const field = isEmpty(orgMemeberInfo.fieldExtInfo) ? undefined : orgMemeberInfo.fieldExtInfo.find(info => {
          return info.fieldName === customField.fieldName
        })
        customField['fieldValue'] = !isEmpty(field) && !isEmpty(field['fieldValue']) ? field['fieldValue'] : []
        customField['fieldValueDetail'] = !isEmpty(field) && !isEmpty(field['fieldValueDetail']) ? field['fieldValueDetail'] : []
        customField['id'] = !isEmpty(field) && !isEmpty(field['id']) ? field['id'] : ''
        return customField
      })
    }
    return (isEmpty(orgMemeberInfo) || isEmpty(orgMemeberInfo.customFields)) ? <div /> : orgMemeberInfo.customFields.map(item => {
      let str = isEmpty(item.fieldValueDetail) ? (isEmpty(item.fieldValue) ? '' : item.fieldValue.join(',')) : item.fieldValueDetail.join(',')
      str = (item.componentType === '5' && str !== '') ? moment(str).format('YYYY-MM-DD') : str
      return (
        <Description key={item.fieldId} term={item.fieldLabel} column='1'>
          {str}
        </Description>
      )
    })
  }

  // 宠物会员单独处理
  _handleViewPet = () => {
    const { dispatch } = this.props
    const { basicInfo } = this.state
    dispatch(Module.actions.getPetInfo({ userNo: basicInfo.userId })).then(res => {
      if (res.status === 'success') {
        const petOpenId = (!isEmpty(res.result) && !isEmpty(res.result.memberInfo)) ? res.result.memberInfo.openId : undefined
        this.setState({ petInfo: res.result, showPetModal: true, petOpenId })
      }
    })
  }

  // 组件内部设置状态
  _setPetInfo = (data) => {
    this.setState(data)
  }

  render() {
    const { basicInfo, orgMemeberInfo, integraDetail, integraPage, orgLevel, showPetModal, petInfo, orgCode, petOpenId } = this.state
    const pagination = genPagination(integraPage)
    const orgList = isEmpty(basicInfo) ? [] : basicInfo.orgList
    const orgRadioButton = (orgLevel !== '0')
      ? (
        !isEmpty(orgList) && (
          <RadioGroup size='small' defaultValue={basicInfo.currentOrgCode}>
            {
              <RadioButton key={basicInfo.currentOrgCode} value={basicInfo.currentOrgCode}>
                {orgList.map(item => {
                  if (item.orgCode === basicInfo.currentOrgCode) {
                    return item.orgName
                  }
                }).join('')}
              </RadioButton>
            }
          </RadioGroup>
        )
      )
      : (
        !isEmpty(orgList) && (
          <RadioGroup defaultValue={orgList[0].orgCode} size='small' onChange={this._handleChange}>
            {
              orgList && orgList.map(item => (
                <RadioButton style={{ float: 'left' }} key={item.orgCode} value={item.orgCode}>{item.orgName}</RadioButton>
              ))
            }
          </RadioGroup>
        )
      )

    const baseInfoTags =
      !isEmpty(basicInfo) && !isEmpty(basicInfo.orgList) && basicInfo.orgList.map((item) => (
        <Tag style={{ float: 'left' }} key={item.orgCode} color='blue'>{item.orgName}</Tag>
      ))
    let locationArr = []
    if (!isEmpty(basicInfo) && !isEmpty(basicInfo.location)) {
      locationArr = basicInfo.location.map(item => {
        return Object.values(item)[0]
      })
    }
    const education = (!isEmpty(basicInfo) && !isEmpty(basicInfo.education)) ? educationTypes.filter((item) => item.value === basicInfo.education) : []
    const gender = (!isEmpty(basicInfo) && !isEmpty(basicInfo.gender)) ? genderTypes.filter((item) => item.value === basicInfo.gender) : []
    return (
      <div>
        <Meta
          style={{ marginBottom: '20px' }}
          avatar={<Avatar src={!isEmpty(basicInfo) && !isEmpty(basicInfo.avatarUrl) ? basicInfo.avatarUrl : ''} />}
          title={
            <div>
              <div style={{ float: 'left', marginRight: 10 }}>
                {!isEmpty(basicInfo) ? basicInfo.userName : ''}
              </div>
              <div>
                {baseInfoTags}
              </div>
            </div>
          }
          description={<span>{!isEmpty(basicInfo) && basicInfo.isWithin === '1' ? (basicInfo.employeeNo ? '内部员工  ' + basicInfo.employeeNo : '内部员工') : '' }</span>}
        />
        <Card
          title='基本信息'
          style={{ marginBottom: 15 }}
          bordered={false}
        >
          <DescriptionList size='large' >
            <Description term='用户ID'>
              {!isEmpty(basicInfo) ? basicInfo.userId : ''}
            </Description>
            <Description term='联系方式'>
              {!isEmpty(basicInfo) ? basicInfo.mobileNo : ''}
            </Description>
            <Description term='学历'>
              {isEmpty(education) ? '' : education[0].name}
            </Description>
            <Description term='出生日期'>
              {(!isEmpty(basicInfo) && !isEmpty(basicInfo.birthday)) ? moment(basicInfo.birthday).format('YYYY-MM-DD') : ''}
            </Description>
            <Description term='性别'>
              {isEmpty(gender) ? '' : gender[0].name}
            </Description>
            <Description term='地区'>
              {!isEmpty(locationArr) ? locationArr.join(', ') : ''}
            </Description>
            <Description term='住址'>
              {!isEmpty(basicInfo) ? basicInfo.address : ''}
            </Description>
            <Description term='邮编'>
              {!isEmpty(basicInfo) ? basicInfo.zipCode : ''}
            </Description>
            <Description term='固定电话'>
              {!isEmpty(basicInfo) ? basicInfo.telephone : ''}
            </Description>
            <Description term='电子邮件'>
              {!isEmpty(basicInfo) ? basicInfo.email : ''}
            </Description>
            <Description term='证件类型'>
              {!isEmpty(basicInfo) && !isEmpty(basicInfo.certType) ? certTypes.filter((item) => item.value === basicInfo.certType)[0].name : ''}
            </Description>
            <Description term='证件号码'>
              {!isEmpty(basicInfo) ? basicInfo.certNo : ''}
            </Description>
            <Description term='会员卡号'>
              {!isEmpty(basicInfo) ? basicInfo.memCardNo : ''}
            </Description>
            <Description term='创建时间'>
              {(!isEmpty(basicInfo) && !isEmpty(basicInfo.regTime)) ? moment(basicInfo.regTime).format('YYYY-MM-DD') : ''}
            </Description>
            <Description term='入会方式'>
              {!isEmpty(basicInfo) && !isEmpty(basicInfo.regSource) ? regSourceTypes.filter((item) => item.value === basicInfo.regSource)[0].name : ''}
            </Description>
            <Description term='人脸识别'>
              {
                !isEmpty(basicInfo) && basicInfo.faceImageUrl ? (
                  <img
                    style={{ width: '32px', height: '32px' }}
                    src={basicInfo.faceImageUrl}
                  />
                ) : ''
              }
            </Description>
          </DescriptionList>
        </Card>
        <Card
          className={styles.card}
          title={
            <div>
              <div style={{ float: 'left', marginRight: 10 }}>产业会员信息</div>
              <div>{orgRadioButton}</div>
            </div>
          }
          bordered={false}
        >
          <DescriptionList col='1' >
            <Description term='会员等级' column='1'>
              {orgMemeberInfo.memberLevel}
            </Description>
            {
              isEmpty(orgMemeberInfo)
                ? <Description term='适用门店' column='1' />
                : <Description term='适用门店' column='1'>
                  {
                    orgMemeberInfo.shopAllFlag === '1'
                      ? '全部门店'
                      : (!isEmpty(orgMemeberInfo.shopList) ? orgMemeberInfo.shopList.map(shop => { return shop.shopName }).join(', ') : '')
                  }
                </Description>
            }
            <Description term='会员有效期' column='1'>
              {orgMemeberInfo.dateLimit === '0' ? '永久有效' : (!isEmpty(orgMemeberInfo.expireTime) ? moment(orgMemeberInfo.expireTime).format('YYYY-MM-DD') : '')}
            </Description>
            <Description term='加入时间' column='1'>
              { (!isEmpty(orgMemeberInfo) && orgMemeberInfo.joinTime) ? moment(orgMemeberInfo.joinTime).format('YYYY-MM-DD') : ''}
            </Description>
            {this._getCustomFields()}
          </DescriptionList>
          {
            ((orgCode && orgCode === petOrgCode) ||
            (!orgCode && !isEmpty(basicInfo.orgList) && basicInfo.orgList[0].orgCode === petOrgCode)) &&
            <Button onClick={this._handleViewPet}>查看宠物信息</Button>
          }
          <Row>
            <Col>
              <Tabs defaultActiveKey='1'>
                <TabPane tab='积分明细' key='1'>
                  <Table
                    style={{ width: '100%' }}
                    className={styles['c-table-center']}
                    columns={this.columns}
                    rowKey={(item, index) => index}
                    dataSource={isEmpty(integraDetail) ? [] : integraDetail}
                    onChange={this._handlePageChange}
                    pagination={pagination}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
        <PetInfo
          showPetModal={showPetModal}
          petInfo={petInfo}
          setPetInfo = {this._setPetInfo}
          userNo={basicInfo.userId}
          petOpenId={petOpenId}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.member'],
    auths: state['common.auths'],
    aliToken: state['common.aliToken'],
  }
}

export default connect(['common.showListSpin', 'memberCenter.member', 'common.auths', 'common.aliToken'], mapStateToProps)(Form.create()(MemberDetail))
