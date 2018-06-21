import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Icon, Button, Modal, message, Select } from 'antd'
import * as actions from './reduck'
import OrderUpload from '../../../../components/upload'
import { getQiniuToken } from '../../../../global/action'
import styles from './style.less'
import EditorDraft from '../../../../components/Editor/index'

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
      bannerImage: [],
      editorDraft: ''
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
    dispatch(actions.getConsultDetail({ id: this.props.match.params.id }))
    dispatch(actions.getChannelList())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.detailConsult !== nextProps.detailConsult) {
      this.setState({
        bannerImage: [{ uid: 1, url: nextProps.detailConsult.image }],
        editorDraft: nextProps.detailConsult.content
      })
    }
  }

  _handleCancel = () => this.setState({ previewVisible: false })

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
          id: this.props.match.params.id,
          orgId: values.orgId,
          channelId: values.channelId,
          title: values.title,
          subTitle: values.subTitle,
          content: values.content,
          image: values.image[0],
          publisher: values.publisher,
        }
        dispatch(actions.editConsult(reqBean))
      }
    })
  }

  render() {
    const { orgList, token, detailConsult, channelList } = this.props
    const { getFieldDecorator } = this.props.form
    const { previewImage, previewVisible, bannerImage, editorDraft } = this.state
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
                  id='orgId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('orgId', {
                    rules: [{
                      required: true,
                      message: '请选择所属机构'
                    }],
                    initialValue: detailConsult.orgId,
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('orgId')}
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
                label='所属频道'
              >
                <div
                  id='channelId'
                  style={{ position: 'relative', marginBottom: '5px' }}
                >
                  {getFieldDecorator('channelId', {
                    rules: [{
                      required: true,
                      message: '请选择所属频道'
                    }],
                    initialValue: detailConsult.channelId,
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('channelId')}
                    >
                      {
                        channelList && channelList.map(item => {
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
                label='标题'
              >
                {getFieldDecorator('title', {
                  rules: [{
                    required: true,
                    message: '请输入30个字符的标题',
                    max: 30
                  }],
                  initialValue: detailConsult.title,
                })(
                  <Input
                    placeholder='请输入标题'
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='副标题'
              >
                {getFieldDecorator('subTitle', {
                  rules: [{
                    required: true,
                    message: '请输入60个字符的副标题',
                    max: 60
                  }],
                  initialValue: detailConsult.subTitle,
                })(
                  <Input
                    placeholder='请输入副标题'
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
                  initialValue: this.imageUpload({ fileList: bannerImage }),
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
                <div className={styles['clear']}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸600px*338px;
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='正文内容'
              >
                {getFieldDecorator('content', {
                  initialValue: editorDraft,
                  rules: [{
                    required: true,
                    message: '请填写正文内容'
                  }],
                })(
                  <EditorDraft
                    token={token}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='发布人'
              >
                {getFieldDecorator('publisher', {
                  rules: [{
                    required: true,
                    message: '请填写发布人'
                  }],
                  initialValue: detailConsult.publisher
                })(
                  <Input
                    placeholder='请输写发布人'
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
    detailConsult: state.consult.detailConsult,
    channelList: state.consult.channelList,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit))
