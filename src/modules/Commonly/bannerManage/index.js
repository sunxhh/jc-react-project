import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Table, Input, Form, Row, Col, Button, Popconfirm, Divider } from 'antd'
import { getBannerList, getOrg, changeStatus } from './reduck'
import { Link } from 'react-router-dom'
import { isEmpty } from '../../../utils/lang'
import style from './style.less'
import { BANNER_MANAGE_ADD, BANNER_MANAGE_EDIT } from 'Global/urls'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
const status = {
  '0': '待上架',
  '1': '展示中',
  '2': '已下架'
}

class Banner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        name: '',
        orgId: '',
        status: '',
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
    dispatch(getOrg({ org: org })).then(res => {
      if (res.myOrgLevel === '0') {
        dispatch(getBannerList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { orgId: res.myOrgId }) }, () => {
          dispatch(getBannerList(this.state.reqBean))
        })
      }
    })
  }

  _handleChangeStatus = (id, status) => {
    const req = {
      id: id,
      status: status
    }
    this.props.dispatch(changeStatus(req)).then(res => {
      if (res) {
        this.props.dispatch(getBannerList(this.state.reqBean))
      }
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 70,
      fixed: 'left',
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
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'image',
      title: '图片',
      dataIndex: 'image',
      width: 75,
      render: (text, record, index) => {
        return (
          isEmpty(record.image) ? '' : (
            <div className={style['img-wrapper']}>
              <img
                src={record.image}
                alt='图片'
              />
            </div>
          )
        )
      }
    },
    {
      key: 'startTime',
      title: '开始时间',
      width: 108,
      dataIndex: 'startTime'
    },
    {
      key: 'endTime',
      title: '结束时间',
      width: 108,
      dataIndex: 'endTime'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => (
        <span>{status[text]}</span>
      )
    },
    {
      key: 'sort',
      title: '排序',
      width: 75,
      dataIndex: 'sort',
    },
    {
      key: 'orgName',
      title: '所属机构',
      dataIndex: 'orgName',
    },
    {
      key: 'createTime',
      title: '创建时间',
      width: 108,
      dataIndex: 'createTime',
    },
    {
      key: 'updateTime',
      title: '更新时间',
      width: 108,
      dataIndex: 'updateTime',
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: 120,
      fixed: 'right',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {btnRole.includes('down') && (
              <Popconfirm
                title={`确定要${record.status === '0' || record.status === '1' ? '下架' : ''}吗？`}
                onConfirm={() => this._handleChangeStatus(record.id, '2')}
              >
                <a size='small'>{record.status === '0' || record.status === '1' ? '下架' : ''}</a>
              </Popconfirm>
            )}
            {btnRole.includes('down') && (record.status === '0' || record.status === '1') && (
              <Divider type='vertical' />
            )}
            {btnRole.includes('edit') && (
              <Link
                to={`${BANNER_MANAGE_EDIT}/${record.id}`}
              >修改
              </Link>
            )}
          </span>
        )
      }
    }
  ]

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          orgId: values.orgId,
          status: values.status,
          name: values.name,
          currentPage: 1
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getBannerList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.current })
    }, () => {
      this.props.dispatch(getBannerList(this.state.reqBean))
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, orgList, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page, false)
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className={style['search-form']}>
          <Row>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='机构'
              >
                <div
                  id='orgId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('orgId', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('orgId')}
                      disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
                    >
                      <Option value=''>全部</Option>
                      {
                        orgList.myOrgLevel === '0' ? (
                          orgList.myOrgList.map(item => {
                            return (
                              <Option key={item.id} value={item.id}>
                                {item.orgName}
                              </Option>
                            )
                          })
                        ) : (<Option value={orgList.myOrgId}>{orgList.myOrgName}</Option>)
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='状态'
              >
                <div
                  id='status'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('status', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('status')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='0'>待上架</Option>
                      <Option value='1'>展示中</Option>
                      <Option value='2'>已下架</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='名称' />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {btnRole.includes('add') && (
                  <Link to={BANNER_MANAGE_ADD}>
                    <Button
                      type='primary'
                      title='新增'
                    >
                      新增
                    </Button>
                  </Link>
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
          scroll={{ x: 1270 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.banner.bannerList,
    page: state.banner.page,
    auths: state.common.auths,
    orgList: state.banner.orgData,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Banner))

