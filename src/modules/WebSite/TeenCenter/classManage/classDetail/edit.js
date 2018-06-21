import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, Modal, message, Select } from 'antd'
import * as actions from './reduck'
import OrderUpload from 'Components/upload'
import { getQiniuToken } from 'Global/action'
import { getClassifyList } from '../classifyManage/reduck'
import EditorDraft from 'Components/Editor'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const Option = Select.Option

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

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewImage: '',
      previewVisible: false,
      coverPic: [],
      detailPic: [],
      coursePic: [],
      editorDraft: ''
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getQiniuToken())
    dispatch(getClassifyList())
  }

  componentWillMount() {
    const id = this.props.match.params.id
    const { dispatch } = this.props
    dispatch(actions.getClassDetail({ id: id })).then(res => {
      const newState = {}
      if (!isEmpty(res.coverPic)) {
        newState.coverPic = [{ uid: '1', url: res.coverPic }]
      }
      if (!isEmpty(res.detailPic)) {
        newState.detailPic = [{ uid: '1', url: res.detailPic }]
      }
      if (res.coursePic) {
        newState.coursePic = res.coursePic.map((item, index) => {
          return {
            uid: index,
            url: item
          }
        })
      }
      newState.isJumpStatus = res.forwardFlag
      newState.isEnrollStatus = res.needEnrollFlag
      this.setState({ ...newState })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.classDetail !== nextProps.classDetail) {
      this.setState({
        editorDraft: nextProps.classDetail.detail
      })
    }
  }

  _handleChangeCoverImage = ({ fileList }) => {
    this.setState({
      coverPic: fileList
    })
  }

  _handleChangeDetailImage = ({ fileList }) => {
    this.setState({
      detailPic: fileList
    })
  }

  _handleChangeTeachImage = ({ fileList }) => {
    this.setState({
      coursePic: fileList
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
          id: this.props.match.params.id,
          name: values.name,
          categoryId: values.categoryId,
          sort: values.sort,
          remark: values.remark,
          detail: values.detail,
          coverPic: values.coverPic[0],
          detailPic: values.detailPic[0],
          coursePic: values.coursePic ? values.coursePic : []
        }
        dispatch(actions.editConsult(reqBean))
      }
    })
  }

  _handleCancel = () => this.setState({ previewVisible: false })

  render() {
    const { classifyList, token, classDetail, showButtonSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, coverPic, detailPic, coursePic, editorDraft } = this.state
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
                    message: '请输入25字符以内的课程名称',
                    max: 25
                  }],
                  initialValue: classDetail.name,
                })(
                  <Input
                    placeholder='请输入课程名称'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='所属分类'
              >
                <div
                  id='categoryId'
                  style={{ position: 'relative', marginBottom: '5px' }}
                >
                  {getFieldDecorator('categoryId', {
                    rules: [{
                      required: true,
                      message: '请选择所属分类',
                    }],
                    initialValue: classDetail.categoryId,
                  })(
                    <Select
                      placeholder='请选择所属分类'
                      getPopupContainer={() => document.getElementById('categoryId')}
                    >
                      {
                        classifyList && classifyList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.name}
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
                label='排序序号'
              >
                {getFieldDecorator('sort', {
                  rules: [{
                    required: true,
                    pattern: /^[1-9]\d{0,3}$/,
                    message: '请填写1-9999范围整数序号'
                  }],
                  initialValue: classDetail.sort,
                })(
                  <Input
                    placeholder='请输入排序'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='课程简介'
              >
                {getFieldDecorator('remark', {
                  rules: [{
                    required: true,
                    message: '请输入250个字符以内的课程简介',
                    max: 250
                  }],
                  initialValue: classDetail.remark,
                })(
                  <Input
                    placeholder='请输入课程简介'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '封面图片'
              >
                {getFieldDecorator('coverPic', {
                  rules: [{
                    required: true,
                    message: '请选择封面图片'
                  }],
                  getValueFromEvent: this.imageUpload,
                  initialValue: this.imageUpload({ fileList: coverPic }),
                })(
                  <OrderUpload
                    action='http://upload.qiniu.com'
                    listType='picture-card'
                    fileList = {coverPic}
                    onChange={this._handleChangeCoverImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='mage/jpg, image/png, image/jpeg'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {coverPic.length > 0 ? null : this.getUploadButton()}
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
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸592*330px;
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '详情图片'
              >
                {getFieldDecorator('detailPic', {
                  rules: [{
                    required: true,
                    message: '请选择详情图片'
                  }],
                  getValueFromEvent: this.imageUpload,
                  initialValue: this.imageUpload({ fileList: detailPic }),
                })(
                  <OrderUpload
                    action='http://upload.qiniu.com'
                    listType='picture-card'
                    fileList = {detailPic}
                    onChange={this._handleChangeDetailImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='mage/jpg, image/png, image/jpeg'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {detailPic.length > 0 ? null : this.getUploadButton()}
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
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸1920*600px;
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='课程详情'
              >
                {getFieldDecorator('detail', {
                  initialValue: editorDraft,
                  rules: [{
                    required: true,
                    message: '请填写课程详情'
                  }]
                })(
                  <EditorDraft
                    token={token}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '教学环境'
              >
                {getFieldDecorator('coursePic', {
                  rules: [{
                    required: false,
                  }],
                  getValueFromEvent: this.imageUpload,
                  initialValue: this.imageUpload({ fileList: coursePic }),
                })(
                  <OrderUpload
                    action='http://upload.qiniu.com'
                    listType='picture-card'
                    fileList = {coursePic}
                    onChange={this._handleChangeTeachImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='mage/jpg, image/png, image/jpeg'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {coursePic.length > 7 ? null : this.getUploadButton()}
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
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，最多八张，推荐尺寸640*360px;
                </div>
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
                loading={showButtonSpin}
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
    showButtonSpin: state.common.showButtonSpin,
    classifyList: state.classify.classifyList,
    classDetail: state.classDetail.classDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit))
