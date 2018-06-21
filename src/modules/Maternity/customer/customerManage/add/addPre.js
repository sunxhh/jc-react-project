import React, { Component } from 'react'
import { Form, Table, Row, Col, Cascader, Popover } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import moment from 'moment'
import Title from './Title'
import styles from './index.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
// 预产信息详情页面
class AddPre extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isShowType: this.props.match.params.type,
      isSeeInfo: false
    }
  }

  _isSeeInfo = () => {
    if (this.state.isShowType === 'see') {
      this.setState({
        isSeeInfo: true
      })
    }
  }

  componentWillMount() {
    if (this.state.isShowType === 'edit' || this.state.isShowType === 'see') {
      this._isSeeInfo()
      this.props.dispatch(actions.getPreInfo({ customerId: this.props.match.params.id }))
      this.props.dispatch(actions.getCityList())
    }
    this.props.dispatch(actions.getCityList())
  }

  disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate())
    let currDate = moment(current).format('YYYY-MM-DD')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  _isSex = (sex) => {
    return sex === '1' ? '男' : '女'
  }

  _columns = [
    {
      key: 'name',
      title: '宝宝名',
      dataIndex: 'name',
    },
    {
      key: 'sex',
      title: '宝宝性别',
      dataIndex: 'sex',
      render: (text, record) => {
        return (
          <span>{ record.sex !== null ? this._isSex(record.sex) : '' }</span>
        )
      }
    },
    {
      key: 'babyBirthday',
      title: '宝宝生日',
      dataIndex: 'babyBirthday',
      render: (text, record) => {
        return (
          <span>{record.birthday && moment(record.birthday).format('YYYY-MM-DD')}</span>
        )
      }
    },
    {
      key: 'babyRemark',
      title: '备注',
      dataIndex: 'babyRemark',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text && text !== 'null' && text}</div>}
            title='服务名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
          </Popover>
        )
      }
    },
  ]
  _renderBabyInfo = (preInfo) => {
    return (
      <div>
        <Title txt='宝宝信息' />
        <Table
          columns={this._columns}
          dataSource={preInfo.babyList || []}
          rowKey={(item, index) => index}
          bordered={true}
          pagination={false}
        />
      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { cityList } = this.props
    let preInfo = {}
    let defaultCity = []
    if (location.pathname === `/maternity/materCustomerManage/add/pre`) {
      preInfo = {}
    } else {
      preInfo = this.props.preInfo
      defaultCity = [preInfo.provCode, preInfo.cityCode, preInfo.distCode]
    }
    return (
      <div>
        <Form id='expectedTime'>
          <Title txt='预产基本信息' />
          <Row>
            <Col span={8}>
              <p>预产期：{preInfo.expectedTime && moment(preInfo.expectedTime).format('YYYY-MM-DD')}</p>
            </Col>
            <Col span={8}>
              <p>预产医院：{preInfo.hospital}</p>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='预产医院地址'
              >
                {getFieldDecorator('residence', {
                  initialValue: defaultCity,
                })(
                  <Cascader
                    options={cityList}
                    disabled={this.state.isSeeInfo}
                    getCalendarContainer={() => document.getElementById('expectedTime')}
                    placeholder={this.state.isShowType === 'see' ? ' ' : '请选择省市区'}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col
              span={8}
            >
              <p>详细地址：{preInfo.hospitalAddress}</p>
            </Col>
            <Col span={8}>
              <p>胎次：{preInfo.pregnantCount}</p>
            </Col>
            <Col span={8}>
              <p>已有宝宝数：{preInfo.babyCount}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <p>预产期备注：{preInfo.remark}</p>
            </Col>
          </Row>
          {this._renderBabyInfo(preInfo)}
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    preInfo: state.customerManage.getPreInfo,
    getSaveData: state.customerManage.getSaveData,
    cityList: state.customerManage.getCityList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddPre))
