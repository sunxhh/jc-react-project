import React, { Component } from 'react'
import { Card, Row, Button, Col, Tag, Icon } from 'antd'
import { Link } from 'react-router-dom'
import style from './style.less'
import { connect } from 'react-redux'
import { getTemplateDetail, getDictionary, getOrgList, getBusinessTypeList, deleteTemplateDetailCache } from './reduck'
import { isEmpty } from 'Utils/lang'
import { ORDER_CENTER_TEMPLATE_ADD } from 'Global/urls'
import { arrayToMap } from 'Utils/helper'

class TemplateDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      templateNo: this.props.match.params.id
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this.props.dispatch(getDictionary({ codeKeys: ['orderType', 'ladingType', 'pinCode'] }))
    this.props.dispatch(getTemplateDetail({ templateNo: this.state.templateNo }))
    this.props.dispatch(getOrgList({ 'org': { 'orgMod': 1, 'orgLevel': 1 }}))
    this.props.dispatch(getBusinessTypeList())
  }

  componentWillUnmount() {
    this.props.dispatch(deleteTemplateDetailCache())
  }

  _getBusinessTypeName = (parentBusinessTypeCode, businessTypeCode) => {
    const { businessTypeList } = this.props
    if (!parentBusinessTypeCode) {
      return ''
    }
    const parentBusinessType = businessTypeList.filter(type => String(type.code) === String(parentBusinessTypeCode))[0]
    if (!parentBusinessType) {
      return ''
    }
    const businessType = parentBusinessType.children && parentBusinessType.children.filter(type => String(type.code) === String(businessTypeCode))[0]
    if (!businessType) {
      return ''
    }
    return `${parentBusinessType.name}/${businessType.name}`
  }

  render() {
    const { detail } = this.props
    if (isEmpty(detail)) {
      return <Card>暂无数据</Card>
    }

    const { dictionary, org } = this.props
    const orderType = dictionary && dictionary.orderType || []
    const orderTypeMap = arrayToMap(orderType, 'value')

    const ladingType = dictionary && dictionary.ladingType || []
    const ladingTypeMap = arrayToMap(ladingType, 'value')

    const pinCode = dictionary && dictionary.pinCode || []
    const pinCodeMap = arrayToMap(pinCode, 'value')

    // 把对象数组转成以value为key的键值对象
    const orgMap = arrayToMap(org || [], 'value')

    return (
      <Card title='模板详情' extra={<a href='javascript:;' onClick={() => history.go(-1)} className={style['goback']}><Icon type='rollback' />返回</a>}>
        <Row>
          <Col span={3}><p>模板名称：</p></Col>
          <Col span={6}><p>{detail.templateName}</p></Col>
        </Row>
        <Row>
          <Col span={12}>
            <Col span={6}><p>模板编号：</p></Col>
            <Col span={18}><p>{detail.templateNo}</p></Col>
          </Col>
          <Col span={12}>
            <Col span={6}><p>状态：</p></Col>
            <Col span={18}><Tag color='orange'>{detail.status ? '已启用' : '未启用'}</Tag></Col>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Col span={6}><p>订单类型：</p></Col>
            <Col span={18}><p>{orderTypeMap[detail.orderType] &&
              orderTypeMap[detail.orderType].name}</p></Col>
          </Col>
          <Col span={12}>
            <Col span={6}><p>所属机构：</p></Col>
            <Col span={18}><p>{orgMap[detail.organizationType] &&
              orgMap[detail.organizationType].name}</p></Col>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Col span={6}><p>提单类型：</p></Col>
            <Col span={18}><p>{ladingTypeMap[detail.ladingType] &&
              ladingTypeMap[detail.ladingType].name}</p></Col>
          </Col>
          <Col span={12}>
            <Col span={6}><p>商品类型：</p></Col>
            <Col span={18}><p>{this._getBusinessTypeName(detail.parentBusinessType, detail.businessType)}</p></Col>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Col span={6}><p>Pin码：</p></Col>
            <Col span={18}><p>{pinCodeMap[detail.pinCode] &&
              pinCodeMap[detail.pinCode].name}</p></Col>
          </Col>
          <Col span={12}>
            <Col span={6}><p>订单有效期：</p></Col>
            <Col span={18}><p>{detail.availableDate}小时</p></Col>
          </Col>
        </Row>
        <Row>
          <Col span={24}><p className={style['position-fix']}>审核设置</p></Col>
          <Col span={3}><p>退款审核:</p></Col>
          <Col span={12}><span>{ detail.refundFlag === 1 ? '开' : '关' }</span>
            {
              detail.refundFlag === 1 && <span>：<Tag color='orange'>高于{detail.refundAmount}元，需要进行审核</Tag></span>
            }
          </Col>
        </Row>
        {
          detail.status === 0 &&
          <Row type='flex' justify='center'>
            <Link className={style['distance-fix']} to={`${ORDER_CENTER_TEMPLATE_ADD}/${this.state.templateNo}`}>
              <Button type='primary'>修改</Button>
            </Link>
          </Row>
        }
      </Card>
    )
  }
}
const mapStateToProps = state => {
  return {
    detail: state.orderCenter.template.templateDetail,
    dictionary: state.orderCenter.template.dictionary,
    org: state.orderCenter.template.orgList,
    businessTypeList: state.orderCenter.template.businessTypeList,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(TemplateDetail)
