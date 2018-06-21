import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getQiniuToken,
} from '../../../global/action'
import {
  queryOrg,
  getChannelList,
  getStudentType,
  getStudentTlevel,
} from '../studentManage/reduck'
import { PAGE_SIZE } from '../../Edu/pagination'
import { Form, Card, Row, Col, Input, Select, Upload, Icon, Modal } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option

class BaseInform extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
    }
  }

  static defaultProps = {
    orgList: [],
    orgLevel: '',
    pagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    },
  }

  componentWillMount() {
    const { dispatch, pagination } = this.props
    dispatch(queryOrg({
      org: {
        orgMod: 1,
        orgLevel: 2
      }
    }))
    dispatch(getStudentType({ codeType: 'stuType' }))
    dispatch(getStudentTlevel({ codeType: 'stuIntentLevel' }))
    dispatch(getQiniuToken())
    dispatch(getChannelList({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      studentChannel: {}
    }))
  }

  handleCancel = () => this.setState({ previewVisible: false })

  // 点击放大头像
  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl || file.url,
      previewVisible: true,
    })
  }

  // 点击头像关闭
  handleCancelImg = () => this.setState({ previewVisible: false })

  render() {
    const token = this.props.token
    const { getFieldDecorator } = this.props.form
    const { getStudentType, getStudentlevel } = this.props
    const studentDetail = this.props.studentDetail
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const { previewVisible, previewImage } = this.state
    const fileList = studentDetail.image ? [{
      url: studentDetail.image,
      uid: '-1',
    }] : []
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>上传头像</div>
      </div>
    )
    return (
      <div>
        <Card
          title='基础信息'
          style={{ marginBottom: '20px' }}
        >
          <Row>
            <Form
              className={styles['parameter-wrap']}
            >
              <Row>
                <Col span={20}>
                  <Row>
                    <Col span={7}>
                      <FormItem
                        {...formItemLayout}
                        label='编号'
                      >
                        {getFieldDecorator('studentNo', {
                          initialValue: studentDetail.studentNo ? studentDetail.studentNo : '',
                        })(
                          <Input
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem
                        {...formItemLayout}
                        label='姓名'
                      >
                        {getFieldDecorator('name', {
                          initialValue: studentDetail ? studentDetail.name : '',
                          rules: [{
                            required: true,
                            message: '请输入姓名',
                          }],
                        })(
                          <Input
                            placeholder='请输入姓名'
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem
                        {...formItemLayout}
                        label='联系电话'
                      >
                        {getFieldDecorator('linkPhone', {
                          initialValue: studentDetail ? studentDetail.linkPhone : '',
                          rules: [{
                            required: true,
                            message: '请填写联系电话',
                          }],
                        })(
                          <Input
                            placeholder='请输入联系电话'
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      span={2}
                      id='linkType'
                    >
                      <FormItem
                        {...formItemLayout}
                        colon={false}
                      >
                        {getFieldDecorator('linkType', {
                          initialValue: studentDetail ? studentDetail.linkType : '',
                        })(
                          <Select
                            disabled={true}
                            style={{ width: 80, marginLeft: 5 }}
                            getPopupContainer={() => document.getElementById('linkType')}
                          >
                            <Option value='1'>父亲</Option>
                            <Option value='2'>母亲</Option>
                            <Option value='3'>本人</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      id='sex'
                      span={7}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='性别：'
                      >
                        {getFieldDecorator('sex', {
                          initialValue: studentDetail ? studentDetail.sex : '',
                          rules: [{
                            required: true,
                            message: '请选择性别',
                          }],
                        })(
                          <Select
                            disabled={true}
                            getPopupContainer={() => document.getElementById('sex')}
                          >
                            <Option value='0'>男</Option>
                            <Option value='1'>女</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      id='orgName'
                      span={7}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='所属机构：'
                      >
                        {getFieldDecorator('orgId', {
                          rules: [{
                            required: true,
                            message: '请选择所属机构',
                          }],
                          initialValue: studentDetail ? studentDetail.orgId : '',
                        })(
                          <Select
                            placeholder='请选择所属机构'
                            disabled={true}
                            getPopupContainer={() => document.getElementById('orgName')}
                          >
                            <Option
                              key='-1'
                              value=''
                            >
                              全部
                            </Option>
                            {
                              this.props.orgList && this.props.orgList.map((item) => {
                                return (
                                  <Option
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.orgName}
                                  </Option>
                                )
                              })
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      id='studentsType'
                      span={7}
                    >
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label='学员类型：'
                      >
                        {getFieldDecorator('studentType', {
                          initialValue: studentDetail ? studentDetail.studentType : '',
                          rules: [{
                            message: '请选择学员类型进',
                          }],
                        })(
                          <Select
                            disabled={true}
                            getPopupContainer={() => document.getElementById('studentsType')}
                          >
                            {
                              getStudentType && getStudentType.map((item) => {
                                return (
                                  <Option
                                    value={item.value}
                                    key={item.value}
                                  >
                                    {item.name}
                                  </Option>
                                )
                              })
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={13}>
                      <FormItem
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label='意向课程：'
                        style={{ marginLeft: '10px' }}
                      >
                        {getFieldDecorator('courseName', {
                          initialValue: studentDetail.course ? studentDetail.course.courseNames : '',
                        })(
                          <Input
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      id='degree'
                      span={8}
                    >
                      <FormItem
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        label='意向度:'
                      >
                        {getFieldDecorator('intentLevel', {
                          initialValue: studentDetail ? studentDetail.intentLevel : '',
                        })(
                          <Select
                            disabled={true}
                            getPopupContainer={() => document.getElementById('degree')}
                          >
                            {
                              getStudentlevel && getStudentlevel.map((item) => {
                                return (
                                  <Option
                                    value={item.value}
                                    key={item.value}
                                  >
                                    {item.name}
                                  </Option>
                                )
                              })
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={7}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='渠道：'
                      >
                        {getFieldDecorator('channelName', {
                          initialValue: studentDetail ? studentDetail.channelName : '',
                        })(
                          <Input
                            placeholder='请输渠道名称'
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      span={7}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='销售人员：'
                      >
                        {getFieldDecorator('salerName', {
                          initialValue: studentDetail ? studentDetail.salerName : '',
                          rules: [{
                            message: '请输入销售人员',
                          }],
                        })(
                          <Input
                            placeholder='请输入销售人员'
                            disabled={true}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('image', {
                    getValueFromEvent: this.projectImgUpload,
                    initialValue: studentDetail.image ? [{
                      url: studentDetail.image,
                      uid: -1
                    }] : []
                  })(
                    <Upload
                      action='http://upload.qiniu.com'
                      listType='picture-card'
                      onPreview={this.handlePreview}
                      fileList={fileList}
                      data={{ token: token }}
                      disabled={true}
                      showUploadList={{
                        showRemoveIcon: false
                      }}
                      // onRemove = {() => { fileLi st.length = 0 }}
                      accept='image/jpg, image/jpeg, image/png'
                    >
                      {!fileList.length && uploadButton}
                    </Upload>
                  )}
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancelImg}
                  >
                    <img
                      alt='example'
                      style={{ width: '100%' }}
                      src={previewImage}
                    />
                  </Modal>
                </Col>
              </Row>
            </Form>
          </Row>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.common.qiniuToken || '',
    orgList: state.eduStudents.orgList,
    orgLevel: state.eduStudents.orgLevel,
    pagination: state.eduStudents.page,
    channelList: state.eduStudents.channelList,
    getStudentType: state.eduStudents.getStudentType,
    getStudentlevel: state.eduStudents.getStudentlevel,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BaseInform))

