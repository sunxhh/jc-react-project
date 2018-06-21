import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Card, Row, Col, Form, Input, Select, DatePicker, Button, Cascader, message, Icon, Modal, Radio } from 'antd'
import moment from 'moment'
import Module from './module'
import styles from './style.less'
import storage from 'Utils/storage'
import { getUrlParam } from 'Utils/params'
import { isEmpty } from 'Utils/lang'
import ImageUpload from 'Components/upload/aliUpload'
import { getAliToken } from 'Global/action'
import CustomField, { validateField, getInitailFieldValue, getFieldsValue } from '../customFields/customField'
import PetInfo from './petInfo'

const FormItem = Form.Item
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const petOrgCode = 'jcpet'

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传照片</div>
  </div>
)

class MemberEdit extends Component {
  constructor(props) {
    super(props)
    // 获取级别
    const userInfo = storage.get('userInfo')
    this.state = {
      mobile: '', // 传入手机号
      orgCode: '', // 默认产业Code
      hasUserInfo: false, // 在产业里是否有该会员信息
      coverImages: [], // 封面图片
      previewVisible: false,
      previewImage: '',
      area: [],
      basicInfo: {},
      orgMemeberInfo: {},
      memberDetail: {},
      isEdit: !!((props.match.params && props.match.params.userId)),
      showShopSelect: true,
      userInfo: userInfo,
      orgLevel: userInfo.orgLevel,
      showPetModal: false,
      petInfo: {},
      petOpenId: undefined,
    }
  }

  componentWillMount() {
    const { match, dispatch } = this.props
    const { isEdit, orgLevel } = this.state
    dispatch(Module.actions.getRegionList({}))
    dispatch(getAliToken())
    if (isEdit) {
      const userId = match.params.userId
      dispatch(Module.actions.getBasicDetail({ userId })).then(res => {
        if (res.status === 'success') {
          let area = []
          !isEmpty(res.result.location) && res.result.location.forEach(item => {
            area.push([Object.keys(item)[0], Object.values(item)[0]])
          })
          this.setState({
            basicInfo: res.result,
            area: area,
            coverImages: res.result.faceImageUrl ? [{ uid: res.result.faceImageUrl, url: res.result.faceImageUrl }] : []
          }, () => {
            let orgList = res.result.orgList
            let orgCode = ''
            if (!isEmpty(orgList)) {
              // 超级管理员默认选中第一个
              if (orgLevel === '0') {
                orgCode = orgList[0].orgCode
              } else {
                orgCode = res.result.currentOrgCode
              }
              // 获取二级门店
              dispatch(Module.actions.getSubOrgList({ orgCode }))
              dispatch(Module.actions.getOrgMemberDetail({ userId, orgCode })).then(res => {
                if (res.status === 'success') {
                  this.setState({
                    orgCode,
                    showShopSelect: res.result.shopAllFlag === '' || res.result.shopAllFlag === '0',
                    orgMemeberInfo: res.result,
                  })
                }
              })
            }
          })
        }
      })
    } else {
      const mobileNo = getUrlParam('mobileNo')
      const orgCode = getUrlParam('orgCode')
      this.setState({
        mobile: mobileNo,
        orgCode
      }, () => {
        dispatch(Module.actions.getMemberQuery({ mobileNo, orgCode })).then(res => {
          if (res.status === 'success') {
            let area = []
            !isEmpty(res.result.location) && res.result.location.forEach(item => {
              area.push([Object.keys(item)[0], Object.values(item)[0]])
            })
            this.setState({
              memberDetail: res.result,
              area: area,
              coverImages: res.result.faceImageUrl ? [{ uid: res.result.faceImageUrl, url: res.result.faceImageUrl }] : []
            })
          }
        })
      })
      // 获取所有的一级机构
      dispatch(Module.actions.getOrgList({ org: { orgMod: '1', orgLevel: '1' }}))
      // 获取二级门店
      dispatch(Module.actions.getSubOrgList({ orgCode }))
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch, history } = this.props
    const { memberDetail, basicInfo, orgCode, coverImages, area, isEdit, orgMemeberInfo, userInfo, orgLevel } = this.state
    const info = isEdit ? basicInfo : memberDetail
    form.validateFields((err, values) => {
      if (!err) {
        const orgExtField = getFieldsValue(values, isEdit ? orgMemeberInfo.customFields : info.customFields)
        dispatch(Module.actions.addMember({
          userId: info.userId || '',
          orgCode,
          employeeNo: values.employeeNo,
          isWithin: values.isWithin,
          userName: values.userName,
          gender: values.gender,
          birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
          locations: area,
          address: values.address,
          zipCode: values.zipCode,
          mobileNo: values.mobileNo,
          email: values.email,
          certType: values.certType,
          certNo: values.certNo,
          telephone: values.telephone,
          education: values.education,
          shopAllFlag: orgLevel === '2' ? '0' : values.shopAllFlag, // 二级机构 是否适用全部门店 否
          dateLimit: values.dateLimit,
          faceImageUrl: isEmpty(coverImages) ? '' : coverImages[0].url,
          orgExtField,
          avatarUrl: info.avatarUrl,
          shopCodes: isEmpty(values.shopCodes)
            ? (orgLevel === '2' ? [{ 'shopCode': userInfo.orgCode }] : [{ 'shopCode': '0' }])
            : values.shopCodes.map(shopCode => {
              return { shopCode }
            }),
        }, isEdit, history))
      }
    })
  }

