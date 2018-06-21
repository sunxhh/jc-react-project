import React, { Component } from 'react'
import { Form, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from '../index.less'

const FormItem = Form.Item
class ConsumeDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 默认props
  static defaultProps = {
    consumeDetail: {},
    consumeStatusList: []
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getConsumeDetail({ consumeId: match.params.id }))
  }

  // 获取字典方法
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }
  render() {
    const { consumeDetail } = this.props
    return (
      <div>
        <Form>
          <div className={styles['title']}><p>客户信息</p></div>
          <Row>
            <Col
              span={16}
            >
              <p>{consumeDetail.planService && consumeDetail.planService.customerType === '0' ? '宝宝姓名' : '妈妈姓名'}：{consumeDetail.customerName}</p>
            </Col>
            <Col
              span={8}
            >
              {consumeDetail.planService && consumeDetail.planService.customerType === '0' ? (
                <a
                  target='_blank'
                  href={`/maternity/materCustomerManage/see/seeBasic/${consumeDetail.customerId}/see/0`}
                >
                  查看宝宝信息
                </a>
              ) : (
                <a
                  target='_blank'
                  href={`/maternity/materCustomerManage/see/seeBasic/${consumeDetail.customerId}/see/1`}
                >
                    查看妈妈信息
                </a>
              )
              }

            </Col>
          </Row>
          <div className={styles['title']}><p>消费信息</p></div>
          <Row>
            <Col
              span={24}
            >
              <p>流水编号：{consumeDetail.serialNo}</p>
              <p>消费时间：{consumeDetail.consumeTime}</p>
              <p>消费状态：{this._getDictValue(this.props.consumeStatusList, consumeDetail.status)}</p>
              <p>消费金额：{consumeDetail.amount}</p>
              <p className={styles['white-space']}><span>消费内容：</span>{consumeDetail.content}</p>
              <p className={styles['white-space']}><span>消费备注：</span>{consumeDetail.remark}</p>
            </Col>
          </Row>
          <div className={styles['title']}><p>服务人员</p></div>
          <Row>
            <Col
              span={24}
            >
              <p>人员姓名：{consumeDetail.planService && consumeDetail.planService.servicePersonalName}</p>
            </Col>
          </Row>
          <div className={styles['title']}><p>创建人员</p></div>
          <Row>
            <Col
              span={24}
            >
              <p>创建人：{consumeDetail.createUserName}</p>
              <p>创建时间：{consumeDetail.createTime}</p>
            </Col>
          </Row>
          <Row>
            <FormItem className={styles['handle-box']}>
              <Button
                type='primary'
                onClick={() => history.go(-1)}
              >返回
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    consumeDetail: state.customerManage.consumeDetail,
    consumeStatusList: state.customerManage.consumeConditions.consumeStatusList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ConsumeDetail))
