import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from '@dx-groups/arthur'
import { Card, Form, Row, Col, Select, message, Icon, Modal, Input, Button } from 'antd'
import ImagesUpload from 'Components/upload/aliUpload'
import { getAliToken } from 'Global/action'
import styles from './styles.less'
import Module from './module'
import { isEmpty } from 'Utils/lang'
import { MEMBER_CARD_ADD_DETAIL } from 'Global/urls'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传图片</div>
  </div>
)
class MemberCardAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orgList: [],
      orgLevel: '',
      currentOrgName: '',
      currentOrgCode: '',
      logoImages: [], // logo图
      backGroundListPicImages: [], // 列表图
      backGroundPicImages: [], // 详页图
      previewVisible: false,
      previewImage: '',
    }
  }

  componentDidMount() {
    const { dispatch, userInfo } = this.props
    // 获取产业或门店
    let orgLevel = userInfo.orgLevel
    this.setState({
      orgLevel: orgLevel,
      currentOrgName: userInfo.orgName,
      currentOrgCode: userInfo.orgCode,
    })
    let org = {}
    if (orgLevel === '0') {
      org = {
        orgMod: '1',
        orgLevel: '1'
      }
      dispatch(Module.actions.getOrgList({ org: org })).then(res => {
        this.setState({
          orgList: res.orgList
        })
      })
    }
    dispatch(getAliToken())
  }

  // 上传图片预览弹层
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 上传图片预览弹层取消
  _previewCancel = () => this.setState({ previewVisible: false })

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt10M = file.size / 1024 / 1024 < 1
    if (!isLt10M) {
      message.error('上传的图片不能大于1M!')
    }
    return isFormat && isLt10M
  }

  // 上传logo图change事件
  _handleLogoChange = ({ fileList }) => {
    this.setState({ logoImages: fileList })
  }

  _handleLogoRemove = () => {
    this.setState({ logoImages: [] })
    this.props.form.setFieldsValue({
      'logoImages': null
    })
  }

  // 上传列表图change事件
  _handleBackGroundListPicChange = ({ fileList }) => {
    this.setState({ backGroundListPicImages: fileList })
  }

  _handleBackGroundListPicRemove = () => {
    this.setState({ backGroundListPicImages: [] })
    this.props.form.setFieldsValue({
      'backGroundListPicImages': null
    })
  }

  // 上传详情图change事件
  _handleBackGroundPicChange = ({ fileList }) => {
    this.setState({ backGroundPicImages: fileList })
  }

  _handleBackGroundPicRemove = () => {
    this.setState({ backGroundPicImages: [] })
    this.props.form.setFieldsValue({
      'backGroundPicImages': null
    })
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    const { logoImages, backGroundListPicImages, backGroundPicImages, currentOrgCode } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        let submitOrgCode = values.orgCode ? values.orgCode : currentOrgCode
        dispatch(Module.actions.addBasicInfo({
          cardBasicReq: {
            orgCode: submitOrgCode,
            useAllLocations: parseInt(values.useAllLocations),
            logoUrl: isEmpty(logoImages) ? '' : logoImages[0].url,
            backGroundListPicUrl: isEmpty(backGroundListPicImages) ? '' : backGroundListPicImages[0].url,
            backGroundPicUrl: isEmpty(backGroundPicImages) ? '' : backGroundPicImages[0].url,
            title: values.title,
            prerogative: values.prerogative,
            description: values.description,
            servicePhone: values.servicePhone,
          }
        })).then(res => {
          if (res.status) {
            dispatch(push(`${MEMBER_CARD_ADD_DETAIL}/${res.result.cardId}/${submitOrgCode}`))
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { aliToken } = this.props
    const { logoImages, backGroundListPicImages, backGroundPicImages, previewVisible, orgList, orgLevel, currentOrgName, previewImage } = this.state
    return (
      <div>
        <Card
          title='第一步：会员卡基本信息'
          bordered={false}
        >
          <Form onSubmit={this._handleSubmit}>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label='所属分类'
                >
                  {
                    orgLevel === '0' &&
                      getFieldDecorator('orgCode', {
                        rules: [{
                          required: true,
                          message: '请选择产业',
                        }]
                      })(
                        <Select
                          placeholder='选择产业'
                          getPopupContainer={trigger => trigger.parentNode}
                        >
                          {
                            !isEmpty(orgList) && !isEmpty(orgList.myOrgList) && orgList.myOrgList.map(item => {
                              return (
                                <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                              )
                            })
                          }
                        </Select>
                      )
                  }
                  {
                    orgLevel === '1' && (
                      <span>{currentOrgName}</span>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label='适用门店'
                >
                  {getFieldDecorator('useAllLocations', {
                    initialValue: '1',
                  })(
                    <Select
                      disabled
                    >
                      <Option key='1'>全门店适用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  label='会员卡logo：'
                >
                  {getFieldDecorator('logoImages', {
                    fileList: logoImages,
                    rules: [{
                      required: true,
                      message: '请上传图片',
                    }]
                  })(
                    <ImagesUpload
                      listType='picture-card'
                      onPreview={this._handlePreview}
                      beforeUpload={this._beforeUpload}
                      onChange={this._handleLogoChange}
                      onRemove={this._handleLogoRemove}
                      aliToken={aliToken}
                      rootPath='member'
                      fileList={logoImages}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {logoImages.length >= 1 ? null : uploadButton}
                    </ImagesUpload>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  label='会员封面图：'
                >
                  <div>
                    {getFieldDecorator('backGroundListPicImages', {
                      fileList: backGroundListPicImages,
                      rules: [{
                        required: true,
                        message: '请上传图片',
                      }]
                    })(
                      <ImagesUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleBackGroundListPicChange}
                        onRemove={this._handleBackGroundListPicRemove}
                        aliToken={aliToken}
                        rootPath='member'
                        fileList={backGroundListPicImages}
                        accept='image/jpg, image/jpeg, image/png'
                      >
                        {backGroundListPicImages.length >= 1 ? null : uploadButton}
                      </ImagesUpload>
                    )}
                  </div>
                  <div style={{ color: '#cccccc' }}>列表图1000*300像素</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  label=' '
                  colon={false}
                >
                  <div>
                    {getFieldDecorator('backGroundPicImages', {
                      fileList: backGroundPicImages,
                      rules: [{
                        required: true,
                        message: '请上传图片',
                      }]
                    })(
                      <ImagesUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleBackGroundPicChange}
                        onRemove={this._handleBackGroundPicRemove}
                        aliToken={aliToken}
                        rootPath='member'
                        fileList={backGroundPicImages}
                        accept='image/jpg, image/jpeg, image/png'
                      >
                        {backGroundPicImages.length >= 1 ? null : uploadButton}
                      </ImagesUpload>
                    )}
                  </div>
                  <div style={{ color: '#cccccc' }}>详页图1000*600像素</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={3} style={{ marginBottom: 10, color: '#cccccc' }}>
                  小于1M，支持jpg、png、jpeg格式
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='会员卡名称'
                >
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true,
                      message: '请填写会员卡名称',
                    }]
                  })(
                    <Input
                      placeholder='请填写会员卡名称'
                      maxLength='12'
                      autocomplete='off'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='会员权益'
                >
                  {getFieldDecorator('prerogative', {
                    rules: [{
                      required: true,
                      message: '请填写会员权益',
                    }]
                  })(
                    <Input
                      placeholder='请填写会员权益'
                      autocomplete='off'
                      maxLength='200'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='使用须知'
                >
                  {getFieldDecorator('description', {
                    rules: [{
                      required: true,
                      message: '请输入该会员卡对应的使用须知说明',
                    }]
                  })(
                    <TextArea
                      rows={4}
                      placeholder='请输入该会员卡对应的使用须知说明'
                      maxLength='200'
                      autocomplete='off'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='客服电话'
                >
                  {getFieldDecorator('servicePhone', {
                    rules: [{
                      required: true,
                      message: '请输入手机号码或者固定电话',
                    }]
                  })(
                    <Input
                      placeholder='请输入手机号码或者固定电话'
                      maxLength='20'
                      autocomplete='off'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles['option-save']}>
              <Col>
                <Button
                  type='primary'
                  title='下一步'
                  htmlType='submit'
                >
                  下一步
                </Button>
              </Col>
            </Row>
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
          </Form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.card'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
    aliToken: state['common.aliToken'],
  }
}

export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'common.aliToken', 'memberCenter.card'], mapStateToProps)(Form.create()(MemberCardAdd))
