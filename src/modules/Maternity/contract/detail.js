import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Form, Row, Col, Card, Popover } from 'antd'
import UploadList from './uploadList'
import {
  getListConditions,
  getQiniuToken,
  getContractDetail,
  resetContractDetail,
} from './reduck'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ContractDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      hasInit: false,
      momList: [],
      babyList: [],
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(getListConditions({ status: 0 }))
    if (match.params && match.params.contractId) {
      dispatch(getContractDetail({ contractId: match.params.contractId }))
    } else if (match.params && match.params.contractNum) {
      dispatch(getContractDetail({ contractNum: match.params.contractNum }))
    }
    dispatch(getListConditions({ status: 0 }))
    dispatch(getQiniuToken())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetContractDetail())
  }

  componentWillReceiveProps(nextProps) {
    const { contractInfo } = nextProps
    const { hasInit } = this.state
    let list = []
    if (!hasInit && contractInfo && contractInfo.firstPartyDTO && !isEmpty(contractInfo.firstPartyDTO.contractCustomerList)) {
      list = contractInfo.firstPartyDTO.contractCustomerList
      this.setState({ hasInit: true, momList: this._getMomAndBaby(list, 1), babyList: this._getMomAndBaby(list, 0) })
    }
  }
  
  // uploadList 组件回调
  _setFileList = (fileList) => {
    this.setState({ fileList })
  }

  // 格式化价格
  _formatPrice(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 100) / 100
    return f
  }

  // 获取中心名称
  _getCenterName = (centerId) => {
    const { centerList } = this.props
    const center = centerList && centerList.find((item) => {
      return centerId === item.centerId
    })
    return center && center.centerName ? center.centerName : ''
  }

  // 获取宝宝及妈妈数据源
  _getMomAndBaby = (list = [], type) => {
    return list.filter((customer) => {
      return customer.customerType.toString() === type.toString()
    })
  }

  // 获取合同状态及宝宝与甲方关系
  _getDicName = (key, type) => {
    const { contractStatusList, relationshipTypeList } = this.props
    
    if (key && type === 'contractStatus') {
      const status = contractStatusList && contractStatusList.find((item) => {
        return key.toString() === item.value.toString()
      })
      return status && status.name ? status.name : ''
    } else if (key && type === 'relationshipType') {
      const relationship = relationshipTypeList && relationshipTypeList.find((item) => {
        return key.toString() === item.value.toString()
      })
      return relationship && relationship.name ? relationship.name : ''
    }
  }

  // 获取套餐名称
  _getComboName = (comboList) => {
    return isEmpty(comboList) ? '' : comboList.map((combo) => {
      return combo.comboName
    }).join(',')
  }

  // 甲方是否为产妇
  _getIsPuerpera = (isPuerpera) => {
    if (!isPuerpera) {
      return ''
    }
    return isPuerpera.toString() === '0' ? '是' : '否'
  }
  
  // 获取妈妈名称
  _getMomName = () => {
    const { momList } = this.state
    return !isEmpty(momList) &&
    <a key={momList[0].customerId} href={`/maternity/materCustomerManage/see/seeBasic/${momList[0].customerId}/see/1`} target='_blank'>{momList[0].customerName}</a>
  }

  // 获取妈妈idcard
  _getMomIdcard = () => {
    const { momList } = this.state
    return !isEmpty(momList) && momList[0].idcard
  }

  // 获取宝宝名称
  _getBabyName = () => {
    const { babyList } = this.state
    return isEmpty(babyList) ? '' : babyList.map((baby) => {
      return baby.customerName
    }).join(',')
  }
  
  // 宝宝是否入住状态
  _getIsCheckIn = () => {
    const { babyList } = this.state
    if (isEmpty(babyList)) {
      return ''
    } else {
      return babyList[0].isCheckIn.toString() === '0' ? '是' : '否'
    }
  }

  // 获取宝宝关系
  _getRelationType = () => {
    const { babyList } = this.state
    if (isEmpty(babyList)) {
      return ''
    } else {
      return this._getDicName(babyList[0].relationshipType, 'relationshipType')
    }
  }

  render() {
    const { qiniuToken, contractInfo } = this.props
    const { babyList } = this.state
    const firstPartyDTO = (contractInfo && contractInfo.firstPartyDTO) || {}
    const secondPartyDTO = (contractInfo && contractInfo.secondPartyDTO) || {}
    const agreementDTO = (contractInfo && contractInfo.agreementDTO) || {}
    const pregnancyRemark = contractInfo.pregnancyRemark && contractInfo.pregnancyRemark.length > 45 ? `${contractInfo.pregnancyRemark.substring(0, 45)}...` : contractInfo.pregnancyRemark
    const comboName = this._getComboName(agreementDTO.comboList)

    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row>
            <Col span={18}>
              <Card
                title='甲方信息'
                className={styles['contract-part']}
                id='cardA'
              >
                <Col span={12}>
                  <FormItem
                    label='甲方姓名：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>
                      <Popover
                        placement='topRight'
                        content={<div className={styles['pop']}>{firstPartyDTO.firstPartyName}</div>}
                        title='甲方姓名'
                      >
                        <span>{firstPartyDTO.firstPartyName && firstPartyDTO.firstPartyName.length > 10 ? `${firstPartyDTO.firstPartyName.substring(0, 10)}...` : firstPartyDTO.firstPartyName}</span>
                      </Popover>
                    </span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='身份证号：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{firstPartyDTO.idcard}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='甲方手机号：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{firstPartyDTO.mobile}</span>
                  </FormItem>
                </Col>
                <Col span={12} style={{ height: '64px' }} />
                <Col span={12}>
                  <FormItem
                    label='妈妈姓名：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{this._getMomName()}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='身份证号：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{this._getMomIdcard()}</span>
                  </FormItem>
                </Col>
                {
                  !isEmpty(babyList) &&
                  <div>
                    <Col span={12}>
                      <FormItem
                        label='宝宝姓名：'
                        {...formItemLayout}
                      >
                        <span className='ant-form-text'>{this._getBabyName()}</span>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label='宝宝与甲方关系：'
                        {...formItemLayout}
                      >
                        <span className='ant-form-text'>{this._getRelationType()}</span>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label='宝宝是否入住：'
                        {...formItemLayout}
                      >
                        <span className='ant-form-text'>{this._getIsCheckIn()}</span>
                      </FormItem>
                    </Col>
                    <Col span={12} style={{ height: '64px' }} />
                  </div>
                }
               
                <Col span={12}>
                  <FormItem
                    label='紧急联系人：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{firstPartyDTO.contactPerson}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='紧急联系人电话：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{firstPartyDTO.contactMobile}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='紧急联系人地址：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{firstPartyDTO.contactAdress}</span>
                  </FormItem>
                </Col>
              </Card>
              <Card
                title='乙方信息'
                className={styles['contract-part']}
              >
                <Col span={12}>
                  <FormItem
                    label='合同编号：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{contractInfo && contractInfo.contractNum}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='入住中心：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{this._getCenterName(agreementDTO.centerId)}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='中心地址：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{secondPartyDTO.adress}</span>
                  </FormItem>
                </Col>
                <Col span={12} style={{ height: '64px' }} />
                <Col span={12}>
                  <FormItem
                    label='乙方：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{secondPartyDTO.secondPartyName}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='乙方联系电话：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{secondPartyDTO.mobile}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='执照号：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{secondPartyDTO.licenseNo}</span>
                  </FormItem>
                </Col>
              </Card>
              <Card
                title='服务信息'
                className={styles['contract-part']}
              >
                <Col span={12}>
                  <FormItem
                    label='套餐名称：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text' style={{ wordBreak: 'break-all' }}>
                      <Popover
                        placement='topRight'
                        content={<div className={styles['pop']}>{comboName}</div>}
                        title='套餐名称'
                      >
                        <span>{comboName && comboName.length > 20 ? `${comboName.substring(0, 20)}...` : comboName}</span>
                      </Popover>
                    </span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='多胎服务费：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.moreBabyFee ? `¥ ${this._formatPrice(agreementDTO.moreBabyFee)}` : ''}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='额定服务费：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.ratedFee ? `¥ ${this._formatPrice(agreementDTO.ratedFee)}` : ''}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='合同状态：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{contractInfo && this._getDicName(contractInfo.contractStatus, 'contractStatus')}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='入住天数：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.stayDays}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='留房天数：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.keepDays}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='签约时间：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{contractInfo && contractInfo.signingTime && moment(contractInfo.signingTime).format('YYYY-MM-DD')}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定房间：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.roomNum}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定开始日期：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.startTime && moment(agreementDTO.startTime).format('YYYY-MM-DD')}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定结束日期：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{agreementDTO.endTime && moment(agreementDTO.endTime).format('YYYY-MM-DD')}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='合同金额：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{contractInfo && contractInfo.contractAmount ? `¥ ${this._formatPrice(contractInfo.contractAmount)}` : ''}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='已付金额：'
                    {...formItemLayout}
                  >
                    <span className='ant-form-text'>{contractInfo && contractInfo.paidAmount ? `¥ ${this._formatPrice(contractInfo.paidAmount)}` : ''}</span>
                  </FormItem>
                </Col>
              </Card>
              <Card
                title='其他'
                className={styles['contract-part']}
              >
                <Col span={12}>
                  <FormItem
                    label='孕期特殊情况说明：'
                    {...formItemLayout}
                  >
                    <span
                      className='ant-form-text'
                      style={{ wordBreak: 'break-all', width: '200px' }}
                    >
                      <Popover
                        placement='topRight'
                        content={<div className={styles['pop']}>{contractInfo && contractInfo.pregnancyRemark}</div>}
                        title='孕期特殊情况说明'
                      >
                        <span>{ pregnancyRemark}</span>
                      </Popover>
                    </span>
                  </FormItem>
                </Col>
              </Card>
            </Col>
            <Col span={6} >
              <UploadList
                qiniuToken = {qiniuToken}
                setFileList = {this._setFileList}
                isShow={true}
                fileListDisplay = {(contractInfo && !isEmpty(contractInfo.fileUploadList)) ? contractInfo.fileUploadList : []}
              />
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const listConditions = state.contract.listConditions
  return {
    centerList: (listConditions && listConditions.careCenterList) || [],
    contractStatusList: (listConditions && listConditions.contractStatusList) || [],
    relationshipTypeList: (listConditions && listConditions.relationshipTypeList) || [],
    customerTypeList: (listConditions && listConditions.customerTypeList) || [],
    contractInfo: state.contract.contractInfo,
    qiniuToken: state.contract.qiniuToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractDetail))
