import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Select, Table, Input, Form, Row, Col, Button, Popconfirm, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { showModalForm } from '../../../../components/modal/ModalForm'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Channel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        orgId: '',
        name: '',
        currentPage: '1',
        pageSize: '20'
      },
    }
  }
  componentDidMount() {
    const { dispatch } = this.props
    const org = {
      orgMod: '1',
      orgLevel: '1'
    }
    dispatch(actions.getOrg({ org: org })).then(res => {
      if (res.myOrgLevel === '0') {
        dispatch(actions.getChannelList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { orgId: res.myOrgList[0].id }) }, () => {
          dispatch(actions.getChannelList(this.state.reqBean))
        })
      }
    })
  }

  _handleChangeStatus = (id, status) => {
    const req = {
      id: id
    }
    this.props.dispatch(actions.changeStatus(req)).then(res => {
      if (res) {
        this.props.dispatch(actions.getChannelList(this.state.reqBean))
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          orgId: values.orgId,
          name: values.name,
          currentPage: '1',
          pageSize: '20'
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(actions.getChannelList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    const { current, pageSize } = page
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize })
    }, () => {
      this.props.dispatch(actions.getChannelList(this.state.reqBean))
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
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
      key: 'orgName',
      title: '所属机构',
      dataIndex: 'orgName',
    },
    {
      key: 'name',
      title: '频道名称',
      dataIndex: 'name'
    },
    {
      key: 'mark',
      title: '频道标识',
      dataIndex: 'mark'
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {btnRole.includes('delete') && (
              <Popconfirm
                title='删除频道后，该频道所有的资讯将同步被删除，确认删除？'
                onConfirm={() => this._handleChangeStatus(record.id)}
              >
                <a size='small'>删除</a>
              </Popconfirm>
            )}
            <Divider type='vertical' />
            {btnRole.includes('edit') &&
              <Link
                to='#'
                onClick={() => this.edit(record.id)}
              >修改
              </Link>
            }
          </span>
        )
      }
    }
  ]

  add = () => {
    const { orgList } = this.props
    showModalForm({
      title: '新增',
      fields: [
        {
          id: 'orgId',
          props: {
            label: '所属机构',
          },
          options: {
            rules: [{
              required: true,
              message: '请选择所属机构',
            }],
            initialValue: orgList.myOrgLevel === '0' ? '' : (orgList.myOrgList && orgList.myOrgList[0].id),
          },
          element: (
            <Select
              placeholder='请选择所属机构'
              getPopupContainer={() => document.getElementById('orgId')}
              disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
            >
              {
                orgList.myOrgList.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.orgName}
                    </Option>
                  )
                })
              }
            </Select>
          ),
          hasPopup: true
        }, {
          id: 'name',
          placeHolder: '频道名称',
          props: {
            label: '频道名称'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入25字符以内的频道名称',
              max: 25
            }]
          },
        }
      ],
      onOk: values => {
        this.props.dispatch(actions.channelAdd({ orgId: values.orgId, name: values.name })).then(res => {
          if (res) {
            this.props.dispatch(actions.getChannelList(this.state.reqBean))
          }
        })
      }
    })
  }

  edit = (id) => {
    this.props.dispatch(actions.getChannelDetail({ id: id })).then(res => {
      if (res.code === 0) {
        const { orgList } = this.props
        showModalForm({
          title: '编辑',
          fields: [
            {
              id: 'orgId',
              props: {
                label: '所属机构',
              },
              options: {
                initialValue: res.data.orgId,
                rules: [{
                  required: true,
                  message: '请输入25字符以内的频道名称',
                  max: 25
                }],
              },
              element: (
                <Select
                  placeholder='请选择所属机构'
                  getPopupContainer={() => document.getElementById('orgId')}
                  disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
                >
                  {
                    orgList.myOrgList.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.orgName}
                        </Option>
                      )
                    })
                  }
                </Select>
              ),
              hasPopup: true
            }, {
              id: 'name',
              placeHolder: '频道名称',
              props: {
                label: '频道名称'
              },
              options: {
                initialValue: res.data.name,
                rules: [{
                  required: true,
                  message: '请输入频道名称'
                }]
              },
            }, {
              id: 'mark',
              props: {
                label: '标识',
              },
              options: {
                initialValue: res.data.mark,
                disabled: true,
                rules: [{
                  required: true,
                  message: '请输入频道名称'
                }]
              },
              element: (
                <Input
                  disabled={true}
                  placeholder='请输入频道名称'
                />
              )
            }
          ],
          onOk: values => {
            this.props.dispatch(actions.channelEdit({ orgId: values.orgId, name: values.name, mark: values.mark, id: id })).then(res => {
              if (res) {
                this.props.dispatch(actions.getChannelList(this.state.reqBean))
              }
            })
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, orgList, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
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
                      required: false,
                    }],
                    initialValue: orgList.myOrgLevel === '0' ? '' : (orgList.myOrgList && orgList.myOrgList[0].id),
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('orgId')}
                      disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
                    >
                      <Option value=''>全部</Option>
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
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='频道名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='频道名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {btnRole.includes('add') && (
                  <Button
                    type='primary'
                    title='新增'
                    onClick={this.add}
                  >
                    新增
                  </Button>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.channel.channelList,
    page: state.channel.page,
    auths: state.common.auths,
    orgList: state.banner.orgData,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Channel))