  // 上传图片预览弹层
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
      message.error('上传的图片不能大于1M!')
    }
    return isFormat && isLt1M
  }

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ coverImages: fileList })
  }

  _handleCoverRemove = (file) => {
    this.setState({ coverImages: [] })
  }

  // 上传图片预览弹层取消
  _previewCancel = () => this.setState({ previewVisible: false })

  _handleChange = (e) => {
    const { isEdit } = this.state
    const { dispatch, form, match } = this.props
    const orgCode = e.target.value
    const userId = match.params.userId
    form.resetFields(['shopCodes', 'dateLimit'])
    this.setState({
      orgCode,
    }, () => {
      dispatch(Module.actions.getSubOrgList({ orgCode }))
      if (isEdit) {
        dispatch(Module.actions.getOrgMemberDetail({ userId, orgCode })).then(res => {
          if (res.status === 'success') {
            this.setState({
              orgCode,
              showShopSelect: res.result.shopAllFlag === '' || res.result.shopAllFlag === '0',
              orgMemeberInfo: res.result
            }, () => {
              form.setFieldsValue({ shopAllFlag: res.result.shopAllFlag })
            })
          }
        })
      }
    })
  }

  _handleRadioChange = (e) => {
    if (e.target.value === '1') {
      this.setState({
        showShopSelect: false
      })
    } else if (e.target.value === '0') {
      this.setState({
        showShopSelect: true
      })
    }
  }

  _changeArea = (value, option) => {
    const areaOption = []
    option.map(item => (
      areaOption.push(
        [item.value, item.label]
      )
    ))
    this.setState(
      {
        area: areaOption
      }
    )
  }

  _getRadioButton = () => {
    const { orgList } = this.props
    const { orgCode, basicInfo, isEdit, orgLevel } = this.state
    let arr = []
    if (isEdit && !isEmpty(basicInfo.orgList)) {
      if (orgLevel === '0') {
        arr = basicInfo.orgList
      } else {
        arr = basicInfo.orgList.filter(org => org.orgCode === basicInfo.currentOrgCode)
      }
    } else {
      // 从全部的一级机构拿
      arr = isEmpty(orgList.myOrgList) ? [] : orgList.myOrgList.filter(org => {
        return org.orgCode === orgCode
      })
    }
    return orgCode ? (
      <RadioGroup defaultValue={orgCode} size='small' onChange={this._handleChange}>
        {
          !isEmpty(arr) && arr.map(item => (
            <RadioButton style={{ float: 'left' }} key={item.orgCode} value={item.orgCode}>{item.orgName}</RadioButton>
          ))
        }
      </RadioGroup>
    ) : null
  }

  _getCustomFields = () => {
    const { getFieldDecorator } = this.props.form
    const { isEdit, orgMemeberInfo, memberDetail } = this.state
    if (!isEmpty(orgMemeberInfo.customFields)) {
      orgMemeberInfo.customFields = orgMemeberInfo.customFields.map(customField => {
        const field = isEmpty(orgMemeberInfo.fieldExtInfo) ? undefined : orgMemeberInfo.fieldExtInfo.find(info => {
          return info.fieldName === customField.fieldName
        })
        customField['fieldValue'] = (!isEmpty(field) && field['fieldValue']) ? field['fieldValue'] : undefined
        customField['id'] = (!isEmpty(field) && field['id']) ? field['id'] : undefined
        return customField
      })
    }
    const data = isEdit ? orgMemeberInfo.customFields : memberDetail.customFields
    return isEmpty(data) ? null : data.map(item => {
      return (
        <Row
          key={item.fieldId}
        >
          <Col span={10}>
            <FormItem
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              label={item.fieldLabel || '--'}
            >
              {getFieldDecorator(`${item.fieldName}`, {
                rules: [{
                  validator: validateField(item.componentType)
                }],
                initialValue: getInitailFieldValue(item.componentType, item.fieldValue),
              })(
                <CustomField
                  fieldLabel={item.fieldLabel}
                  options={item.options}
                  getPopContainer={() => document.getElementById('customField')}
                  componentType={item.componentType}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    })
  }

  // 宠物会员单独处理
  _handleViewPet = () => {
    const { dispatch } = this.props
    const { basicInfo } = this.state
    dispatch(Module.actions.getPetInfo({ userNo: basicInfo.userId })).then(res => {
      if (res.status === 'success') {
        const petOpenId = (!isEmpty(res.result) && !isEmpty(res.result.memberInfo)) ? res.result.memberInfo.openId : undefined
        this.setState({ petInfo: res.result, showPetModal: true, petOpenId })
      }
    })
  }

  // 组件内部设置状态
  _setPetInfo = (data) => {
    this.setState(data)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { regionList, aliToken, subOrgList } = this.props
    const { coverImages, previewVisible, previewImage, mobile, isEdit, basicInfo, memberDetail, orgMemeberInfo, showShopSelect, userInfo, orgLevel, showPetModal, petInfo, petOpenId, orgCode } = this.state
    const info = isEdit ? basicInfo : memberDetail
    const locationArr = []
    !isEmpty(info) && !isEmpty(info.location) && info.location.forEach(item => {
      locationArr.push(Object.keys(item)[0])
    })
    return (
      <Form onSubmit={this._handleSubmit}>
        <Card
          title='基本信息'
        >
          {
            isEdit &&
            <Row>
              <Col span={10}>
                <FormItem
                  {...formItemLayout}
                  label='用户ID'
                >
                  {!isEmpty(info) ? info.userId : ''}
                </FormItem>
              </Col>
            </Row>
          }
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='会员姓名'
              >
                {getFieldDecorator('userName', {
                  rules: [{
                    required: !isEdit,
                    message: '会员姓名不能为空',
                  }],
                  initialValue: !isEmpty(info) ? info.userName : '',
                })(
                  <Input
                    maxLength='10'
                    disabled={isEdit}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='联系方式'
              >
                {getFieldDecorator('mobileNo', {
                  rules: [{
                    required: true,
                    message: '联系方式不能为空',
                  }],
                  initialValue: isEdit ? basicInfo.mobileNo : mobile
                })(
                  <Input
                    maxLength='11'
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='性别'
              >
                <div id='gender' style={{ position: 'relative' }}>
                  {getFieldDecorator('gender', {
                    initialValue: isEmpty(info) ? undefined : info.gender,
                  })(
                    <Select
                      placeholder='请选择性别'
                      required={true}
                      style={{ width: 150 }}
                      getPopupContainer={() => document.getElementById('gender')}
                    >
                      <Option key='0'>男</Option>
                      <Option key='1'>女</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='学历'
              >
                <div id='education' style={{ position: 'relative' }}>
                  {getFieldDecorator('education', {
                    initialValue: isEmpty(info) ? undefined : info.education,
                  })(
                    <Select
                      placeholder='请选择学历'
                      required={true}
                      style={{ width: 150 }}
                      getPopupContainer={() => document.getElementById('education')}
                    >
                      <Option key='0'>大专以下</Option>
                      <Option key='1'>大专</Option>
                      <Option key='2'>本科</Option>
                      <Option key='3'>硕士</Option>
                      <Option key='4'>博士</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div id='birthday' style={{ position: 'relative' }}>
                <FormItem
                  {...formItemLayout}
                  label='出生日期'
                >
                  {getFieldDecorator('birthday', {
                    initialValue: (!isEmpty(info) && info.birthday) ? moment(info.birthday) : undefined,
                  })(
                    <DatePicker
                      placeholder='请选择出生日期'
                      getCalendarContainer={() => document.getElementById('birthday')}
                    />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div id='regionList' style={{ position: 'relative' }}>
                <FormItem
                  {...formItemLayout}
                  label='地区'
                >
                  {getFieldDecorator('locations', {
                    initialValue: isEmpty(locationArr) ? undefined : locationArr
                  })(
                    <Cascader
                      placeholder='请选择地区'
                      onChange={this._changeArea}
                      options={regionList}
                      getPopupContainer={() => document.getElementById('regionList')}
                    />
                  )}
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='住址'
              >
                {getFieldDecorator('address', {
                  initialValue: isEmpty(info) ? undefined : info.address,
                })(
                  <Input
                    maxLength='30'
                    placeholder='请填写住址'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='邮政编码'
              >
                {getFieldDecorator('zipCode', {
                  initialValue: isEmpty(info) ? undefined : info.zipCode,
                  rules: [{
                    pattern: /^\d*$/,
                    message: '邮政编码只支持数字！'
                  }]
                })(
                  <Input
                    maxLength='10'
                    placeholder='请填写邮政编码'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='固定电话'
              >
                {getFieldDecorator('telephone', {
                  initialValue: isEmpty(info) ? undefined : info.telephone,
                  rules: [{
                    pattern: /^\d*$/,
                    message: '固定电话只支持数字！'
                  }]
                })(
                  <Input
                    maxLength='15'
                    placeholder='请填写固定电话'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='电子邮件'
              >
                {getFieldDecorator('email', {
                  initialValue: isEmpty(info) ? undefined : info.email,
                })(
                  <Input
                    maxLength='50'
                    placeholder='请填写电子邮件'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <div id='certType' style={{ position: 'relative' }}>
                <FormItem
                  {...formItemLayout}
                  label='证件类型'
                >
                  {getFieldDecorator('certType', {
                    initialValue: isEmpty(info) ? undefined : info.certType,
                  })(
                    <Select
                      placeholder='请选择证件类型'
                      required={true}
                      style={{ width: 150 }}
                      getPopupContainer={() => document.getElementById('certType')}
                    >
                      <Option key='0'>身份证</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='证件号码'
              >
                {getFieldDecorator('certNo', {
                  initialValue: isEmpty(info) ? undefined : info.certNo,
                  rules: [{
                    pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                    message: '请输入正确的证件号码！'
                  }]
                })(
                  <Input
                    maxLength='18'
                    placeholder='请填写证件号码'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='员工编号'
              >
                {getFieldDecorator('employeeNo', {
                  initialValue: isEmpty(info) ? undefined : info.employeeNo,
                })(
                  <Input
                    maxLength='10'
                    placeholder='请填写员工编号'
                  />
                )}
              </FormItem>
            </Col>

            {
              !isEmpty(info) && !isEmpty(info.memCardNo) && info.memCardNo !== '' && (
                <Col span={10}>
                  <FormItem
                    {...formItemLayout}
                    label='会员卡号'
                  >
                    {getFieldDecorator('memCardNo', {
                      initialValue: info.memCardNo,
                    })(
                      <Input
                        disabled={true}
                      />
                    )}
                  </FormItem>
                </Col>
              )
            }
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='是否内部用户'
              >
                <div id='isWithin' style={{ position: 'relative' }}>
                  {getFieldDecorator('isWithin', {
                    initialValue: isEmpty(info) ? undefined : info.isWithin,
                  })(
                    <Select
                      placeholder='请选择'
                      required={true}
                      style={{ width: 150 }}
                      getPopupContainer={() => document.getElementById('isWithin')}
                    >
                      <Option key='1'>是</Option>
                      <Option key='0'>否</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                style={{ marginBottom: '5px' }}
                {...formItemLayout}
                label='人脸识别'
              >
                {getFieldDecorator('faceImageUrl', {
                  fileList: (!isEmpty(info) && info.faceImageUrl) ? coverImages : []
                })(
                  <ImageUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={this._handleCoverChange}
                    onRemove={this._handleCoverRemove}
                    aliToken={aliToken}
                    rootPath='member'
                    fileList={coverImages}
                    accept='image/jpg, image/jpeg, image/png'
                  >
                    {coverImages.length >= 1 ? null : uploadButton}
                  </ImageUpload>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              请上传免冠正面头像，60*60 ，1M以内
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={
            <div>
              <div style={{ float: 'left', marginRight: 10 }} >完善产业信息</div>
              <div>{this._getRadioButton()}</div>
            </div>
          }
        >
          <Row>
            <Col span={10}>
              <FormItem
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                label='会员等级'
              >
                {orgMemeberInfo.memberLevel}
              </FormItem>
            </Col>
          </Row>
          {
            orgLevel !== '2' &&
              <Row>
                <Col span={10}>
                  <FormItem
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 15 }}
                    label='适用全部门店'
                  >
                    {getFieldDecorator('shopAllFlag', {
                      initialValue: orgMemeberInfo.shopAllFlag,
                      rules: [{
                        required: true,
                        message: '请选择',
                      }],
                    })(
                      <RadioGroup onChange={this._handleRadioChange}>
                        <Radio value='1'>是</Radio>
                        <Radio value='0'>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
          }

          {
            showShopSelect && (
              <Row>
                <Col span={10}>
                  <div id='shopCodes' style={{ position: 'relative' }}>
                    <FormItem
                      labelCol={{ span: 9 }}
                      wrapperCol={{ span: 15 }}
                      label='归属门店'
                    >
                      {getFieldDecorator('shopCodes', {
                        initialValue:
                        isEmpty(orgMemeberInfo.shopList)
                          ? (orgLevel === '2' ? [userInfo.orgCode] : [])
                          : orgMemeberInfo.shopList.map(item => { return item.shopCode }),
                        rules: [{
                          required: true,
                          message: '请选择归属门店',
                        }],
                      })(
                        <Select
                          placeholder='请选择'
                          mode='multiple'
                          disabled={orgLevel === '2'}
                          required={true}
                          getPopupContainer={() => document.getElementById('shopCodes')}
                        >
                          {
                            subOrgList && subOrgList.map(item => (
                              <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                            )
                            )
                          }
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </Col>
              </Row>
            )
          }
          <Row>
            <Col span={10}>
              <FormItem
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                label='会员有效期'
              >
                <div id='dateLimit' style={{ position: 'relative' }}>
                  {getFieldDecorator('dateLimit', {
                    initialValue: (!isEmpty(orgMemeberInfo) && orgMemeberInfo.dateLimit) ? orgMemeberInfo.dateLimit : undefined,
                    rules: [{
                      required: true,
                      message: '请选择会员有效期',
                    }],
                  })(
                    <Select
                      placeholder='请选择'
                      required={true}
                      style={{ width: 150 }}
                      getPopupContainer={() => document.getElementById('dateLimit')}
                    >
                      <Option key='0'>无过期</Option>
                      <Option key='1'>1年</Option>
                      <Option key='2'>2年</Option>
                      <Option key='3'>3年</Option>
                      <Option key='4'>5年</Option>
                      <Option key='5'>10年</Option>
                      <Option key='6'>15年</Option>
                      <Option key='7'>20年</Option>
                      <Option key='8'>30年</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>

          <div
            id='customField'
            style={{ position: 'relative' }}
          >
            {
              this._getCustomFields()
            }
          </div>

          {
            isEdit && ((orgCode && orgCode === petOrgCode) ||
            (!orgCode && !isEmpty(basicInfo.orgList) && basicInfo.orgList[0].orgCode === petOrgCode)) &&
            <Button onClick={this._handleViewPet}>查看宠物信息</Button>
          }

          <Row>
            <Col
              span={24}
            >
              <FormItem className={styles['operate-btn']}>
                <Button
                  className={styles['operate-btn-save']}
                  type='primary'
                  title='点击保存'
                  htmlType='submit'
                >
                  保存
                </Button>
                <Button
                  title='点击取消'
                  onClick={() =>
                    history.go(-1)
                  }
                >
                  取消
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Card>
        {
          previewVisible &&
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this._previewCancel}
          >
            <img
              alt='example'
              style={{ width: '100%' }}
              src={previewImage}
            />
          </Modal>
        }
        <PetInfo
          showPetModal={showPetModal}
          petInfo={petInfo}
          setPetInfo = {this._setPetInfo}
          userNo={basicInfo.userId}
          petOpenId={petOpenId}
        />
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.member'],
    auths: state['common.auths'],
    aliToken: state['common.aliToken'],
  }
}

export default connect(['common.showListSpin', 'memberCenter.member', 'common.auths', 'common.aliToken'], mapStateToProps)(Form.create()(MemberEdit))
