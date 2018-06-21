import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'
import {
  getQiniuToken,
} from '../../../global/action'
import {
  getCourseList,
  Add,
  queryOrg,
  channelListAll,
  saleName,
  getStudentLinkType,
  getStudentType,
  getStudentTlevel,
  getCourseType,
} from './reduck'
import { PAG_CONFIG, PAGE_SIZE } from '../../Edu/pagination'
import { Form, Button, Card, Row, Col, Input, Select, Upload, Icon, Modal, Table, Popover, message } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option

const courseModel = {
  '1': '班课',
  '2': '一对一',
}

class AddStudent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      courseIds: '',
      selectedRowKeys: [],
      selectedCourseList: [],
      courseModuleVisible: false,
      dataSource: [],
      courseCoverImg: [],
    }
  }

  static defaultProps = {
    orgList: [],
    orgId: '',
    orgLevel: '',
    orgName: '',
    idList: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    },
    courseList: [],
    channelList: {},
    queryAllUserList: [],
  }

  _columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 200,
      fixed: 'left',
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div>{text}</div>}
            title='课程名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      title: '课程类别',
      dataIndex: 'courseType',
      width: 200,
      render: (text, record) => {
        return <span>{this.getDictValue(this.props.getCourseType, record.courseType)}</span>
      }
    },
    {
      title: '课程模式',
      dataIndex: 'courseModel',
      width: 200,
      render: (text) => (
        <span>{text && courseModel[text] !== null && courseModel[text]}</span>
      )
    },
    {
      title: '学费标准',
      dataIndex: 'standardFees',
      width: 200,
      render: (text) => (
        <span>{text}</span>
      )
    },
    {
      title: '教材价格',
      dataIndex: 'textbookPrice',
      render: (text) => (
        <span>{text}</span>
      )
    }
  ]

  componentDidMount() {
    const { dispatch, pagination } = this.props
    dispatch(getQiniuToken())
    dispatch(queryOrg({
      org: {
        orgMod: 1,
        orgLevel: 2
      }
    }))
    dispatch(getStudentLinkType({ codeType: 'stuLinkType' }))
    dispatch(getStudentType({ codeType: 'stuType' }))
    dispatch(getStudentTlevel({ codeType: 'stuIntentLevel' }))
    dispatch(getCourseType({ codeType: 'courseType' }))
    dispatch(getCourseList({ course: {}, currentPage: 1, ...pagination }))
    dispatch(channelListAll({ channelName: '' }))
    dispatch(saleName())
  }

  // 渲染数字字典数据
  getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  // 获取课程列表分页数据
  handleCoursePageChange = (page) => {
    if (page.pageSize !== this.props.pagination.pageSize) {
      this.props.dispatch(getCourseList({ ...this.props.pagination, course: {}, currentPage: 1, pageSize: page.pageSize }))
    } else {
      this.props.dispatch(getCourseList({ ...this.props.pagination, course: {}, currentPage: page.current, pageSize: page.pageSize }))
    }
  }

  // 课程列表查询参数
  handleSearchTure = (value) => {
    this.props.dispatch(getCourseList({
      course: { ...value },
      currentPage: 1,
      pageSize: 20,
    }))
  }

  // 输入框选择、输入
  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 课程查询
  handleSearch = value => {
    const { getFieldsValue } = this.props.form
    const arg = getFieldsValue()
    this.setState({ selectedRowKeys: [], dataSource: value ? this.handleSearchTure(arg) : [] })
  }

  // 意向课程选择
  handleOk = () => { // 确认选择
    const { selectedRowKeys } = this.state
    this.setState({ courseModuleVisible: false })
    // 获取id对应的课程名称
    const courseList = this.state.selectedCourseList.filter(course => {
      return selectedRowKeys.find(id => id === course.id)
    })
    const nameList = [...new Set(courseList.map(item => (item.courseName)))]
    this.props.form.setFieldsValue({
      courseNameLable: nameList.join(','), // name值
    })
    this.setState({ courseIds: this.state.selectedRowKeys.join(',') })
  }

  handleCancel = () => { // 取消选择
    this.setState({ courseModuleVisible: false })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    selectedRowKeys.length < 4 && this.setState({ selectedRowKeys }) // 最多选3项
    selectedRowKeys.length < 4 && this.setState({ selectedCourseList: [...this.state.selectedCourseList, ...selectedRows] })
  }

  // 点击放大头像
  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl || file.url,
      previewVisible: true,
    })
  }

  // 点击头像关闭
  handleCancelImg = () => this.setState({ previewVisible: false })

  // 上传前校验
  _beforeUpload = (file) => {
    const isImageType = this._isUploadImageType(file)
    const isImageSize = this._isUploadImageSize(file)
    !isImageType && message.error('请上传jpg、jpeg、png的图片!')
    !isImageSize && message.error('请上传300KB以下的图片!')
    return isImageType && isImageSize
  }

  _isUploadImageType = (file) => {
    const picTypeArr = ['image/jpeg', 'image/jpg', 'image/png']
    const isPic = picTypeArr.indexOf(file.type) !== -1
    return isPic
  }

  _isUploadImageSize = (file) => {
    const imageSize = file.size / 1024 <= 300
    return imageSize
  }

  // 上传后回调
  projectImgUpload = e => {
    let data = e.file
    if (e.file.hasOwnProperty('response') && typeof e.file.response !== 'undefined') {
      const key = e.file.response.key
      data.url = `https://mallimg.easybao.com/${key}`
      data.uid = key
      data.thumbUrl = 'https://mallimg.easybao.com/' + key
    }
    return data
  }

  // 上传头像
  handleChangeBanner = (file) => {
    const isImageType = this._isUploadImageType(file.file)
    const isImageSize = this._isUploadImageSize(file.file)
    if (isImageType && isImageSize) {
      this.setState({
        courseCoverImg: file.fileList,
      })
    }
  }

  // 点击保存
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      const imageUrl = values.image && values.image.thumbUrl
      if (!err) {
        this.props.dispatch(Add({
          student: {
            name: values.name,
            linkPhone: values.linkPhone,
            linkType: values.linkType ? values.linkType : '',
            orgId: values.orgId,
            sex: values.sex,
            studentType: values.studentType,
            intentLevel: values.intentLevel ? values.intentLevel : '',
            salerId: values.salerId ? values.salerId : '',
            channelId: values.channelId ? values.channelId : '',
            image: imageUrl || '',
          },
          courseIds: this.state.courseIds.split(',')
        }))
      }
    })
  }

  render() {
    const { previewVisible, previewImage, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const { getFieldDecorator } = this.props.form
    const { token, channelListAll, queryAllUserList, getStudentLinkType, getStudentType, getStudentlevel, getCourseType } = this.props
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>上传头像</div>
      </div>
    )
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          className={styles['parameter-wrap']}
        >
          <div className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
              style={{ marginRight: '10px' }}
              loading={this.props.showBtnSpin}
            >
              保存
            </Button>
            <Link to={`${urls.EDU_STUDENT_MANAGE}`}>
              <Button
                title='点击取消'
              >
                取消
              </Button>
            </Link>
          </div>
          <Card
            title='基础信息'
            style={{ marginBottom: '20px' }}
          >
            <Row>
              <Col span={20}>
                <Row>
                  <Col span={7}>
                    <FormItem
                      {...formItemLayout}
                      label='编号'
                    >
                      {getFieldDecorator('studentNo')(
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
                        rules: [{
                          required: true,
                          message: '请输入姓名',
                        }],
                      })(
                        <Input
                          placeholder='请输入姓名'
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
                        rules: [{
                          required: true,
                          whitespace: true,
                          pattern: /^\d{11}$/,
                          message: '请输入正确的手机号！'
                        }],
                      })(
                        <Input
                          placeholder='请输入联系电话'
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
                        rules: [{
                          message: '请选择所属关系',
                        }],
                      })(
                        <Select
                          style={{ width: 80, marginLeft: 5 }}
                          getPopupContainer={() => document.getElementById('linkType')}
                        >
                          {
                            getStudentLinkType && getStudentLinkType.map((item) => {
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
                    id='sex'
                    span={7}
                  >
                    <FormItem
                      {...formItemLayout}
                      label='性别：'
                    >
                      {getFieldDecorator('sex', {
                        rules: [{
                          required: true,
                          message: '请选择性别',
                        }],
                      })(
                        <Select
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
                        initialValue: this.props.orgId && this.props.orgLevel === '2' ? this.props.orgId : '',
                        rules: [{
                          required: true,
                          message: '请选择所属机构',
                        }],
                      })(
                        <Select
                          placeholder='请选择所属机构'
                          disabled={this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                          onChange={this._orgListOnChange}
                          showSearch={true}
                          filterOption={this._filterOption}
                          getPopupContainer={() => document.getElementById('orgName')}
                        >
                          <Option
                            key='-1'
                            value=''
                          >
                            全部
                          </Option>
                          {
                            this.props.orgList.map(item => {
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
                    id='studentType'
                    span={7}
                  >
                    <FormItem
                      {...formItemLayout}
                      label='学员类型'
                    >
                      {getFieldDecorator('studentType', {
                        rules: [{
                          required: true,
                          message: '学员类型',
                        }],
                      })(
                        <Select
                          getPopupContainer={() => document.getElementById('studentType')}
                        >
                          <Option
                            value=''
                            key=''
                          >
                            请选择
                          </Option>
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
                      wrapperCol={{ span: 18 }}
                      label='意向课程：'
                      style={{ marginLeft: '10px' }}
                    >
                      {getFieldDecorator('courseNameLable')(
                        <Input
                          disabled={true}
                          addonAfter={
                            <Icon
                              type='plus'
                              onClick={() => this.setState({ courseModuleVisible: true })}
                            />
                          }
                        />
                      )}
                    </FormItem>
                    <Modal
                      width={750}
                      title='课程选择'
                      visible={this.state.courseModuleVisible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                    >
                      <Form
                        layout='inline'
                      >
                        <FormItem
                          label='课程名称：'
                          className={styles['search-form-item']}
                        >
                          {getFieldDecorator('courseName')(
                            <Input placeholder='请输入课程名称' />
                          )}
                        </FormItem>
                        <FormItem
                          label='课程类型：'
                        >
                          {getFieldDecorator('courseType', {
                            initialValue: '',
                          })(
                            <Select
                              placeholder='请选择课程类型'
                              style={{ width: '150px', marginBottom: '15px' }}
                            >
                              <Option
                                value='-1'
                                key=''
                              >
                               请选择
                              </Option>
                              {
                                getCourseType && getCourseType.map((item) => {
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
                        <FormItem
                          className={styles['search-form-item']}
                        >
                          <Button
                            type='primary'
                            onClick={this.handleSearch}
                            icon='search'
                            style={{ marginBottom: '20px' }}
                          >
                            查询
                          </Button>
                        </FormItem>
                      </Form>
                      <Table
                        className={styles['table-left']}
                        rowSelection={rowSelection}
                        columns={this._columns}
                        rowKey='id'
                        dataSource={this.props.courseList}
                        onChange={this.handleCoursePageChange}
                        pagination={{ ...this.props.pagination, ...PAG_CONFIG }}
                        scroll={{
                          x: 1000,
                          y: 300,
                        }}
                      />
                    </Modal>
                  </Col>
                  <Col
                    id='degree'
                    span={11}
                  >
                    <FormItem
                      labelCol={{ span: 7 }}
                      wrapperCol={{ span: 10 }}
                      label='意向度:'
                    >
                      {getFieldDecorator('intentLevel')(
                        <Select
                          getPopupContainer={() => document.getElementById('degree')}
                        >
                          <Option
                            value=''
                            key=''
                          >
                            请选择
                          </Option>
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
                    id='channel'
                    span={7}
                  >
                    <FormItem
                      {...formItemLayout}
                      label='渠道：'
                      className={styles['form-item']}
                    >
                      {getFieldDecorator('channelId')(
                        <Select
                          showSearch
                          placeholder='请选择渠道'
                          filterOption={this._filterOption}
                          getPopupContainer={() => document.getElementById('channel')}
                        >
                          <Option
                            value='-1'
                            key=''
                          >
                            全部
                          </Option>
                          {
                            channelListAll.map((item) => {
                              return (
                                <Option
                                  key={item.id}
                                  value={item.id}
                                >
                                  {item.channelName}
                                </Option>
                              )
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col
                    id='salerId'
                    span={7}
                  >
                    <FormItem
                      {...formItemLayout}
                      label='销售人员：'
                      className={styles['form-item']}
                    >
                      {getFieldDecorator('salerId')(
                        <Select
                          placeholder='请选择销售人员'
                          showSearch={true}
                          filterOption={this._filterOption}
                          getPopupContainer={() => document.getElementById('salerId')}
                        >
                          <Option
                            key='-1'
                            value=''
                          >
                            请选择
                          </Option>
                          {
                            queryAllUserList.map((item) => {
                              return (
                                <Option
                                  key={item.uuid}
                                  value={item.uuid}
                                >
                                  {item.fullName}
                                </Option>
                              )
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('image', {
                    valuePropName: 'filelist',
                    getValueFromEvent: this.projectImgUpload,
                  })(
                    <Upload
                      action='http://upload.qiniu.com'
                      listType='picture-card'
                      onPreview={this.handlePreview}
                      accept='image/jpg, image/jpeg, image/png'
                      fileList={this.state.courseCoverImg}
                      data={{ token: token }}
                      beforeUpload={this._beforeUpload}
                      onChange={this.handleChangeBanner}
                    >
                      {this.state.courseCoverImg.length !== 1 && uploadButton}
                    </Upload>
                  )}
                </FormItem>
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
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.common.qiniuToken || '',
    orgList: state.eduStudents.orgList,
    orgLevel: state.eduStudents.orgLevel,
    orgId: state.eduStudents.orgId,
    orgName: state.eduStudents.orgName,
    channelListAll: state.eduStudents.channelListAll,
    courseList: state.eduStudents.courseList,
    courseTypeList: state.eduStudents.courseTypeList,
    idList: state.eduStudents.idList,
    queryAllUserList: state.eduStudents.queryAllUser,
    pagination: state.eduStudents.courseListpagination,
    getStudentLinkType: state.eduStudents.getStudentLinkType,
    getStudentType: state.eduStudents.getStudentType,
    getStudentlevel: state.eduStudents.getStudentlevel,
    getCourseType: state.eduStudents.getCourseType,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddStudent))

