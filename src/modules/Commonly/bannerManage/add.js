import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, Modal, message, DatePicker, Select } from 'antd'
import * as actions from './reduck'
import OrderUpload from '../../../components/upload'
import moment from 'moment'
import { getQiniuToken } from '../../../global/action'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

function disabledRangeTime(_, type) {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(24, 7),
      disabledMinutes: () => range(60, 60),
      disabledSeconds: () => [60],
    }
  }
  return {
    disabledHours: () => range(0, 60).splice(24, 7),
    disabledMinutes: () => range(60, 60),
    disabledSeconds: () => [60],
  }
}

function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

// 限制图片大小
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
  if (!isJPG) {
    message.error('你上传的图片格式有误！')
    return false
  }
  const isLt300K = file.size / 1024 / 1024 < 1
  if (!isLt300K) {
    message.error('上传的图片不能大于1M!')
  }
  return isJPG && isLt300K
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewImage: '',
      previewVisible: false,
      bannerImage: []
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const org = {
      orgMod: '1',
      orgLevel: '1'
    }
    dispatch(actions.getOrg({ org: org }))
    dispatch(getQiniuToken())
  }

  _disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let currDate = moment(current).format('YYYY-M-DD')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  _handleChangeBannerImage = ({ fileList }) => {
    this.setState({
      bannerImage: fileList
    })
  }

  getUploadButton = content => (
    <div>
      <Icon type='plus' />
      <div className='ant-upload-text'>{content || '上传照片'}</div>
    </div>
  )

  imageUpload = (e) => {
    return e.fileList.map(e => {
      if (e.response) {
        return e.response.key
      }
      if (e.url) {
        return e.url
      }
    })
  }

  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          orgId: values.organizationId,
          name: values.name,
          sort: values.sort,
          startTime: values.bannerTime[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.bannerTime[1].format('YYYY-MM-DD HH:mm:ss'),
          image: values.image[0],
          url: values.url,
        }
        dispatch(actions.addBanner(reqBean))
      }
    })
  }

  render() {
    const { orgList, token } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, bannerImage } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label='所属机构'
              >
                <div
                  id='organizationId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('organizationId', {
                    rules: [{
                      required: true,
                      message: '请选择所属机构'
                    }],
                    initialValue: orgList.myOrgLevel === '0' ? '' : (orgList.myOrgList && orgList.myOrgList[0].id),
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('organizationId')}
                      disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
                    >
                      {
                        orgList.myOrgList && orgList.myOrgList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.orgName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入25个字符的名称',
                    max: 25
                  }],
                })(
                  <Input
                    placeholder='请输入名称'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='排序'
              >
                {getFieldDecorator('sort', {
                  rules: [{
                    required: true,
                    pattern: /^[1-9]\d{0,3}$/,
                    message: '请填写1-9999范围整数序号'
                  }],
                })(
                  <Input
                    placeholder='请输入排序序号'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '有效时间'
              >
                <div
                  id='bannerTime'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('bannerTime', {
                    rules: [{
                      required: true,
                      message: '请选择有效时间'
                    }],
                  })(
                    <RangePicker
                      getCalendarContainer={() => document.getElementById('bannerTime')}
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={this._disabledDate}
                      disabledTime={disabledRangeTime}
                      showTime={{ hideDisabledOptions: true }}
                    />
                  )}
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '图片'
              >
                {getFieldDecorator('image', {
                  rules: [{
                    required: true,
                    message: '请选择图片'
                  }],
                  getValueFromEvent: this.imageUpload,
                })(
                  <OrderUpload
                    action='http://upload.qiniu.com'
                    listType='picture-card'
                    fileList = {bannerImage}
                    onChange={this._handleChangeBannerImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='mage/jpg, image/png, image/jpeg'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {bannerImage.length > 0 ? null : this.getUploadButton()}
                  </OrderUpload>
                )}
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this._handleCancel}
                >
                  <img
                    alt='example'
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸1920px*700px;
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='URL'
              >
                {getFieldDecorator('url', {
                  rules: [{
                    required: false,
                  }],
                })(
                  <Input
                    placeholder='请输入URL'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem className={styles['handle-box']}>
              <Button
                type='default'
                onClick={() => history.go(-1)}
              >取消
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={this.props.showBtnSpin}
              >保存
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orgList: state.banner.orgData,
    token: state.common.qiniuToken || '',
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
