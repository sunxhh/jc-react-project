import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, Modal, message, DatePicker, Radio } from 'antd'
import * as actions from './reduck'
import OrderUpload from '../../../components/upload'
import EditorDraft from 'Components/Editor'
import moment from 'moment'
import { getQiniuToken } from '../../../global/action'
import styles from './style.less'
// import draftToHtml from 'draftjs-to-html'
// import { convertToRaw } from 'draft-js'

const FormItem = Form.Item
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

const RadioGroup = Radio.Group

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
      activityImage: [],
      isJumpStatus: '',
      isEnrollStatus: '',
      actEndTime: ''
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getQiniuToken())
  }

  _disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let currDate = moment(current).format('YYYY-M-DD')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  _handleChangeBannerImage = ({ fileList }) => {
    this.setState({
      activityImage: fileList
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

  _handleCancel = () => this.setState({ previewVisible: false })

  handleSubmit = (e) => {
    const { dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          name: values.name,
          sort: values.sort,
          startTime: values.activityTime[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.activityTime[1].format('YYYY-MM-DD HH:mm:ss'),
          image: values.image[0],
          forwardFlag: values.forwardFlag,
          forwardUrl: this.state.isJumpStatus === '1' ? values.forwardUrl : null,
          intruduction: this.state.isJumpStatus === '0' ? values.intruduction : null,
          needEnrollFlag: this.state.isJumpStatus === '0' ? values.needEnrollFlag : null,
          enrollStartTime: this.state.isJumpStatus === '0' && this.state.isEnrollStatus === '1' ? values.enrollTime[0].format('YYYY-MM-DD HH:mm:ss') : null,
          enrollEndTime: this.state.isJumpStatus === '0' && this.state.isEnrollStatus === '1' ? values.enrollTime[1].format('YYYY-MM-DD HH:mm:ss') : null,
        }
        dispatch(actions.addActivity(reqBean))
      }
    })
  }

  isJumpChange = (e) => {
    this.setState({
      isJumpStatus: e.target.value
    })
  }

  isEnrollChange = (e) => {
    this.setState({
      isEnrollStatus: e.target.value
    })
  }

  _actTimeChange = (e) => {
    // this.props.form.setFieldsValue({ enrollTime: [] })
    this.setState({
      actEndTime: e.length > 1 ? (e[1].valueOf() + 86400000) : ''
    })
  }

  _disabledEnrollDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let currDate = moment(current).format('YYYY-M-DD')
    return current && (new Date(currDate).valueOf() < new Date(date).valueOf() || current.valueOf() > this.state.actEndTime)
  }

  render() {
    const { token } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, activityImage, isJumpStatus, isEnrollStatus } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label='名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入活动名称',
                  }],
                })(
                  <Input
                    placeholder='请输入活动名称'
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
                    placeholder='请输入排序'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '活动时间'
              >
                <div
                  id='activityTime'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('activityTime', {
                    rules: [{
                      required: true,
                      message: '请选择活动时间'
                    }],
                  })(
                    <RangePicker
                      getCalendarContainer={() => document.getElementById('activityTime')}
                      size='large'
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      disabledDate={this._disabledDate}
                      disabledTime={disabledRangeTime}
                      showTime={{ hideDisabledOptions: true }}
                      onChange={this._actTimeChange}
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
                    fileList = {activityImage}
                    onChange={this._handleChangeBannerImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='image/jpg, image/jpeg, image/png'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {activityImage.length > 0 ? null : this.getUploadButton()}
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
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸600px*338px;
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='是否跳转'
              >
                {getFieldDecorator('forwardFlag', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '请选择是否跳转'
                  }]
                })(
                  <RadioGroup
                    onChange={this.isJumpChange}
                  >
                    <Radio value='1'>是</Radio>
                    <Radio value='0'>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              {
                isJumpStatus === '1' && (
                  <FormItem
                    {...formItemLayout}
                    label='URL'
                  >
                    {getFieldDecorator('forwardUrl', {
                      rules: [{
                        required: false,
                      }],
                    })(
                      <Input
                        placeholder='请输入URL'
                      />
                    )}
                  </FormItem>)
              }
              {
                isJumpStatus === '0' && (<div>
                  <FormItem
                    {...formItemLayout}
                    label='活动简介'
                  >
                    {getFieldDecorator('intruduction', {
                      initialValue: '',
                      rules: [{
                        required: true,
                        message: '请填写活动简介'
                      }]
                    })(
                      <EditorDraft
                        token={token}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='是否需要报名'
                  >
                    {getFieldDecorator('needEnrollFlag', {
                      initialValue: '',
                      rules: [{
                        required: true,
                        message: '请选择是否需要报名'
                      }]
                    })(
                      <RadioGroup
                        onChange={this.isEnrollChange}
                      >
                        <Radio value='1'>是</Radio>
                        <Radio value='0'>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                  {
                    isEnrollStatus === '1' ? (
                      <FormItem
                        {...formItemLayout}
                        label='报名时间'
                      >
                        <div
                          id='enrollTime'
                          style={{ position: 'relative' }}
                        >
                          {getFieldDecorator('enrollTime', {
                            rules: [{
                              required: true,
                              message: '请选择报名时间'
                            }],
                          })(
                            <RangePicker
                              getCalendarContainer={() => document.getElementById('enrollTime')}
                              size='large'
                              style={{ width: '100%' }}
                              format='YYYY-MM-DD HH:mm:ss'
                              disabledDate={this._disabledEnrollDate}
                              disabledTime={disabledRangeTime}
                              showTime={{ hideDisabledOptions: true }}
                            />)}
                        </div>
                      </FormItem>
                    ) : null
                  }
                </div>)
              }
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
    token: state.common.qiniuToken || '',
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
