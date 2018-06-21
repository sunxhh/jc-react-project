import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col, Input, Select, Upload, Icon, DatePicker, Button, message, Modal, Cascader, InputNumber } from 'antd'
import * as actions from '../reduck'
import style from './index.less'
import moment from 'moment'
import {
  getQiniuToken
} from '../../../../../global/action'
import { isEmpty } from '../../../../../utils/lang'
import SeeBaby from './seeBaby'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const formItemLayout1 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
}

class AddBasic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewImage: '',
      previewVisible: false,
      courseCoverImg: '',
      centerId: '',
      centerName: '',
      nurseName: '',
      id: this.props.match.params.id,
      isShowType: this.props.match.params.type,
      isSeeInfo: false,
      isShowPre: false
    }
  }

  _isSeeInfo = () => {
    if (this.state.isShowType === 'see') {
      this.setState({
        isSeeInfo: true,
      })
    }
  }

  componentWillMount() {
    const timeStr = new Date().getSeconds().toString(16) + Math.random()
    const str = String(timeStr)
    if (this.state.isShowType === 'edit' || this.state.isShowType === 'see') {
      this._isSeeInfo()
      this.props.dispatch(actions.getBasicAndPreInfo({ id: this.state.id }))
    }
    this.props.dispatch(getQiniuToken(str))
    this.props.dispatch(actions.getNurseList({}))
    this.props.dispatch(actions.getCityList())
  }

  nameValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('name') === undefined || form.getFieldValue('name') === null) {
      callback()
    } else if (form.getFieldValue('name').length >= 0 && form.getFieldValue('name').length <= 20) {
      callback()
    } else {
      callback('20个字符以内')
    }
  }

  phoneValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('mobile') === undefined || form.getFieldValue('mobile') === null) {
      callback()
    } else if (/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(form.getFieldValue('mobile')) && form.getFieldValue('mobile').length === 11) {
      callback()
    } else {
      callback('输入11位合法手机号码')
    }
  }

  nickNameValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('nickName') === undefined || form.getFieldValue('nickName') === null) {
      callback()
    } else if (form.getFieldValue('nickName').length >= 0 && form.getFieldValue('nickName').length <= 20) {
      callback()
    } else {
      callback('20个字符以内')
    }
  }

  qqValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('qq') === undefined || form.getFieldValue('qq') === null || form.getFieldValue('qq') === '') {
      callback()
    } else if (/^[1-9][0-9]{4,11}$/.test(form.getFieldValue('qq'))) {
      callback()
    } else {
      callback('输入5-12位合法QQ')
    }
  }

  emailValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('email') === undefined || form.getFieldValue('email') === null || form.getFieldValue('email') === '') {
      callback()
    } else if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(form.getFieldValue('email'))) {
      callback()
    } else {
      callback('输入合法email')
    }
  }

  idcardValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('idcard') === undefined || form.getFieldValue('idcard') === null || form.getFieldValue('idcard') === '') {
      callback()
    } else if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(form.getFieldValue('idcard'))) {
      callback()
    } else {
      callback('请输入18位合法身份证号')
    }
  }

  wechatValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('wechat') === undefined || form.getFieldValue('wechat') === null) {
      callback()
    } else if (form.getFieldValue('wechat').length >= 0 && form.getFieldValue('wechat').length <= 32) {
      callback()
    } else {
      callback('32个字符以内')
    }
  }

  addressValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('address') === undefined || form.getFieldValue('address') === null) {
      callback()
    } else if (form.getFieldValue('address').length >= 0 && form.getFieldValue('address').length <= 50) {
      callback()
    } else {
      callback('50个字符以内')
    }
  }

  remarkValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('remark') === undefined || form.getFieldValue('remark') === null) {
      callback()
    } else if (form.getFieldValue('remark').length >= 0 && form.getFieldValue('remark').length <= 500) {
      callback()
    } else {
      callback('500个字符以内')
    }
  }

  hospitalValide = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('hospital') === undefined || form.getFieldValue('hospital') === null) {
      callback()
    } else if (form.getFieldValue('hospital').length >= 0 && form.getFieldValue('hospital').length <= 50) {
      callback()
    } else {
      callback('50个字符以内')
    }
  }

  // 时间区域
  disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate())
    let currDate = moment(current).format('YYYY-MM-DD')
    return current && new Date(currDate).valueOf() > new Date(date).valueOf()
  }

  // 大于时间
  disabledBeforeToday = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate())
    let currDate = moment(current).format('YYYY-MM-DD')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  _handleSubmit = (nurseList) => {
    const { history, dispatch, form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const args = this._getInfoData(values, nurseList)
        dispatch(actions.addCoustomerInfo(args)).then((data) => {
          if (data.status === 'success') {
            history.push('/maternity/materCustomerManage')
          }
        })
      }
    })
  }

  _handleModify = (nurseList) => {
    const { history, dispatch, form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const args = this._getInfoData(values, nurseList)
        dispatch(actions.modifyCoustomerInfo({ ...args, id: this.state.id })).then((data) => {
          if (data.status === 'success') {
            history.push('/maternity/materCustomerManage')
          }
        })
      }
    })
  }

  _getInfoData = (values, nurseList) => {
    const { getFieldValue } = this.props.form
    const { basicInfo } = this.props
    const { isShowType } = this.state
    let pregnant = (basicInfo && basicInfo.pregnant) ? basicInfo.pregnant : {}
    let babyList = []
    let babys = getFieldValue('babyList')
    babys.forEach((baby, i) => {
      babyList.push({
        id: values[`id${i}`] ? values[`id${i}`] : '',
        name: values[`name${i}`],
        sex: values[`sex${i}`],
        birthday: values[`birthday${i}`] ? values[`birthday${i}`].format('YYYY-MM-DD') : '',
        remark: values[`remark${i}`],
      })
    })
    return {
      number: values.number || '',
      process: values.process || '',
      name: values.name || '',
      mobile: values.mobile || '',
      nickName: values.nickName || '',
      qq: values.qq || '',
      email: values.email || '',
      type: values.type || '',
      source: values.source || '',
      sex: values.sex,
      idcard: values.idcard || '',
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
      wechat: values.wechat || '',
      processor: values.processor || '',
      address: values.address || '',
      remark: values.remark || '',
      ...this._getPicture(values),
      ...this._handleSelect(values, nurseList)[0],
      babyList,
      pregnant: {
        id: isShowType === 'edit' ? pregnant['id'] : '',
        expectedTime: values.expectedTime ? values.expectedTime.format('YYYY-MM-DD') : '',
        hospital: values.hospital,
        hospitalAddress: values.hospitalAddress,
        remark: values.pregnantRemark,
        pregnantCount: values.pregnantCount,
        babyCount: values.babyCount,
        provCode: values.residence ? values.residence[0] : '',
        cityCode: values.residence ? values.residence[1] : '',
        distCode: values.residence ? values.residence[2] : '',
      }
    }
  }

  _getPicture = values => {
    const isRemovePic = this.props.form.getFieldValue('picture')
    if (this.state.isShowType === 'see') {
      if (isRemovePic && isRemovePic.status === 'removed') {
        return {
          picture: '',
        }
      } else {
        return {
          picture: values.picture && values.picture.response ? values.picture.response.key : '',
        }
      }
    } else if (this.state.isShowType === 'edit') {
      if (values.picture && values.picture.response && values.picture.status !== 'removed') {
        return {
          picture: values.picture.response.key,
        }
      } else if (isRemovePic && isRemovePic.status !== 'removed') {
        return {
          picture: isRemovePic.uid,
        }
      } else if ((values.picture && values.picture.size / 1024 / 1024 > 2) || (isRemovePic && isRemovePic.status === 'removed')) {
        return {
          picture: '',
        }
      } else {
        return {
          picture: '',
        }
      }
    } else {
      if (values.picture && values.picture.size / 1024 / 1024 < 2 && values.picture.status !== 'removed') {
        return {
          picture: values.picture && values.picture.response ? values.picture.response.key : '',
        }
      } else {
        return {
          picture: '',
        }
      }
    }
  }

  // 头像
  projectImgUpload = (e) => {
    let data = e.file
    if (e.file.hasOwnProperty('response') && typeof e.file.response !== 'undefined') {
      const key = e.file.response.key
      data.url = `https://mallimg.easybao.com/${key}`
      data.uid = key
    }
    return data
  }

  handleChangeBanner = ({ fileList }) => {
    this.setState({
      courseCoverImg: fileList
    })
  }

  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
    if (!isJPG) {
      message.error('你上传的图片格式有误！')
    }
    const isLt300K = file.size / 1024 / 1024 < 2
    if (!isLt300K) {
      message.error('上传的图片不能大于2M!')
    }
    return isJPG && isLt300K
  }

  getUploadButton = () => {
    const picture = this.props.form.getFieldValue('picture')
    if (this.state.isShowType === 'see') {
      if (!picture || isEmpty(picture)) {
        return (
          <div>
            <div className='ant-upload-text'>头像未上传</div>
          </div>
        )
      } else {
        return (
          <img
            src={this.props.form.getFieldValue('picture') ? this.props.form.getFieldValue('picture').url : ''}
            style={{ width: '96px', height: '96px' }}
          />
        )
      }
    } else if (this.state.isShowType === 'edit') {
      if (!picture || isEmpty(picture) || picture.status === 'removed') {
        return (
          <div>
            <Icon type='plus' />
            <div className='ant-upload-text'>上传头像</div>
          </div>
        )
      } else {
        return (
          <img
            src={this.props.form.getFieldValue('picture') ? this.props.form.getFieldValue('picture').url : ''}
            style={{ width: '94px', height: '94px', marginTop: '-20px' }}
          />
        )
      }
    } else {
      if (!picture || isEmpty(picture) || picture.status === 'removed' || picture.size / 1024 / 1024 > 2) {
        return (
          <div>
            <Icon type='plus' />
            <div className='ant-upload-text'>上传头像</div>
          </div>
        )
      } else if (picture) {
        return (
          <img
            src={picture ? picture.url : ''}
            style={{ width: '100px', height: '100px' }}
          />
        )
      }
    }
  }

  _coverCancel = () => this.setState({ previewVisible: false })

  _renderButton = (loadingBtn, nurseList, getSaveData) => {
    if (this.state.isShowType === 'see') {
      return false
    } else if (this.state.isShowType === 'edit') {
      return (
        <FormItem>
          <Button
            type='default'
            onClick={() => history.go(-1)}
          >返回
          </Button>
          <Button
            onClick={() => { this._handleModify(nurseList) }}
            type='primary'
            loading={loadingBtn}
          >保存
          </Button>
        </FormItem>
      )
    } else {
      return (
        <FormItem>
          <Button
            type='default'
            onClick={() => history.go(-1)}
          >返回
          </Button>
          <Button
            disabled={getSaveData.number ? Boolean(1) : Boolean(0)}
            onClick={() => { this._handleSubmit(nurseList) }}
            type='primary'
            loading={loadingBtn}
          >保存
          </Button>
        </FormItem>
      )
    }
  }

  _handleSelect = (value, nurseList) => {
    return nurseList.filter(item => {
      return item.nurseId === value.processor
    }).map(org => {
      return {
        centerId: org.centerId,
        centerName: org.centerName,
        processorName: org.nurseName,
      }
    })
  }

  _getInitivalPic = (basicInfo, getSaveData) => {
    if (basicInfo.picture) {
      return {
        url: `https://mallimg.easybao.com/${basicInfo.picture}`,
        uid: basicInfo.picture
      }
    } else if (getSaveData.picture) {
      return {
        url: `https://mallimg.easybao.com/${getSaveData.picture}`,
        uid: getSaveData.picture
      }
    } else {
      return undefined
    }
  }

  _getBirthday = (basicInfo, getSaveData) => {
    if (basicInfo.birthday) {
      return moment(new Date(basicInfo.birthday), 'YYYY-MM-DD')
    } else if (getSaveData.birthday) {
      return moment(new Date(getSaveData.birthday), 'YYYY-MM-DD')
    } else {
      return undefined
    }
  }

  // 删除宝宝
  _handleRemoveBaby = (index) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    let babyList = getFieldValue('babyList')
    let setData = {}
    // 处理 其他的表单信息
    if (index < babyList.length - 1) {
      for (let i = index; i + 1 <= babyList.length - 1; i++) {
        setData[`name${i}`] = getFieldValue(`name${i + 1}`)
        setData[`sex${i}`] = getFieldValue(`sex${i + 1}`)
        setData[`birthday${i}`] = getFieldValue(`birthday${i + 1}`)
        setData[`remark${i}`] = getFieldValue(`remark${i + 1}`)
      }
      setData[`name${babyList.length - 1}`] = undefined
      setData[`sex${babyList.length - 1}`] = undefined
      setData[`birthday${babyList.length - 1}`] = undefined
      setData[`remark${babyList.length - 1}`] = undefined
    } else {
      setData[`name${index}`] = undefined
      setData[`sex${index}`] = undefined
      setData[`birthday${index}`] = undefined
      setData[`remark${index}`] = undefined
    }

    babyList.splice(index, 1)
    setFieldsValue({
      babyList,
      ...setData
    })
  }
  // 宝宝信息
  _renderBabyInfo = (basicInfo) => {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { id } = this.state
    let babyList = getFieldValue('babyList')
    return (
      babyList.map((baby, i) => {
        baby.id && getFieldDecorator(`id${i}`, { initialValue: baby.id })
        return (
          <div key={i}>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='宝宝名'
                >
                  {getFieldDecorator(`name${i}`, {
                    initialValue: baby ? baby.name : '',
                    rules: [{
                      required: true,
                      message: '请填写宝宝名称'
                    }],
                  })(
                    <Input
                      maxLength='20'
                      placeholder='宝宝名'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='宝宝性别'
                >
                  {getFieldDecorator(`sex${i}`, {
                    initialValue: baby.sex ? baby.sex : undefined,
                    rules: [{
                      required: true,
                      message: '请输入宝宝性别'
                    }],
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('expectedTime')}
                      placeholder='宝宝性别'
                    >
                      <Option value={'0'}>女</Option>
                      <Option value={'1'}>男</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={1} offset={1}>
                {
                  !id &&
                  <Icon
                    type='minus'
                    className={style['baby-minus']}
                    onClick={() => { this._handleRemoveBaby(i) }}
                  />
                }

              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='宝宝生日'
                >
                  {getFieldDecorator(`birthday${i}`, {
                    initialValue: baby.birthday
                      ? moment(new Date(baby.birthday), 'YYYY-MM-DD')
                      : undefined,
                  })(
                    <DatePicker
                      disabledDate={this.disabledBeforeToday}
                      getCalendarContainer={() => document.getElementById('expectedTime')}
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      placeholder='宝宝生日'
                      showTime={false}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label='备注'
                  {...formItemLayout1}
                >
                  {getFieldDecorator(`remark${i}`, {
                    initialValue: baby.remark ? baby.remark : undefined,
                  })(
                    <TextArea
                      maxLength='500'
                      placeholder='请输入备注'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        )
      })
    )
  }

  // 添加宝宝信息
  _addBabyInfo = () => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let babyList = getFieldValue('babyList')
    babyList.push({
      name: undefined,
      sex: undefined,
      birthday: undefined,
      remark: undefined,
    })
    setFieldsValue({ babyList })
    return babyList
  }

  // 会员类型变化事件
  _handleCustomerTypeChange = (value) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    const isShowPre = value.toString() === '1'
    const babyList = getFieldValue('babyList')
    const setData = {}
    if (!isShowPre) {
      // 清空表单
      babyList.length > 0 && babyList.forEach((baby, i) => {
        setData[`name${i}`] = undefined
        setData[`sex${i}`] = undefined
        setData[`birthday${i}`] = undefined
        setData[`remark${i}`] = undefined
      })
      setFieldsValue({ ...setData, babyList: [] })
    }
    this.setState({ isShowPre })
  }

  // 会员类型
  _renderMemberType = (basicInfo) => {
    const { getFieldDecorator } = this.props.form
    const { getSaveData } = this.props
    const { isShowType, isSeeInfo } = this.state
    return (
      <FormItem
        {...formItemLayout}
        label='会员类型'
      >
        <div
          id='type'
          style={{ position: 'relative' }}
        >
          {getFieldDecorator('type', {
            initialValue: getSaveData.type || basicInfo.type || undefined,
            rules: [{
              required: true,
              message: '请选择会员类型'
            }],
          })(
            <Select
              disabled={isSeeInfo || isShowType === 'edit'}
              onChange={this._handleCustomerTypeChange}
              getPopupContainer={() => document.getElementById('type')}
              placeholder='会员类型'
            >
              <Option value={1}>妈妈会员</Option>
              <Option value={2}>登记客户</Option>
            </Select>
          )}
        </div>
      </FormItem>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, courseCoverImg, isSeeInfo, isShowType, isShowPre } = this.state
    const { loadingBtn, nurseList, getSaveData, cityList } = this.props
    let basicInfo = {}
    if (location.pathname === `/maternity/materCustomerManage/add/basic` || location.pathname === `/maternity/materCustomerManage/add/pre`) {
      basicInfo = {}
    } else {
      basicInfo = this.props.basicInfo
    }
    let pregnant = (basicInfo && basicInfo.pregnant) ? basicInfo.pregnant : {}
    let defaultCity = (pregnant && pregnant.provCode) ? [pregnant.provCode, pregnant.cityCode, pregnant.distCode] : []
    getFieldDecorator('babyList', { initialValue: (basicInfo && basicInfo.babyList) ? basicInfo.babyList : [] })
    return (
      <div>
        {
          basicInfo &&
          <div>
            {
              basicInfo.type === 0
                ? <SeeBaby babyInfo ={basicInfo} />
                : <Form>
                  <div className={style['card-title']}><p>&nbsp;</p></div>
                  <Row>
                    <Col span={8}>
                      {
                        (isShowType === 'see' || isShowType === 'edit')
                          ? <FormItem
                            {...formItemLayout}
                            label='客户编号'
                          >
                            {getSaveData.number || basicInfo.number}
                          </FormItem>
                          : this._renderMemberType(basicInfo)
                      }

                      <FormItem
                        {...formItemLayout}
                        label='跟进阶段'
                      >
                        <div
                          id='process'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('process', {
                            initialValue: getSaveData.process || basicInfo.process || undefined,
                            rules: [{
                              required: true,
                              message: '跟进阶段必填',
                            }],
                          })(
                            <Select
                              disabled={isSeeInfo}
                              getPopupContainer={() => document.getElementById('process')}
                              placeholder='跟进阶段'
                            >
                              <Option value={1}>潜在用户</Option>
                              <Option value={2}>意向用户</Option>
                              <Option value={3}>签单用户</Option>
                              <Option value={4}>正式客户</Option>
                            </Select>
                          )}
                        </div>
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='会员姓名'
                      >
                        {getFieldDecorator('name', {
                          initialValue: getSaveData.name || basicInfo.name || undefined,
                          rules: [{
                            required: true,
                            message: '会员姓名必填',
                          }, {
                            validator: this.nameValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder='会员姓名'
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='手机号码'
                      >
                        {getFieldDecorator('mobile', {
                          initialValue: getSaveData.mobile || basicInfo.mobile || undefined,
                          rules: [{
                            required: true,
                            message: '手机号码必填',
                          }, {
                            validator: this.phoneValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder='手机号码'
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='昵称'
                      >
                        {getFieldDecorator('nickName', {
                          initialValue: getSaveData.nickName || basicInfo.nickName || undefined,
                          rules: [{
                            required: false,
                          }, {
                            validator: this.nickNameValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : '昵称'}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='QQ号'
                      >
                        {getFieldDecorator('qq', {
                          initialValue: getSaveData.qq || basicInfo.qq || undefined,
                          rules: [{
                            required: false,
                          }, {
                            validator: this.qqValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : 'QQ号'}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='电子邮件'
                      >
                        {getFieldDecorator('email', {
                          initialValue: getSaveData.email || basicInfo.email || undefined,
                          rules: [{
                            required: false,
                          }, {
                            validator: this.emailValide
                          }],
                        })(
                          <Input
                            maxLength='50'
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : '电子邮件'}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      {(isShowType === 'see' || isShowType === 'edit') && this._renderMemberType(basicInfo)}
                      <FormItem
                        {...formItemLayout}
                        label='客户来源'
                      >
                        <div
                          id='source'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('source', {
                            initialValue: getSaveData.source || basicInfo.source || undefined,
                            rules: [{
                              required: true,
                              message: '客户来源必填'
                            }],
                          })(
                            <Select
                              disabled={isSeeInfo}
                              getPopupContainer={() => document.getElementById('source')}
                              placeholder='客户来源'
                            >
                              <Option value={'1'}>客户介绍</Option>
                              <Option value={'2'}>来访咨询</Option>
                            </Select>
                          )}
                        </div>
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='性别'
                      >
                        <div
                          id='sex'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('sex', {
                            initialValue: getSaveData.sex || basicInfo.sex || undefined,
                            rules: [{
                              required: true,
                              message: '性别必填'
                            }],
                          })(
                            <Select
                              disabled={isSeeInfo}
                              getPopupContainer={() => document.getElementById('sex')}
                              placeholder='性别'
                            >
                              <Option value={'0'}>女</Option>
                              <Option value={'1'}>男</Option>
                            </Select>
                          )}
                        </div>
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='身份证号码'
                      >
                        {getFieldDecorator('idcard', {
                          initialValue: getSaveData.idcard || basicInfo.idcard || undefined,
                          rules: [{
                            required: true,
                            message: '身份证号码必填',
                          }, {
                            validator: this.idcardValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            maxLength='18'
                            placeholder={this.state.isShowType === 'see' ? ' ' : '请输入身份证号码'}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='生日'
                      >
                        <div
                          id='birthday'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('birthday', {
                            initialValue: this._getBirthday(basicInfo, getSaveData),
                          })(
                            <DatePicker
                              disabled={isSeeInfo}
                              getCalendarContainer={() => document.getElementById('birthday')}
                              showTime={false}
                              style={{ width: '100%' }}
                              format='YYYY-MM-DD'
                              placeholder={this.state.isShowType === 'see' ? ' ' : '生日'}
                              disabledDate={this.disabledDate}
                            />
                          )}
                        </div>
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='微信号'
                      >
                        {getFieldDecorator('wechat', {
                          initialValue: getSaveData.wechat || basicInfo.wechat || undefined,
                          rules: [{
                            required: false,
                          }, {
                            validator: this.wechatValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : '微信号'}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='跟进人员'
                      >
                        <div
                          id='processor'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('processor', {
                            initialValue: getSaveData.processor || basicInfo.processor || undefined,
                            rules: [{
                              required: true,
                              message: '跟进人员必填',
                            }],
                          })(
                            <Select
                              disabled={isSeeInfo}
                              getPopupContainer={() => document.getElementById('processor')}
                              placeholder='跟进人员'
                            >
                              {nurseList.map((nurse, index) => {
                                return (
                                  <Option
                                    key={index}
                                    value={nurse.nurseId}
                                  >{nurse.nurseName}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </div>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      {
                        !isSeeInfo
                          ? <FormItem
                            {...formItemLayout}
                            label='头像'
                          >
                            {getFieldDecorator('picture', {
                              getValueFromEvent: this.projectImgUpload,
                              initialValue: this._getInitivalPic(basicInfo, getSaveData),
                            })(
                              <Upload
                                disabled={isSeeInfo}
                                action='http://upload.qiniu.com'
                                listType='picture-card'
                                fileList={courseCoverImg}
                                onChange={this.handleChangeBanner}
                                onPreview={this._handlePreview}
                                beforeUpload={this.beforeUpload}
                                data={{ token: this.props.qiniuToken }}
                                accept='image/jpg, image/jpeg, image/png'
                              >
                                {courseCoverImg.length > 0 ? null : this.getUploadButton()}
                              </Upload>
                            )}
                            <Modal
                              visible={previewVisible}
                              footer={null}
                              onCancel={this._coverCancel}
                            >
                              <img
                                alt='example'
                                style={{ width: '100%' }}
                                src={previewImage}
                              />
                            </Modal>
                          </FormItem>
                          : <FormItem
                            {...formItemLayout}
                            label='头像'
                          >
                            {
                              (basicInfo && basicInfo.picture) && <img src={`https://mallimg.easybao.com/${basicInfo.picture}`} style ={{ width: '100px', height: '100px' }} />
                            }

                          </FormItem>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label='住址'
                      >
                        {getFieldDecorator('address', {
                          initialValue: getSaveData.address || basicInfo.address || '',
                          rules: [{
                            required: false,
                          }, {
                            validator: this.addressValide
                          }],
                        })(
                          <Input
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : '住址'}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        {...formItemLayout1}
                        label='备注'
                      >
                        {getFieldDecorator('remark', {
                          initialValue: getSaveData.remark || basicInfo.remark || '',
                          rules: [{
                            required: false,
                          }, {
                            validator: this.remarkValide
                          }],
                        })(
                          <TextArea
                            disabled={isSeeInfo}
                            placeholder={this.state.isShowType === 'see' ? ' ' : '备注'}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {
                    (!isSeeInfo && (isShowPre || (basicInfo && basicInfo.type === 1))) &&
                    <div>
                      <h3 className={style['section-tit']}>预产信息</h3>
                      <Row id='expectedTime'>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label='预产期'
                          >
                            {getFieldDecorator('expectedTime', {
                              initialValue: pregnant.expectedTime ? moment(new Date(pregnant.expectedTime), 'YYYY-MM-DD') : undefined,
                            })(
                              <DatePicker
                                getCalendarContainer={() => document.getElementById('expectedTime')}
                                showTime={false}
                                style={{ width: '100%' }}
                                format='YYYY-MM-DD'
                                placeholder='预产期'
                                disabledDate={this.disabledBeforeToday}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label='预产医院'
                          >
                            {getFieldDecorator('hospital', {
                              initialValue: pregnant.hospital || '',
                              rules: [{
                                required: false,
                              }, {
                                validator: this.hospitalValide
                              }],
                            })(
                              <Input
                                placeholder='预产医院'
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
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
                                placeholder='请选择省市区'
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col
                          span={7}
                          offset={1}
                        >
                          <FormItem>
                            {getFieldDecorator('hospitalAddress', {
                              initialValue: pregnant.hospitalAddress || '',
                              rules: [{ required: false, message: '请输入详细地址' }],
                            })(
                              <Input
                                placeholder='详细地址'
                                maxLength='50'
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <FormItem
                            label='预产期备注'
                            {...formItemLayout1}
                          >
                            {getFieldDecorator('pregnantRemark', {
                              initialValue: pregnant.remark || '',
                              rules: [{
                                required: false,
                                message: '预产期备注不能为空',
                              }],
                            })(
                              <TextArea
                                maxLength='500'
                                placeholder='请输入备注'
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label='胎次'
                          >
                            {getFieldDecorator('pregnantCount', {
                              initialValue: pregnant.pregnantCount || undefined,
                              rules: [{
                                pattern: /^[1-9]\d*|0$/,
                                message: '请输入小于10的非负整数'
                              }],
                            })(
                              <InputNumber
                                style={{ width: '100%' }}
                                maxLength='1'
                                max={10}
                                placeholder='胎次'
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label='已有宝宝数'
                          >
                            {getFieldDecorator('babyCount', {
                              initialValue: pregnant.babyCount || '',
                              rules: [{
                                required: false,
                                message: '请输入已有宝宝数',
                              }, {
                                pattern: /^[1-9]\d*|0$/,
                                message: '请输入小于10的非负整数'
                              }],
                            })(
                              <InputNumber
                                style={{ width: '100%' }}
                                maxLength='1'
                                max={10}
                                placeholder='已有宝宝数'
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      {
                        ((isShowType === 'edit' && !isEmpty(basicInfo.babyList)) || isShowType !== 'edit') &&
                        <div>
                          <h3 className={style['section-tit']} >
                            <span>宝宝信息</span>
                            {
                              isShowType !== 'edit' &&
                              <Button size='small' onClick={this._addBabyInfo}>增加宝宝信息</Button>
                            }
                          </h3>
                          {this._renderBabyInfo(basicInfo)}
                        </div>
                      }
                    </div>
                  }
                  <Row
                    className={style['handle-box']}
                  >
                    {this._renderButton(loadingBtn, nurseList, getSaveData)}
                  </Row>
                </Form>
            }
          </div>
        }

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loadingBtn: state.common.showButtonSpin,
    qiniuToken: state.common.qiniuToken,

    basicInfo: state.customerManage.getBasicInfo,
    nurseList: state.customerManage.getNurseList,
    getSaveData: state.customerManage.getSaveData,
    cityList: state.customerManage.getCityList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddBasic))

