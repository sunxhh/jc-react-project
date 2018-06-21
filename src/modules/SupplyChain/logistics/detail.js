import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Form, Input, Card, Table } from 'antd'
import * as actions from './reduck'
import { isEmpty } from 'Utils/lang'
import DescriptionList from 'Components/DescriptionList'

const { Description } = DescriptionList
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

class WaybillDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          waybillNo: values.waybillNo && values.waybillNo.trim(),
        }
        this.props.dispatch(actions.getWaybillDetail(newReqBean))
          .then(res => {
            if (res) {
              this.setState(
                {
                  visible: true
                }
              )
            } else {
              this.setState(
                {
                  visible: false
                }
              )
            }
          })
      }
    })
  }

  columns = [
    {
      key: 'operateTime',
      title: '操作时间',
      dataIndex: 'operateTime',
    },
    {
      key: 'statusInfo',
      title: '物流状态',
      dataIndex: 'statusInfo'
    },
    {
      key: 'trajectoryDetail',
      title: '轨迹详情',
      dataIndex: 'trajectoryDetail'
    }
  ]

  render() {
    const { getFieldDecorator } = this.props.form
    const { waybillDetail } = this.props
    const { visible } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={7}>
              <FormItem
                {...formItemLayout}
                label={'运单号:'}
              >
                {getFieldDecorator('waybillNo', {
                  rules: [{
                    required: true,
                    message: '请输入运单号',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={2} style={{ marginLeft: 10, marginTop: 4 }}>
              <Button type='primary' htmlType='submit'>查询</Button>
            </Col>
          </Row>
          <DescriptionList size='large' title='基础信息'>
            <Description term='收货人'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.receiveUserName : ''}
            </Description>
            <Description term='收货人电话'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.receiveUserTel : ''}
            </Description>
            <Description term='收货人地址'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.receiveUserProvince + waybillDetail.receiveUserCity + waybillDetail.receiveUserAddress : ''}
            </Description>
            <Description term='货物名称'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.goodsName : ''}
            </Description>
            <Description term='重量'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.weight : ''}
            </Description>
            <Description term='体积'>
              {!isEmpty(waybillDetail) && visible ? waybillDetail.volume : ''}
            </Description>
          </DescriptionList>
          <Card title='路由轨迹'>
            <Table
              columns={this.columns}
              dataSource={!isEmpty(waybillDetail) && !isEmpty(waybillDetail.trajectoryList) ? waybillDetail.trajectoryList : []}
              pagination={false}
            />
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    getSupplyShopList: state.supplyChain.logistics.getSupplyShopList,
    getLogisticsList: state.supplyChain.logistics.getLogisticsList,
    waybillDetail: state.supplyChain.logistics.waybillDetail,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WaybillDetail))
