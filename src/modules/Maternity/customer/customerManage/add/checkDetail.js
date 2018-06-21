import React, { Component } from 'react'
import { Form, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from '../index.less'

const FormItem = Form.Item
class CheckDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 默认props
  static defaultProps = {
    checkDetail: {},
    customerTypeList: [],
    statusList: []
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getCheckDetail({ recordId: match.params.id }))
    this.props.dispatch(actions.getProcessConditions())
    this.props.dispatch(actions.checkStatusList({ status: '0' }))
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
    const { checkDetail } = this.props
    return (
      <div>
        <Form>
          <div className={styles['title']}><p>客户信息</p></div>
          <Row>
            <Col
              span={16}
            >
              <p>妈妈姓名：{checkDetail.customerName}</p>
            </Col>
            <Col
              span={8}
            >
              <a
                target='_blank'
                href={`/maternity/materCustomerManage/see/seeBasic/${checkDetail.customerId}/see/1`}
              >
                查看妈妈信息
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              span={16}
            >
              <p>会员类型：{this._getDictValue(this.props.customerTypeList, checkDetail.customerType)}</p>
            </Col>
          </Row>
          <div className={styles['title']}><p>入住信息</p></div>
          <Row>
            <Col
              span={16}
            >
              <p>合同编号：{checkDetail.contractNum}</p>
            </Col>
            <Col
              span={8}
            >
              <a
                target='_blank'
                href={`/maternity/contract/detail/contractNum/${checkDetail.contractNum}`}
              >
                查看合同
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              span={16}
            >
              <p>入住房间：{checkDetail.roomNum}</p>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
            >
              <p>消费日期：{checkDetail.checkinTime}</p>
              <p>退房日期：{checkDetail.checkoutTime}</p>
              <p>入住天数：{checkDetail.checkinDateNum}</p>
              <p>入住状态：{this._getDictValue(this.props.statusList, checkDetail.status)}</p>
            </Col>
          </Row>
          <Row>
            <Col
              span={16}
            >
              <div className={styles['white-space']}>
                <span>是否转房：</span>
                <div>
                  {checkDetail.changeRoomList && checkDetail.changeRoomList.map((item, index) => {
                    return (
                      <p key={index}>
                        {index + 1}：由 “{ item.oldRecordDTO.roomNum }” 转房至 “{ item.newRecordDTO.roomNum }”
                      </p>)
                  })}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              span={16}
            >
              <div className={styles['white-space']}>
                <span>是否续房：</span>
                <div>
                  {checkDetail.continuedRoomList && checkDetail.continuedRoomList.map((item, index) => {
                    return (
                      <p key={index}>
                        {index + 1}：由 “{ item.newRecordDTO.startTime }” 续房至 “{ item.newRecordDTO.endTime }”
                      </p>)
                  })}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={styles['white-space']}><span>入住说明：</span>{checkDetail.remark}</p>
            </Col>
          </Row>
          <div className={styles['title']}><p>创建人员</p></div>
          <Row>
            <Col
              span={24}
            >
              <p>创建人：{checkDetail.createUser}</p>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
            >
              <p>创建时间：{checkDetail.createTime}</p>
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
    checkDetail: state.customerManage.checkDetail,
    customerTypeList: state.customerManage.processConditions.customerTypeList,
    statusList: state.customerManage.statusList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CheckDetail))
