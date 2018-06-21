import React, { Component } from 'react'
import { Row, Button } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
import moment from 'moment'
import DescriptionList from 'Components/DescriptionList'

const { Description } = DescriptionList
const statusType = {
  '0': '无效',
  '1': '有效'
}
class ServiceSee extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 默认props
  static defaultProps = {
    detail: {},
    serviceClassList: [],
    serviceTypeList: [],
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(actions.detail({ id: match.params.id }))
    dispatch(actions.listConditions())
  }

  // 获取套餐类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  render() {
    const { detail, serviceClassList, serviceTypeList } = this.props
    return (
      <div>
        <DescriptionList size='large' title='服务基础信息'>
          <Description term='服务名称'>{detail.serviceName}</Description>
          <Description term='服务类型'>{this._getDictValue(serviceTypeList, detail.serviceType)}</Description>
          <Description term='服务分类'>{this._getDictValue(serviceClassList, detail.serviceClass)}</Description>
          <Description term='服务价格'>{detail.servicePrice}</Description>
          <Description term='服务状态'>{statusType[detail.status]}</Description>
          <Description term='创建人'>{detail.createUserName}</Description>
          <Description term='创建时间'>{moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
          <Description term='描述'>{detail.remark}</Description>
        </DescriptionList>
        <Row className={styles['handle-box']}>
          <Button
            type='primary'
            onClick={() => history.go(-1)}
          >返回
          </Button>
        </Row>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    detail: state.service.detail,
    serviceClassList: state.service.serviceClassList,
    serviceTypeList: state.service.serviceTypeList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSee)
