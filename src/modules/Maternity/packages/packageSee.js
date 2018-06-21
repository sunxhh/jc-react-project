import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import moment from 'moment'
import DescriptionList from 'Components/DescriptionList'

const { Description } = DescriptionList
class PackageSee extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 默认props
  static defaultProps = {
    detail: {},
    comboTypeList: [],
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.id) {
      dispatch(actions.detail({ id: match.params.id }))
    } else if (match.params && match.params.comboNo) {
      dispatch(actions.detail({ comboNo: match.params.comboNo, id: -1 }))
    }
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
    const { comboTypeList, detail } = this.props
    return (
      <div>
        <DescriptionList size='large' title='套餐基础信息'>
          <Description term='套餐编号'>{detail.comboNo}</Description>
          <Description term='套餐名称'>{detail.comboName}</Description>
          <Description term='套餐类型'>{this._getDictValue(comboTypeList, detail.comboType)}</Description>
          <Description term='套餐金额'>{detail.comboPrice}</Description>
          <Description term='创建人'>{detail.createUserName}</Description>
          <Description term='创建时间'>{moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
          <Description term='服务项目'>{detail.serviceBeanList && detail.serviceBeanList.map(item => item.serviceName).join('；')}</Description>
          <Description term='环境服务'>{detail.environService}</Description>
          <Description term='描述'>{detail.remark}</Description>
        </DescriptionList>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    detail: state.packages.detail,
    comboTypeList: state.packages.comboTypeList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(PackageSee)
