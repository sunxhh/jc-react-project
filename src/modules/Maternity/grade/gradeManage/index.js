import React, { Component } from 'react'
import { Button, Select, Form, Row, Col, Table, Input, Popconfirm, Divider } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
// import styles from './style.less'
import * as actions from './reduck'
import { showModalForm } from '../../../../components/modal/ModalForm'

const FormItem = Form.Item
const SelectOption = Select.Option

class GreadMan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialReq: {
        currentPage: 1,
        pageSize: 20,
      }
    }
  }

  _columns = [{
    title: '序号',
    dataIndex: 'key',
    render: (text, record, index) => {
      const { pageSize, currentPage } = this.props.memberGrade.page
      return (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      )
    }
  }, {
    title: '会员等级名',
    dataIndex: 'rankName',
  }, {
    title: '最小消费总额',
    dataIndex: 'minConsum',
  }, {
    title: '最大消费总额',
    dataIndex: 'maxConsum',
  }, {
    title: '享受折扣％',
    dataIndex: 'discount',
  }, {
    title: '描述',
    dataIndex: 'remark',
  }, {
    title: '等级数值',
    dataIndex: 'rankNum',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 108,
    render: (text) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    }
  }, {
    title: '创建人',
    dataIndex: 'createUserName',
  }, {
    title: '操作',
    dataIndex: 'option',
    render: (text, record) => {
      return (
        <span>
          <a
            onClick={() => { this._isShowModal(record, 'lookGrade', 'isLook') }}
          >查看
          </a>
          <Divider type='vertical' />
          <a
            onClick={() => { this._isShowModal(record, 'modifyGrade') }}
          >编辑
          </a>
          <Divider type='vertical' />
          <Popconfirm
            title='确认要删除吗?'
            onConfirm={() => { this._confirmDelete(record.id) }}
            okText='确认'
            cancelText='取消'
          >
            <a href='#'>删除</a>
          </Popconfirm>
        </span>
      )
    }
  }]

  componentDidMount () {
    this.props.dispatch(actions.memberGread())
    this.props.dispatch(actions.getMemberGradeList(this.state.initialReq))
  }

  // 校验 会员名称是否重复
  _checkMember = (rule, value, callback) => {
    this.props.dispatch(actions.getCheckRankName({
      rankName: value
    })).then(res => {
      if (res) {
        callback()
      } else {
        callback('会员名称重复,请重新填写')
      }
    })
  }

  _getQueryData = (current = this.state.initialReq.currentPage, pageSize = this.state.initialReq.pageSize) => {
    const args = { ...this.props.form.getFieldsValue(), currentPage: current, pageSize: pageSize }
    return args
  }

  // 查询会员等级
  _queryMemberGrade = () => {
    const args = this._getQueryData(1)
    this.props.dispatch(actions.getMemberGradeList(args))
  }

  // 删除会员等级
  _confirmDelete = GradeId => {
    const { memberGrade } = this.props
    const args = this._getQueryData()
    if (memberGrade.result.length === 1 && memberGrade.page.currentPage > 1) {
      this.setState({ initialReq: { ...args, currentPage: args.currentPage - 1 }}, () => {
        this.props.dispatch(actions.deleteMemberGrade({ id: GradeId, ...this.state.initialReq }))
      })
    } else {
      this.props.dispatch(actions.deleteMemberGrade({ id: GradeId, ...args }))
    }
  }

  // 点击分页时获取表格数据
  _handlePagination = page => {
    const args = this._getQueryData()
    this.setState({ initialReq: { ...args, currentPage: page }}, () => {
      this.props.dispatch(actions.getMemberGradeList(this.state.initialReq, args))
    })
  }

  // 查看 新建 编辑 会员信息
  _isShowModal = (record, titleType, isLook) => {
    const showTitleType = {
      'addGrade': '新增等级',
      'lookGrade': '查看等级',
      'modifyGrade': '编辑等级',
    }
    showModalForm({
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      title: showTitleType[titleType],
      fields: [
        {
          id: 'rankName',
          props: {
            label: '会员等级'
          },
          options: {
            initialValue: record.rankName || '',
            rules: [{
              required: true,
              message: '请输入会员等级名称!'
            }, {
              validator: titleType === 'addGrade' ? this._checkMember : ''
            }]
          },
          element: (
            <Input
              maxLength='3'
              disabled={isLook === 'isLook'}
              placeholder='请输入会员等级名称'
            />
          )
        },
        {
          id: 'minConsum',
          props: {
            label: '最低消费总额'
          },
          options: {
            initialValue: record.minConsum || '',
            rules: [{
              required: true,
              message: '请输入最低消费总额!'
            }, {
              pattern: /^\d{1,8}(\.\d{1,2})?$/,
              message: '请输入正确的格式'
            }]
          },
          element: (
            <Input
              disabled={isLook === 'isLook'}
              placeholder='请输入最低消费总额'
            />
          )
        },
        {
          id: 'maxConsum',
          props: {
            label: '最高消费总额'
          },
          options: {
            initialValue: record.maxConsum || '',
            rules: [{
              required: true,
              message: '请输入最高消费总额!'
            }, {
              pattern: /^\d{1,8}(\.\d{1,2})?$/,
              message: '请输入正确的格式'
            }]
          },
          element: (
            <Input
              disabled={isLook === 'isLook'}
              placeholder='请输入最高消费总额'
            />
          )
        },
        {
          id: 'rankNum',
          props: {
            label: '等级数值'
          },
          options: {
            initialValue: record.rankNum || '',
            rules: [{
              required: true,
              message: '请输入等级数值!'
            }, {
              pattern: /^[0-9]*$/,
              message: '请输入正确的数字!'
            }]
          },
          element: (
            <Input
              disabled={isLook === 'isLook'}
              placeholder='请输入等级数值'
            />
          )
        },
        {
          id: 'discount',
          props: {
            label: '享受折扣'
          },
          options: {
            initialValue: record.discount || '',
            rules: [{
              required: true,
              message: '请输入享受折扣!'
            }, {
              pattern: /^100$|^(\d|[1-9]\d)$/,
              message: '请输入0-100的正整数!'
            }]
          },
          element: (
            <Input
              disabled={isLook === 'isLook'}
              placeholder='请输入享受折扣'
            />
          )
        },
        {
          id: 'remark',
          props: {
            label: '备注'
          },
          options: {
            initialValue: record.remark || '',
            rules: [{
              max: 500,
              message: '备注描述过长!'
            }]
          },
          element: (
            <Input.TextArea
              disabled={isLook === 'isLook'}
              maxLength='500'
              placeholder='请输入备注'
            />
          )
        }
      ],
      onOk: values => {
        if (titleType === 'addGrade') {
          this.props.dispatch(actions.addMemberGrade({ ...values }, { ...this.state.initialReq }))
        } else if (titleType === 'modifyGrade') {
          return this.props.dispatch(actions.modifyMemberGrade({ ...values }, { id: record.id }, { ...this.state.initialReq }))
        }
      }
    })
  }

  render() {
    const { memberGradeList, memberGrade, showListSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    const pagination = memberGrade && memberGrade.page || {}
    const paginationData = {
      current: pagination.currentPage,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      onChange: this._handlePagination,
      showQuickJumper: true,
      showTotal: total => `共 ${pagination.totalCount} 项`,
    }
    return (
      <div
        id='statusSelect'
        style={{ position: 'relative' }}
      >
        <Form className='search-form'>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'会员等级'}
              >
                {getFieldDecorator('rankName', {})(
                  <Select
                    allowClear={true}
                    placeholder='请选择'
                    getPopupContainer={() => document.getElementById('statusSelect')}
                  >
                    {
                      memberGradeList && memberGradeList.map((memberGradeList, index) => {
                        return (
                          <SelectOption
                            key={index}
                            value={memberGradeList}
                          >{memberGradeList}
                          </SelectOption>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                type='primary'
                onClick={() => { this._queryMemberGrade() }}
              >
                查询
              </Button>
              <Button
                type='primary'
                style={{ marginLeft: 20 }}
                onClick={() => { this._isShowModal('', 'addGrade') }}
              >
                新建
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this._columns}
          dataSource={memberGrade && memberGrade.result || []}
          rowKey='id'
          loading={showListSpin}
          pagination={paginationData}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    memberGrade: state.gradeManageOrg.memberGrade,
    memberGradeList: state.gradeManageOrg.gradeManageList,

    showListSpin: state.common.showListSpin,
    showButtonSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GreadMan))
