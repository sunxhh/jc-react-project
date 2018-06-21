import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { Form, Row, Col, Card, Radio, Select, Input, DatePicker, Popover, Button, message } from 'antd'
import UploadList from './uploadList'
import ModalSelectInput from 'Components/modal/ModalSelectInput'
import {
  getListConditions,
  createContractNum,
  getContractDetail,
  resetContractDetail,
  addContract,
} from './reduck'
import {
  getQiniuToken
} from '../../../global/action'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { MATER_CONTRACT } from 'Global/urls'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const SelectOption = Select.Option
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ContractAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      babys: []
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(getListConditions({ status: 0 }))
    if (match.params && match.params.contractId) {
      dispatch(getContractDetail({ contractId: match.params.contractId }))
    }
    dispatch(resetContractDetail())
    dispatch(getQiniuToken())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetContractDetail())
  }

  // uploadList 组件回调
  _setFileList = (fileList) => {
    this.setState({ fileList })
  }

  // 获取中心名称
  _getCenterName = (centerId) => {
    const { centerList } = this.props
    const center = centerList.find((item) => {
      return centerId.toString() === item.centerId.toString()
    })
    return center && center.centerName ? center.centerName : ''
  }

  // 获取客户类型
  _getCustomerType = (key) => {
    const { customerTypeList } = this.props
    const customerType = customerTypeList && customerTypeList.find((item) => {
      return key.toString() === item.value.toString()
    })
    return customerType && customerType.name ? customerType.name : ''
  }

  // 获取宝宝及妈妈数据源
  _getMomAndBaby = (type) => {
    const { contractInfo } = this.props
    let firstPartyDTO = contractInfo && contractInfo.firstPartyDTO ? contractInfo.firstPartyDTO : null
    let contractCustomerList = firstPartyDTO && firstPartyDTO.contractCustomerList ? firstPartyDTO.contractCustomerList : []
    let filterList = contractCustomerList.length > 0 ? contractCustomerList.filter((customer) => {
      return customer.customerType.toString() === type.toString()
    }) : []
    return filterList.map((item) => {
      return {
        id: item.customerId,
        name: item.customerName,
        relationshipType: item.relationshipType,
        isCheckIn: item.isCheckIn,
        idcard: item.idcard,
      }
    })
  }

  // 选择房间弹层列
  _roomColumns = [
    {
      title: '房间号',
      dataIndex: 'roomNum',
      key: 'roomNum',
      width: 200
    },
    {
      title: '所属中心',
      dataIndex: 'centerId',
      key: 'centerId',
      render: (text, record) => (
        <span>{this._getCenterName(record.centerId)}</span>
      )
    }
  ]

  // 月子中心变化更换房间选择
  _handleCenterChange = (centerId) => {
    const { centerList, form } = this.props
    const center = centerList.find((item) => {
      return centerId.toString() === item.centerId.toString()
    })
    form.setFieldsValue({
      adress: center.adress,
      secondPartyName: center.secondPartyName,
      secondMobile: center.mobile,
      licenseNo: center.licenseNo,
      contractNum: '',
      room: [],
    })
  }

  // 房间选择信息
  _getRommModalParams = () => {
    const { form } = this.props
    return {
      modalParam: {
        title: '选择预定房间',
        width: '920px'
      },
      rowKey: 'roomId',
      selectType: 'radio',
      fetch: fetchData,
      url: apis.contract.roomList,
      selectedList: form.getFieldValue('room'),
      extraParams: { centerId: form.getFieldValue('centerId'), offFlag: 0, isLock: 1, roomStatus: 1 },
      columns: this._roomColumns,
      filter: [{
        id: 'roomNum',
        props: {
          label: '房间号',
        },
        element: (
          <Input placeholder='请输入房间号' />
        )
      }]
    }
  }

  // 房间弹层出现前校验
  _handleRoomBeforeClick = () => {
    const { form } = this.props
    if (form.getFieldValue('centerId')) {
      return true
    } else {
      message.error('请先选择入住中心！')
      return false
    }
  }

  // 提取妈妈弹层列
  _momAndBabyColumns = [
    {
      key: 'centerName',
      title: '所在中心',
      dataIndex: 'centerName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'number',
      title: '客户编号',
      dataIndex: 'number',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'type',
      title: '客户类型',
      dataIndex: 'type',
      render: (text) => {
        return (
          <span>{this._getCustomerType(text)}</span>
        )
      }
    },
    {
      key: 'name',
      title: '客户姓名',
      dataIndex: 'name',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'createTime',
      title: '录入时间',
      dataIndex: 'createTime',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='创建时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    }
  ]

  // 提取妈妈选择信息
  _getMomModalParams = () => {
    const { centerList, customerTypeList, form } = this.props
    return {
      modalParam: {
        title: '提取妈妈信息',
        width: '920px'
      },
      selectType: 'radio',
      fetch: fetchData,
      url: apis.contract.momBabyList,
      columns: this._momAndBabyColumns,
      selectedList: form.getFieldValue('momList'),
      empty: () => {
        return (
          <span>
            未找到您查询的妈妈信息，请确认 -
            <a
              target='_blank'
              href='/maternity/materCustomerManage/add'
            > 新增妈妈客户
            </a>
          </span>
        )
      },
      filter: [{
        id: 'centerId',
        props: {
          label: '所在中心：'
        },
        options: {
          initialValue: '',
        },
        element: (
          <Select
            placeholder='请选择所在中心'
            allowClear
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            style={{ width: '140px' }}
          >
            <SelectOption
              key=''
              value=''
              title='全部'
            >
              全部
            </SelectOption>
            {
              !isEmpty(centerList) && centerList.map(item => (
                <SelectOption
                  key={item.centerId}
                  value={item.centerId}
                >
                  {item.centerName}
                </SelectOption>
              ))
            }
          </Select>
        )
      }, {
        id: 'type',
        props: {
          label: '客户类型',
        },
        options: {
          initialValue: '',
        },
        element: (
          <Select
            dropdownMatchSelectWidth={false}
            style={{ width: '140px' }}
            optionLabelProp='title'
            filterOption={false}
            allowClear
            placeholder='请选择客户类型'
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
          >
            <SelectOption
              key=''
              value=''
              title='全部'
            >
              全部
            </SelectOption>
            {!isEmpty(customerTypeList) ? customerTypeList.map(d => (
              <SelectOption
                key={d.value}
                value={d.value}
                title={d.name}
              >
                {d.name}
              </SelectOption>
            )) : null}
          </Select>
        )
      }, {
        id: 'createTimeList',
        props: {
          label: '录入时间',
        },
        element: (
          <RangePicker
            getCalendarContainer = {() => document.getElementById('modalRow')}
            placeholder={['开始时间', '结束时间']}
          />
        )
      }, {
        id: 'keyWords',
        element: (
          <Input placeholder='请输入关键词' />
        )
      }]
    }
  }

  // 获取宝宝姓名
  _getBabyName = (babyList) => {
    return babyList.map((baby) => {
      return baby.name
    }).join(',')
  }

  // 妈妈选中后的回调
  _handleMomSelect= (selectedRows) => {
    const { form } = this.props
    if (!isEmpty(selectedRows)) {
      this.setState({ babys: selectedRows[0].babyList })
      form.setFieldsValue({ babyName: this._getBabyName(selectedRows[0].babyList), momIdcard: selectedRows[0].idcard })
    }
  }

  // 提取套餐弹层列
  _packagesColumns = [
    {
      key: 'comboNo',
      title: '套餐编号',
      dataIndex: 'comboNo',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'comboName',
      title: '套餐名称',
      dataIndex: 'comboName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm')}</div>}
            title='创建时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    }
  ]

  // 选择套餐信息
  _getPackagesParams = () => {
    const { form } = this.props
    return {
      modalParam: {
        title: '选择套餐'
      },
      rowKey: 'comboNo',
      selectType: 'checkbox',
      fetch: fetchData,
      url: apis.contract.comboChooseList,
      extraParams: { status: '1' },
      instantSelected: false,
      showSelectedTagFlag: true,
      selectedTagFieldName: 'comboName',
      selectedList: form.getFieldValue('comboList'),
      columns: this._packagesColumns,
      empty: () => {
        return (
          <span>
            未找到您查询的套餐，请确认 -
            <a
              target='_blank'
              href='/maternity/packages/add'
            > 新增套餐
            </a>
          </span>
        )
      },
      filter: [{
        id: 'keyWords',
        element: (
          <Input placeholder='请输入关键词' />
        )
      }]
    }
  }

  // 生成合同编号
  _generateContractNum = () => {
    const { dispatch, form } = this.props
    if (!form.getFieldValue('centerId')) {
      message.error('请先选择入住中心！')
      return
    }
    dispatch(createContractNum({ centerId: form.getFieldValue('centerId') })).then((data) => {
      if (data.status === 'success') {
        form.setFieldsValue({ contractNum: data.result })
      }
    })
  }

  // 新增保存
  _handleSubmit = () => {
    const { match, dispatch, form, history } = this.props
    let params = {}
    form.validateFields((err, values) => {
      if (!err) {
        if (match.params && match.params.contractId) {
          params = this._getSubmitParams(values, match.params.contractId)
        } else {
          params = this._getSubmitParams(values)
        }
        dispatch(addContract(params)).then((data) => {
          data.status === 'success' && history.push(MATER_CONTRACT)
        })
      }
    })
  }

  // 封装提交请求参数
  _getSubmitParams = (values, contractId) => {
    let { fileList, babys } = this.state
    const { contractInfo } = this.props
    let momList = []
    let babyList = []
    let params = {
      contractNum: values.contractNum,
      contractStatus: values.contractStatus,
      signingTimeWeb: moment(values.signingTimeWeb).format('YYYY-MM-DD HH:mm:ss'),
      pregnancyRemark: values.pregnancyRemark,
      ratedFeeWeb: values.ratedFee,
      moreBabyFeeWeb: values.moreBabyFee,
      contractAmountWeb: values.contractAmount,
      paidAmountWeb: values.paidAmount,
      fileList: [
        ...fileList
      ], // 合同附件
    }

    // 如果state内babys不存在，则取contractInfo的信息
    if (isEmpty(babys)) {
      babys = this._getMomAndBaby('0')
    }

    // 甲方封装妈妈信息
    if (!isEmpty(values.momList)) {
      momList.push({
        customerId: values.momList[0].id,
        customerName: values.momList[0].name,
        customerType: '1',
        idcard: values.momIdcard,
      })
    }

    // 甲方封装宝宝信息
    if (!isEmpty(babys)) {
      babyList = babys.map((baby) => {
        return {
          customerId: baby.id,
          customerName: baby.name,
          customerType: '0',
          relationshipType: values.relationshipType,
          isCheckIn: values.isCheckIn,
        }
      })
    }
    // 甲方信息
    params.firstPartyDTO = {
      contractCustomerList: [
        ...babyList,
        ...momList
      ],
      firstPartyName: values.firstPartyName,
      idcard: values.idcard,
      mobile: values.mobile,
      isPuerpera: values.isPuerpera,
      contactPerson: values.contactPerson,
      contactMobile: values.contactMobile,
      contactAdress: values.contactAdress,
    }
    // 乙方信息
    params.secondPartyDTO = {
      adress: values.adress,
      secondPartyName: values.secondPartyName,
      mobile: values.secondMobile,
      licenseNo: values.licenseNo,
    }
    // 服务信息
    params.agreementDTO = {
      centerId: values.centerId,
      stayDays: values.stayDays,
      keepDays: values.keepDays,
      roomId: values.room[0].roomId,
      roomNum: values.room[0].roomNum,
      startTimeWeb: moment(values.startTimeWeb).format('YYYY-MM-DD') + ' 12:00:00',
      endTimeWeb: moment(values.endTimeWeb).format('YYYY-MM-DD') + ' 12:00:00',
    }
    // 封装套餐信息
    params.agreementDTO.comboList = values.comboList.map((combo) => {
      return {
        comboNo: combo.comboNo,
        comboName: combo.comboName,
      }
    })

    if (contractId) {
      params.contractId = contractId
      params.firstPartyDTO.firstPartyId = contractInfo.firstPartyDTO.firstPartyId
      params.secondPartyDTO.secondPartyId = contractInfo.secondPartyDTO.secondPartyId
      params.agreementDTO.agreementId = contractInfo.agreementDTO.agreementId
    }
    return params
  }

  // 数字验证
  _isNumber = (rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    const objReg = /(^[0-9]{1,9}$)|(^[0-9]{1,9}[\.]{1}[0-9]{1,2}$)/
    if ((String(value) && !objReg.test(value)) || parseFloat(value) < 0) {
      callback('只能输入9位整数+2位小数!')
      return
    }
    callback()
  }

  // 留房天数验证
  _isKeepDays = (rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    const objReg = /^\d+$/
    if (String(value) && !objReg.test(value) || parseFloat(value) < 0) {
      callback('只能输入非负整数!')
      return
    }
    callback()
  }

  // 电话号码验证
  _isPhoneNum = (rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    const objReg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
    if ((String(value) && !objReg.test(value))) {
      callback('输入11位合法手机号码!')
      return
    }
    callback()
  }

  // 身份证号校验
  _isIdCard = (rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    const objReg = /^\d{17}[\w\d]$/
    if ((String(value) && !objReg.test(value))) {
      callback('输入18位身份证号!')
      return
    }
    callback()
  }

  // 禁用开始时间
  _disabledStartDate = (dateStart) => {
    const { getFieldValue } = this.props.form
    const dateEnd = getFieldValue('endTimeWeb')
    if (!dateStart || !dateEnd) {
      return false
    }
    return dateStart.valueOf() > dateEnd.valueOf()
  }

  // 禁用结束时间
  _disabledEndDate = (dateEnd) => {
    const { getFieldValue } = this.props.form
    const dateStart = getFieldValue('startTimeWeb')
    if (!dateEnd || !dateStart) {
      return false
    }
    return dateEnd.valueOf() <= dateStart.valueOf()
  }

  // 预定时间计算入住天数
  _handlePresetTimeChange = (startTimeWeb, endTimeWeb) => {
    const { form } = this.props
    if (startTimeWeb && endTimeWeb) {
      startTimeWeb = moment(startTimeWeb.format('YYYY-MM-DD') + ' 00:00:00')
      endTimeWeb = moment(endTimeWeb.format('YYYY-MM-DD') + ' 00:00:00')
      form.setFieldsValue({ stayDays: parseInt(endTimeWeb.diff(startTimeWeb, 'days')) + 1 })
    } else {
      form.setFieldsValue({ stayDays: undefined })
    }
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

  render() {
    const { qiniuToken, contractInfo, relationshipTypeList, contractStatusList, centerList, history, showButtonSpin } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    const momList = this._getMomAndBaby('1')
    const babyList = this._getMomAndBaby('0')
    const firstPartyDTO = (contractInfo && contractInfo.firstPartyDTO) || {}
    const secondPartyDTO = (contractInfo && contractInfo.secondPartyDTO) || {}
    const agreementDTO = (contractInfo && contractInfo.agreementDTO) || {}
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
                    {getFieldDecorator('firstPartyName', {
                      initialValue: firstPartyDTO.firstPartyName || undefined,
                      rules: [{
                        required: true,
                        message: '请输入甲方姓名！',
                      }],
                    })(
                      <Input placeholder='请输入甲方姓名' maxLength='20' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='身份证号：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('idcard', {
                      initialValue: firstPartyDTO.idcard || undefined,
                      rules: [{
                        required: true,
                        message: '请输入身份证号！',
                      }, {
                        validator: this._isIdCard
                      }],
                    })(
                      <Input placeholder='请输入身份证号' maxLength='18' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='甲方手机号：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('mobile', {
                      initialValue: firstPartyDTO.mobile || undefined,
                      rules: [{
                        required: true,
                        message: '请输入甲方手机号！',
                      }, {
                        validator: this._isPhoneNum
                      }],
                    })(
                      <Input placeholder='请输入甲方手机号' maxLength='11' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12} style={{ height: '64px' }} />
                <Col span={12}>
                  <FormItem
                    label='妈妈姓名：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('momList', {
                      initialValue: momList || [],
                      rules: [{
                        required: true,
                        message: '请输入妈妈姓名！',
                      }],
                    })(
                      <ModalSelectInput
                        displayName='name'
                        params = {this._getMomModalParams}
                        onSelect = {this._handleMomSelect}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='身份证号：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('momIdcard', {
                      initialValue: momList.length > 0 && momList[0].idcard || undefined,
                      rules: [{
                        required: true,
                        message: '请输入身份证号！',
                      }, {
                        validator: this._isIdCard
                      }],
                    })(
                      <Input placeholder='请输入身份证号' maxLength='18' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='宝宝姓名：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('babyName', {
                      initialValue: this._getBabyName(babyList)
                    })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='宝宝与甲方关系：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('relationshipType', {
                      initialValue: babyList.length > 0 && babyList[0].relationshipType || undefined,
                    })(
                      <Select
                        placeholder='请选择宝宝与甲方关系'
                        getPopupContainer={() => document.getElementById('cardA')}
                      >
                        {
                          !isEmpty(relationshipTypeList) && relationshipTypeList.map(item => (
                            <SelectOption
                              key={item.value}
                              value={item.value}
                            >
                              {item.name}
                            </SelectOption>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='宝宝是否入住：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('isCheckIn', {
                      initialValue: babyList.length > 0 && babyList[0].isCheckIn || '0',
                    })(
                      <RadioGroup>
                        <Radio
                          key={'0'}
                          value={'0'}
                        >
                          是
                        </Radio>
                        <Radio
                          key={'1'}
                          value={'1'}
                        >
                          否
                        </Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={12} style={{ height: '64px' }} />
                <Col span={12}>
                  <FormItem
                    label='紧急联系人：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('contactPerson', {
                      initialValue: firstPartyDTO.contactPerson || undefined,
                      rules: [{
                        required: true,
                        message: '请输入紧急联系人！',
                      }],
                    })(
                      <Input placeholder='请输入紧急联系人' maxLength='20' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='紧急联系人电话：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('contactMobile', {
                      initialValue: firstPartyDTO.contactMobile || undefined,
                      rules: [{
                        required: true,
                        message: '请输入紧急联系人电话！',
                      }, {
                        validator: this._isPhoneNum
                      }],
                    })(
                      <Input placeholder='请输入紧急联系人电话' maxLength='11' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='紧急联系人地址：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('contactAdress', {
                      initialValue: firstPartyDTO.contactAdress || undefined,
                    })(
                      <Input placeholder='请输入紧急联系人地址' maxLength='50' />
                    )}
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
                    {getFieldDecorator('contractNum', {
                      initialValue: (contractInfo && contractInfo.contractNum) || undefined,
                      rules: [{
                        required: true,
                        message: '请输入合同编号！',
                      }],
                    })(
                      <Input
                        placeholder='请输入合同编号'
                        maxLength='50'
                        readOnly
                        disabled={contractInfo && !!contractInfo.contractId}
                        addonAfter={
                          contractInfo && !contractInfo.contractId &&
                          <span
                            className={styles['contract-no-btn']}
                            onClick={this._generateContractNum}
                          >
                          生成合同编号
                          </span>
                        }
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='入住中心：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('centerId', {
                      initialValue: agreementDTO.centerId || undefined,
                      rules: [{
                        required: true,
                        message: '请选择入住中心！',
                      }],
                    })(
                      <Select
                        placeholder='请选择所在中心'
                        getPopupContainer={() => document.getElementById('cardA')}
                        disabled={contractInfo && !!contractInfo.contractId}
                        onChange={this._handleCenterChange}
                      >
                        {
                          !isEmpty(centerList) && centerList.map(item => (
                            <SelectOption
                              key={item.centerId}
                              value={item.centerId}
                            >
                              {item.centerName}
                            </SelectOption>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='中心地址：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('adress', {
                      initialValue: secondPartyDTO.adress || undefined,
                      rules: [{
                        required: true,
                        message: '请至机构中心填写机构地址！',
                      }],
                    })(
                      <Input placeholder='请输入中心地址' disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={12} style={{ height: '64px' }} />
                <Col span={12}>
                  <FormItem
                    label='乙方：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('secondPartyName', {
                      initialValue: secondPartyDTO.secondPartyName || undefined,
                      rules: [{
                        required: true,
                        message: '请输入乙方！',
                      }],
                    })(
                      <Input placeholder='请输入乙方' disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='乙方联系电话：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('secondMobile', {
                      initialValue: secondPartyDTO.mobile || undefined,
                      rules: [{
                        required: true,
                        message: '请输入乙方联系电话！',
                      }],
                    })(
                      <Input placeholder='请输入乙方联系电话' disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='执照号：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('licenseNo', {
                      initialValue: secondPartyDTO.licenseNo || undefined,
                    })(
                      <Input placeholder='请输入执照号' disabled />
                    )}
                  </FormItem>
                </Col>
              </Card>
              <Card
                title='服务信息'
                className={styles['contract-part']}
                id={'serviceInfo'}
              >
                <Col span={12}>
                  <FormItem
                    label='套餐名称：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('comboList', {
                      initialValue: agreementDTO.comboList || undefined,
                      rules: [{
                        required: true,
                        message: '请选择套餐！',
                      }],
                    })(
                      <ModalSelectInput
                        displayName='comboName'
                        params = {this._getPackagesParams}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='多胎服务费：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('moreBabyFee', {
                      initialValue: (agreementDTO.moreBabyFee && this._formatPrice(agreementDTO.moreBabyFee)) || undefined,
                      rules: [{
                        validator: this._isNumber
                      }]
                    })(
                      <Input placeholder='请输入多胎服务费' maxLength='12' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='额定服务费：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ratedFee', {
                      initialValue: (agreementDTO.ratedFee && this._formatPrice(agreementDTO.ratedFee)) || undefined,
                      rules: [{
                        required: true,
                        message: '请输入额定服务费！',
                      }, {
                        validator: this._isNumber
                      }],
                    })(
                      <Input placeholder='请输入额定服务费' maxLength='12' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='合同状态：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('contractStatus', {
                      initialValue: contractInfo && contractInfo.contractStatus || undefined,
                      rules: [{
                        required: true,
                        message: '请选择合同状态！',
                      }],
                    })(
                      <Select
                        allowClear={false}
                        optionLabelProp='title'
                        filterOption={false}
                        placeholder='请选择合同状态'
                        getPopupContainer={() => document.getElementById('cardA')}
                      >
                        {!isEmpty(contractStatusList) ? contractStatusList.map(d => (
                          <SelectOption
                            key={d.value}
                            value={d.value}
                            title={d.name}
                          >
                            {d.name}
                          </SelectOption>
                        )) : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='入住天数：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('stayDays', {
                      initialValue: agreementDTO.stayDays || undefined,
                      rules: [{
                        required: true,
                        message: '请输入入住天数！',
                      }],
                    })(
                      <Input placeholder='请输入入住天数' disabled />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='留房天数：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('keepDays', {
                      initialValue: agreementDTO.keepDays || undefined,
                      rules: [
                        {
                          validator: this._isKeepDays
                        }
                      ]
                    })(
                      <Input placeholder='请输入留房天数' maxLength='9' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='签约时间：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('signingTimeWeb', {
                      initialValue: (contractInfo && contractInfo.signingTime && moment(contractInfo.signingTime)) || undefined,
                      rules: [{
                        required: true,
                        message: '请选择签约时间！',
                      }],
                    })(
                      <DatePicker
                        getCalendarContainer = {() => document.getElementById('serviceInfo')}
                        placeholder='签约时间'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定房间：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('room', {
                      initialValue: agreementDTO.roomId && [{ roomId: agreementDTO.roomId, roomNum: agreementDTO.roomNum }] || undefined,
                      rules: [{
                        required: true,
                        message: '请选择预定房间！',
                      }],
                    })(
                      <ModalSelectInput
                        displayName='roomNum'
                        params = {this._getRommModalParams()}
                        beforeClick = {this._handleRoomBeforeClick}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定开始日期：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('startTimeWeb', {
                      initialValue: (agreementDTO.startTime && moment(agreementDTO.startTime)) || undefined,
                      rules: [{
                        required: true,
                        message: '请选择预定开始日期！',
                      }],
                    })(
                      <DatePicker
                        getCalendarContainer = {() => document.getElementById('serviceInfo')}
                        onChange={(date) => { this._handlePresetTimeChange(date, getFieldValue('endTimeWeb')) }}
                        disabledDate={this._disabledStartDate}
                        placeholder='预定开始日期'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='预定结束日期：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('endTimeWeb', {
                      initialValue: (agreementDTO.endTime && moment(agreementDTO.endTime)) || undefined,
                      rules: [{
                        required: true,
                        message: '请选择预定结束日期！',
                      }],
                    })(
                      <DatePicker
                        getCalendarContainer = {() => document.getElementById('serviceInfo')}
                        onChange={(date) => { this._handlePresetTimeChange(getFieldValue('startTimeWeb'), date) }}
                        disabledDate={this._disabledEndDate}
                        placeholder='预定结束日期'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='合同金额：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('contractAmount', {
                      initialValue: (contractInfo && this._formatPrice(contractInfo.contractAmount)) || undefined,
                      rules: [{
                        required: true,
                        message: '请输入合同金额！',
                      }, {
                        validator: this._isNumber
                      }],
                    })(
                      <Input placeholder='请输入合同金额' maxLength='12' />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='已付金额：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('paidAmount', {
                      initialValue: (contractInfo && this._formatPrice(contractInfo.paidAmount)) || undefined,
                      rules: [{
                        required: true,
                        message: '请输入已付金额！',
                      }, {
                        validator: this._isNumber
                      }],
                    })(
                      <Input placeholder='请输入已付金额' maxLength='12' />
                    )}
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
                    {getFieldDecorator('pregnancyRemark', {
                      initialValue: contractInfo && contractInfo.pregnancyRemark || undefined,
                    })(
                      <TextArea placeholder='孕期特殊情况说明' maxLength='500' />
                    )}
                  </FormItem>
                </Col>
              </Card>
              <Row
                className={styles['submit-box']}
              >
                <FormItem>
                  <Button
                    type='default'
                    onClick={() => history.push(MATER_CONTRACT)}
                  >返回
                  </Button>
                  <Button
                    loading={showButtonSpin}
                    onClick={() => { this._handleSubmit() }}
                    type='primary'
                  >保存
                  </Button>
                </FormItem>
              </Row>
            </Col>
            <Col span={6} >
              <UploadList
                qiniuToken = {qiniuToken}
                action='http://upload.qiniu.com'
                setFileList = {this._setFileList}
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
    qiniuToken: state.common.qiniuToken,

    showButtonSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractAdd))
