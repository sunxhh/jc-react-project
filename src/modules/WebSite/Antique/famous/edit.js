import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, message, Modal } from 'antd'
import * as actions from './reduck'
import AliUpload from 'Components/upload/aliUploadV2'
import EditorDraft from 'Components/Editor'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const TextArea = Input.TextArea
const bucket = 'hzgwc-oss-bucket'
const rootPath = 'antiqueFamous'
const getImageUid = (function() {
  let uid = 1
  let prefix = 'img_key_'
  return function() {
    return prefix + (uid++)
  }
})()

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
  state = {
    previewImage: '',
    previewVisible: false,
    currentPics: [],
    currentImage: [],
    remark: ''
  }

  componentWillMount() {
    const id = this.props.match.params.id
    const { dispatch } = this.props
    if (id) {
      dispatch(actions.getFamousDetail({ id: id })).then((detail) => {
        const newState = {
          currentImage: [],
          currentPics: []
        }
        if (!isEmpty(detail.image)) {
          newState.currentImage.push({
            uid: getImageUid(),
            url: detail.image
          })
        }
        detail.pics && detail.pics.forEach((url) => {
          newState.currentPics.push({
            uid: getImageUid(),
            url
          })
        })

        this.setState(newState)
      })
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getAliToken())
  }

  componentWillUnmount() {
    this.props.dispatch(actions.clearFamousDetail())
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
        return e.response.url
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
          gwcArtist: {
            id: this.props.match.params.id,
            name: values.name.trim(),
            sort: values.sort,
            image: values.image[0],
            remark: values.remark,
            summary: values.summary
          },
          pics: values.pics
        }
        if (reqBean.gwcArtist.id) {
          dispatch(actions.editFamous(reqBean))
        } else {
          delete reqBean.gwcArtist.id
          dispatch(actions.addFamous(reqBean))
        }
      }
    })
  }

  _handleChange({ fileList }, stateKey) {
    this.setState({
      [stateKey]: fileList
    })
  }

  render() {
    const { token, famousDetail, showButtonSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, currentImage, currentPics } = this.state

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
                    message: '请输入25字符以内的名家姓名',
                    max: 25
                  }],
                  initialValue: famousDetail.name
                })(
                  <Input
                    placeholder='请输入名家姓名'
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
                  initialValue: famousDetail.sort
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
                  initialValue: this.imageUpload({ fileList: currentImage }),
                })(
                  <AliUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    fileList = {currentImage}
                    onChange={(fileList) => { this._handleChange(fileList, 'currentImage') }}
                    accept='image/jpg, image/png, image/jpeg'
                    bucket={bucket}
                    aliToken={token}
                    rootPath={rootPath}
                    needOrder={false}
                  >
                    {currentImage.length > 0 ? null : this.getUploadButton()}
                  </AliUpload>
                )}
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸600px*338px;
                </div>
              </FormItem>
              <FormItem
                label='简介'
                {...formItemLayout}
              >
                {getFieldDecorator('summary', {
                  initialValue: famousDetail.summary,
                  rules: [{
                    required: true,
                    message: '请填写30字符以内的简介',
                    max: 30
                  }],
                })(
                  <TextArea row={8} placeholder='一句话介绍该名家' />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='资历详情'
              >
                {getFieldDecorator('remark', {
                  initialValue: famousDetail.remark,
                  rules: [{
                    required: true,
                    message: '请输入名家资历详情'
                  }],
                })(
                  <EditorDraft
                    token={token}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label = '代表作品'
              >
                {getFieldDecorator('pics', {
                  rules: [{
                    required: true,
                    message: '请选择图片'
                  }],
                  getValueFromEvent: this.imageUpload,
                  initialValue: this.imageUpload({ fileList: currentPics }),
                })(
                  <AliUpload
                    listType='picture-card'
                    fileList = {currentPics}
                    onPreview={this._handlePreview}
                    beforeUpload={beforeUpload}
                    onChange={(fileList) => { this._handleChange(fileList, 'currentPics') }}
                    accept='image/jpg, image/png, image/jpeg'
                    bucket={bucket}
                    aliToken={token}
                    rootPath={rootPath}
                    needOrder={false}
                  >
                    { currentPics.length > 2 ? null : this.getUploadButton()}
                  </AliUpload>
                )}
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸600px*338px;
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showButtonSpin: state.common.showButtonSpin,
    token: state.antique.famous.aliToken,
    famousDetail: state.antique.famous.famousDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit))
