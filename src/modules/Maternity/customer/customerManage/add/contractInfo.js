import React, { Component } from 'react'
import { Form, Row, Col, Button } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from '../index.less'

const FormItem = Form.Item
class ContractInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.match.params.id,
    }
  }

  // 默认props
  static defaultProps = {
    contractInfo: {},
    contractStatusList: []
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getContractInfo({ contractId: match.params.id }))
    this.props.dispatch(actions.getContractStatusList({ status: '0' }))
    this.props.dispatch(actions.getProcessConditions())
  }

  // 获取字典方法
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  _getcustomerTypeItem = (dictionary = [], customerType) => {
    const filterDic = dictionary.filter(dictionary => dictionary.customerType === customerType)
    if (filterDic.length > 0) {
      return filterDic[0]
    }
    return {}
  }

  render() {
    const { contractInfo } = this.props
    return (
      <div>
        <Form>
          <div className={styles['title']}><p>客户信息</p></div>
          <Row>
            <Col
              span={16}
            >
              <p>妈妈姓名：{this._getcustomerTypeItem(contractInfo.contractCustomerList, '1').customerName}</p>
            </Col>
            <Col
              span={8}
            >
              <a
                target='_blank'
                href={`/maternity/materCustomerManage/see/seeBasic/${this._getcustomerTypeItem(contractInfo.contractCustomerList, '1').customerId}/see/1`}
              >
                查看妈妈信息
              </a>
            </Col>
          </Row>
          <Row>
            <Col
              span={16}
            >
              <p>会员类型：{this._getDictValue(this.props.customerTypeList, this._getcustomerTypeItem(contractInfo.contractCustomerList, '1').customerType)}
              </p>
            </Col>
          </Row>
          <div className={styles['title']}><p>合同信息</p></div>
          <Row>
            <Col
              span={16}
            >
              <p>合同编号：{contractInfo.contractNum}</p>
              <p>签订时间：{contractInfo.signingTime}</p>
              <p>当事人：{this._getcustomerTypeItem(contractInfo.contractCustomerList, '1').customerName}</p>
              <p>跟进人：{this._getcustomerTypeItem(contractInfo.contractCustomerList, '1').processorName}</p>
              <p>合同金额：{contractInfo.contractAmount}</p>
              <p>合同状态 ：{this._getDictValue(this.props.contractStatusList, contractInfo.contractStatus)}</p>
              <p>入住天数 ：{contractInfo.agreementDTO && contractInfo.agreementDTO.stayDays}</p>
            </Col>
            <Col
              span={8}
            >
              <a
                target='_blank'
                href={`/maternity/contract/detail/contractNum/${contractInfo.contractNum}`}
              >
                查看合同
              </a>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={styles['white-space']}><span>合同说明：</span>{contractInfo.remark}</p>
            </Col>
          </Row>
          <div className={styles['title']}><p>创建人员</p></div>
          <Row>
            <Col
              span={24}
            >
              <p>创建人：{contractInfo.createUser}</p>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
            >
              <p>创建时间：{contractInfo.createTime}</p>
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
    contractInfo: state.customerManage.contractInfo,
    contractStatusList: state.customerManage.contractCodeDTO.contractStatusList,
    customerTypeList: state.customerManage.processConditions.customerTypeList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractInfo))
