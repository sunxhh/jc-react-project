import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { createAction } from 'redux-actions'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'
import parmasUtil from '../../../utils/params'
import { baseUrl } from '../../../config'
import { showModalForm } from '../../../components/modal/ModalForm'
import {
  queryOrg,
  getList,
  del,
  msgNotice,
  saleName,
  channelListAll,
  getStudentType,
  getStudentTlevel,
  getCourseType,
  getTouchType,
  SET_STUDENT_ROWKEYS,
} from '../studentManage/reduck'
import { Button, Popconfirm, Table, Form, Input, Select, Row, Col, Popover } from 'antd'
import moment from 'moment'
import styles from './index.less'
import { isEmpty } from '../../../utils/lang'
import storage from '../../../utils/storage'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const sex = {
  '0': '男',
  '1': '女',
}

const touchType = {
  '1': '咨询沟通',
  '2': '售前沟通',
  '3': '活动通知',
  '4': '电话服务',
  '5': '电话家访',
  '6': '其他',
}

class StudentCenter extends Component {
  static defaultProps = {
    studentlist: [],
    idList: [],
    orgId: '',
    orgLevel: '',
    orgName: '',
    pagination: {
      pageNo: 1,
      records: 0,
      pageSize: '20',
    },
    channelListpagination: {
      records: 1,
      total: 0,
      pageSize: '20',
    },
    selectedRowKeys: [],
    channelList: {},
    queryAllUserList: [],
    getStudentLinkType: []
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(queryOrg({
      org: {
        orgMod: 1,
        orgLevel: 2
      }
    }))
    dispatch(getStudentType({ codeType: 'stuType' }))
    dispatch(getStudentTlevel({ codeType: 'stuIntentLevel' }))
    dispatch(getCourseType({ codeType: 'courseType' }))
    dispatch(getTouchType({ codeType: 'stuTouchType' }))
    dispatch(createAction(SET_STUDENT_ROWKEYS)([]))
    this._getList()
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

  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      fixed: 'left',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.pagination
        return (
          <span>{
            pageSize *
            pageNo +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex',
      width: 100,
      render: (key) => (
        <span>{sex[key]}</span>
      )
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 110,
      render: (text, record) => (
        <Link
          to={`${urls.EDU_STUDENT_DETAIL}/${record.id}`}
          title='点击查看详情'
        >
          {text}
        </Link>
      )
    },
    {
      key: 'studentNo',
      title: '编号',
      dataIndex: 'studentNo',
      width: 100,
      render: (text) => (
        <span>{text}</span>
      )
    },
    {
      key: 'linkPhone',
      title: '联系电话',
      dataIndex: 'linkPhone',
      width: 150,
      render: (text) => (
        <span>{text}</span>
      )
    },
    {
      key: 'orgName',
      title: '所属机构',
      dataIndex: 'orgName',
      width: 110,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='所属机构'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'intentLevel',
      title: '意向度',
      dataIndex: 'intentLevel',
      width: 100,
      render: (text, record) => {
        return <span>{this.getDictValue(this.props.getStudentlevel, record.intentLevel)}</span>
      }
    },
    {
      key: 'course',
      title: '意向课程',
      dataIndex: 'course',
      width: 110,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text && text.courseNames}</div>}
            title='意向课程'
          >
            <span>{text && text.courseNames.length > 5
              ? `${text.courseNames.substring(0, 5)}...`
              : text && text.courseNames}
            </span>
          </Popover>
        )
      }
    },
    {
      key: 'touchType',
      title: '沟通类型',
      dataIndex: 'touchType',
      width: 130,
      render: (text, row) => {
        return (<span>{row.touch && row.touch.length > 0 && touchType[row.touch[0].touchType]}</span>)
      }
    },
    {
      key: 'touchContent',
      title: '沟通内容',
      dataIndex: 'touchContent',
      width: 150,
      render: (text, row) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{row.touch && row.touch[0].touchContent}</div>}
            title='沟通内容'
          >
            <span>
              {
                row.touch && row.touch.length > 0 && row.touch[0].touchContent.length > 15
                  ? `${row.touch[0].touchContent.substring(0, 20)}...`
                  : row.touch && row.touch.length > 0 && row.touch[0].touchContent
              }
            </span>
          </Popover>
        )
      }
    },
    {
      key: 'touchNextTime',
      title: '回访时间',
      dataIndex: 'touchNextTime',
      width: 125,
      render: (text, row) => (
        <span>{row.touch && row.touch[0].touchNextTime ? moment(row.touch[0].touchNextTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      )
    },
    {
      key: 'touchTime',
      title: '沟通时间',
      dataIndex: 'touchTime',
      width: 125,
      render: (text, row) => (
        <span>{row.touch && row.touch.length > 0 && moment(row.touch[0].touchTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'studentsType',
      title: '学员类型',
      dataIndex: 'studentType',
      width: 110,
      render: (text, record) => {
        return <span>{this.getDictValue(this.props.getStudentType, record.studentType)}</span>
      }
    },
    {
      key: 'channelName',
      title: '渠道',
      dataIndex: 'channelName',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='渠道'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'salerName',
      title: '销售人员',
      dataIndex: 'salerName',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='销售人员'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'updateUser',
      title: '操作人员',
      dataIndex: 'updateUser',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='操作人员'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'updateTime',
      title: '更新时间',
      fixed: 'right',
      dataIndex: 'updateTime',
      width: 110
    }
  ]

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.pagination.pageNo, pageSize = this.props.pagination.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ifTouchLate: arg.ifTouchLate,
      student: {
        name: arg.name ? arg.name : '',
        orgId: arg.orgId ? arg.orgId : '',
        channelId: arg.channelId ? arg.channelId : '',
        intentLevel: arg.intentLevel ? arg.intentLevel : '',
        salerId: arg.salerId ? arg.salerId : '',
        studentNo: arg.studentNo ? arg.studentNo : '',
        studentType: arg.studentType ? arg.studentType : ''
      },
      touchType: arg.touchType ? arg.touchType : '',
      currentPage: current,
      pageSize: pageSize
    }
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getList(arg))
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    let arg = {}
    if (page.pageSize !== this.props.pagination.pageSize) {
      arg = this._getParameter(1, page.pageSize)
    } else {
      arg = this._getParameter(page.current, page.pageSize)
    }
    this.props.dispatch(getList(arg))
  }

  // 输入框选择、输入
  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 点击查询
  _handleQuery = () => {
    const { dispatch } = this.props
    dispatch(createAction(SET_STUDENT_ROWKEYS)([]))
    this._getList(1)
  }

  // 点击删除
  _heandleDels = () => {
    const { idList } = this.props
    if (idList.length === this.props.studentlist.length) {
      const page = Number(this.props.pagination.pageNo)
      const current = page > 1 ? Number(this.props.pagination.pageNo) - 1 : 1
      this.props.dispatch(del({ idList }, this._getParameter(current)))
      return
    }
    this.props.dispatch(del({ idList }, this._getParameter()))
  }

  _onSelectChange = (ids, idsData) => {
    const { dispatch } = this.props
    dispatch(createAction(SET_STUDENT_ROWKEYS)({ ids, idsData }))
  }

  // 短信通知
  _addShowModal = () => {
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 24 }
      },
      title: '短信内容',
      fields: [
        {
          id: 'msg',
          props: {
            label: ''
          },
          options: {
            rules: [{
              required: true,
              message: '请输入短信内容！'
            }],
          },
          element: (
            <Input.TextArea
              rows={10}
              placeholder='请输入短信内容'
            />
          )
        }
      ],
      onOk: (values) => {
        const { idList } = this.props
        this.props.dispatch(msgNotice({
          idList,
          msg: values.msg
        }))
      }
    })
  }

  // 导出
  handleExport = (e) => {
    e.preventDefault()
    const values = this.props.form.getFieldsValue()
    values.currentPage = this.props.pagination.pageNo || ''
    values.pageSize = this.props.pagination.pageSize || ''
    const params = parmasUtil.json2url(values)
    const ticket = storage.get('userInfo').ticket
    const url = (baseUrl === '/') ? `http://${location.host}` : baseUrl
    let href = `${url}/api/edu/student/export?ticket=${ticket}&${params}`
    location.href = href
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { match, auths, channelListAll, queryAllUserList, getStudentType, getStudentlevel, getTouchType } = this.props
    const path = match.path
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const rowSelection = {
      selectedRowKeys: this.props.idList,
      onChange: this._onSelectChange,
      getCheckboxProps: record => ({
        disabled: authState.indexOf('edit') === -1 &&
        authState.indexOf('delete') === -1 &&
        authState.indexOf('editTouch') === -1 &&
        authState.indexOf('addTouch') === -1 &&
        authState.indexOf('sendMsg') === -1 &&
          authState.indexOf('export') === -1
      })
    }
    const pagination = genPagination(this.props.pagination)
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    return (
      <div>
        <Form>
          <Row
            type='flex'
            justify='start'
          >
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='编号：'
              >
                {getFieldDecorator('studentNo')(
                  <Input
                    type='text'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='姓名：'
              >
                {getFieldDecorator('name')(
                  <Input
                    type='text'
                    placeholder='请输入姓名'
                  />
                )}
              </FormItem>
            </Col>
            <Col
              id='orgId'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='所属机构：'
              >
                {getFieldDecorator('orgId', {
                  initialValue: this.props.orgId && this.props.orgLevel === '2' ? this.props.orgId : '',
                })(
                  <Select
                    placeholder='请选择所属机构'
                    showSearch={true}
                    disabled={this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                    getPopupContainer={() => document.getElementById('orgId')}
                    filterOption={this._filterOption}
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
              id='intentLevel'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='意向度:'
              >
                {getFieldDecorator('intentLevel')(
                  <Select
                    placeholder='请选择意向度'
                    getPopupContainer={() => document.getElementById('intentLevel')}
                  >
                    <Option
                      value=''
                      key=''
                    >
                      全部
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
            <Col
              id='touchType'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='沟通类型：'
                className={styles['form-item']}
              >
                {getFieldDecorator('touchType')(
                  <Select
                    getPopupContainer={() => document.getElementById('touchType')}
                  >
                    <Option
                      value=''
                      key=''
                    >
                      全部
                    </Option>
                    {
                      getTouchType && getTouchType.map((item) => {
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
            <Col
              id='studentsType'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='学员类型'
              >
                {getFieldDecorator('studentType')(
                  <Select
                    getPopupContainer={() => document.getElementById('studentsType')}
                  >
                    <Option
                      value=''
                      key=''
                    >
                      全部
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
            <Col
              id='channel'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='渠道：'
                className={styles['form-item']}
              >
                {getFieldDecorator('channelId')(
                  <Select
                    showSearch
                    placeholder='请选择沟通渠道'
                    filterOption={this._filterOption}
                    getPopupContainer={() => document.getElementById('channel')}
                  >
                    <Option
                      key='-1'
                      value=''
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
              span={8}
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
                      全部
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
            <Col
              id='ifTouchLate'
              span={8}
            >
              <FormItem
                {...formItemLayout}
                label='回访超时：'
              >
                {getFieldDecorator('ifTouchLate')(
                  <Select
                    getPopupContainer={() => document.getElementById('ifTouchLate')}
                  >
                    <Option value=''>全部</Option>
                    <Option value='0'>否</Option>
                    <Option value='1'>是</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>

        <div className='operate-btn'>
          <Button
            style={{ marginRight: 10 }}
            type='primary'
            title='点击查询'
            onClick={this._handleQuery}
          >
            查询
          </Button>
          {authState.indexOf('add') !== -1 && (
            <Link to={`${urls.EDU_STUDENT_ADD}`}>
              <Button
                style={{ marginRight: 10 }}
                type='primary'
                title='点击新增'
              >
                新增
              </Button>
            </Link>
          )}
          {authState.indexOf('edit') !== -1 && (
            <Link to={`${urls.EDU_STUDENT_EDIT}/${this.props.idList}`}>
              <Button
                style={{ marginRight: 10 }}
                disabled={this.props.idList.length !== 1}
                type='primary'
                title='点击编辑'
              >
                编辑
              </Button>
            </Link>
          )}
          {authState.indexOf('delete') !== -1 && (
            <Popconfirm
              title={`确定要删除吗?`}
              onConfirm={this._heandleDels}
            >
              <Button
                style={{ marginRight: 10 }}
                disabled={this.props.idList.length > 0 ? 0 : 1}
                type='danger'
                title='点击删除'
              >删除
              </Button>
            </Popconfirm>
          )}
          {authState.indexOf('addTouch') !== -1 && (
            <Link to={`${urls.EDU_ADD_TOUCH}/${this.props.idList}`}>
              <Button
                style={{ marginRight: 10 }}
                type='primary'
                title='添加沟通'
                disabled={this.props.idList.length !== 1}
              >
                添加沟通
              </Button>
            </Link>
          )}
          {authState.indexOf('editTouch') !== -1 && (
            <Link to={`${urls.EDU_EDIT_TOUCH}/${this.props.idList}`}>
              <Button
                style={{ marginRight: 10 }}
                type='primary'
                title='编辑沟通'
                disabled={!(this.props.idList.length === 1 && this.props.idListData.filter(item => !!item.touch).length > 0)}
              >
                编辑沟通
              </Button>
            </Link>
          )}
          {authState.indexOf('sendMsg') !== -1 && (
            <Button
              style={{ marginRight: 10 }}
              disabled={this.props.idList.length > 0 ? 0 : 1}
              type='primary'
              title='短信通知'
              onClick={this._addShowModal}
            >
              短信通知
            </Button>
          )}
          {authState.indexOf('export') !== -1 && (
            <Button
              style={{ marginRight: 10 }}
              type='primary'
              title='导出'
              onClick={this.handleExport}
            >
              导出
            </Button>
          )}
        </div>

        <Table
          className={styles['table-center']}
          columns={this._columns}
          rowKey='id'
          dataSource={this.props.studentlist}
          scroll={{ x: 1800 }}
          rowSelection={rowSelection}
          onChange={this._handlePageChange}
          loading={this.props.isLoading}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    studentlist: state.eduStudents.studentlist,
    pagination: state.eduStudents.pagination,
    channelListAll: state.eduStudents.channelListAll,
    isLoading: state.eduStudents.isLoading,
    orgList: state.eduStudents.orgList,
    orgLevel: state.eduStudents.orgLevel,
    orgId: state.eduStudents.orgId,
    orgName: state.eduStudents.orgName,
    selectedRowKeys: state.eduStudents.selectedRowKeys,
    idList: state.eduStudents.idList,
    idListData: state.eduStudents.idListData,
    channelList: state.eduStudents.channelList,
    queryAllUserList: state.eduStudents.queryAllUser,
    auths: state.common.auths,
    getStudentType: state.eduStudents.getStudentType,
    getStudentlevel: state.eduStudents.getStudentlevel,
    getCourseType: state.eduStudents.getCourseType,
    getTouchType: state.eduStudents.getTouchType,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StudentCenter))

