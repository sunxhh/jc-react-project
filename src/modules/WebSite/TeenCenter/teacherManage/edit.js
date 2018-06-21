import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, Modal, message, Select } from 'antd'
import * as actions from './reduck'
import OrderUpload from 'Components/upload'
import EditorDraft from 'Components/Editor'
import { getQiniuToken } from 'Global/action'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

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
      teacherImage: [],
      remark: '',
      editorDraft: ''
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id
    const { dispatch } = this.props
    dispatch(actions.getTeacherDetail({ id: id })).then(res => {
      const newState = {}
      if (!isEmpty(res.image)) {
        newState.teacherImage = [{ uid: '1', url: res.image }]
      }
      this.setState({ ...newState })
    })
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getClassAll())
    dispatch(getQiniuToken())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.teacherDetail !== nextProps.teacherDetail) {
      this.setState({
        editorDraft: nextProps.teacherDetail.remark
      })
    }
  }

  _handleChangeBannerImage = ({ fileList }) => {
    this.setState({
      teacherImage: fileList
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
          id: this.props.match.params.id,
          name: values.name,
          courseId: values.courseId,
          sort: values.sort,
          image: values.image[0],
          remark: values.remark,
          postName: values.postName,
          summary: values.summary
        }
        dispatch(actions.editTeacher({ primeTeacher: reqBean }))
      }
    })
  }

  render() {
    const { token, classAll, teacherDetail, showButtonSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, teacherImage, editorDraft } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label='姓名'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入25字符以内的教师姓名',
                    max: 25
                  }],
                  initialValue: teacherDetail.name
                })(
                  <Input
                    placeholder='请输入教师姓名'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='所教课程'
              >
                <div
                  id='courseId'
                  style={{ position: 'relative', marginBottom: '5px' }}
                >
                  {getFieldDecorator('courseId', {
                    rules: [{
                      required: true,
                      message: '请选择课程'
                    }],
                    initialValue: teacherDetail.courseId
                  })(
                    <Select
                      placeholder='请选择课程'
                      getPopupContainer={() => document.getElementById('courseId')}
                    >
                      {
                        classAll && classAll.map((item, index) => (
                          <Option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='职称'
              >
                {getFieldDecorator('postName', {
                  rules: [{
                    required: true,
                    message: '请填写30字符以内的教师职称',
                    max: 30
                  }],
                  initialValue: teacherDetail.postName
                })(
                  <Input
                    placeholder='请填写教师职称'
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
                  initialValue: teacherDetail.sort
                })(
                  <Input
                    placeholder='请输入排序'
                  />
                )}
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
                  initialValue: this.imageUpload({ fileList: teacherImage }),
                })(
                  <OrderUpload
                    action='http://upload.qiniu.com'
                    listType='picture-card'
                    fileList = {teacherImage}
                    onChange={this._handleChangeBannerImage}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    accept='image/jpg, image/png, image/jpeg'
                    data={{ token: token }}
                    needOrder={false}
                  >
                    {teacherImage.length > 0 ? null : this.getUploadButton()}
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
                label='概述'
                {...formItemLayout}
              >
                {getFieldDecorator('summary', {
                  initialValue: teacherDetail.summary,
                  rules: [{
                    required: true,
                    message: '请填写100字符以内的概述',
                    max: 100
                  }],
                })(
                  <TextArea row={8} placeholder='概述' />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='介绍'
              >
                {getFieldDecorator('remark', {
                  initialValue: editorDraft || '',
                  rules: [{
                    required: true,
                    message: '请输入介绍'
                  }],
                })(
                  <EditorDraft
                    token={token}
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
    showButtonSpin: state.common.showButtonSpin,
    token: state.common.qiniuToken || '',
    classAll: state.teacher.classAll,
    teacherDetail: state.teacher.teacherDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit))
