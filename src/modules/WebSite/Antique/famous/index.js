import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'Utils/lang'
import style from './style.less'
import { Button, Table, Input, Popconfirm, Form, Row, Col, Divider } from 'antd'
import { Link } from 'react-router-dom'
import * as actions from './reduck'
import { ANTIQUE_FAMOUS_ADD } from 'Global/urls'
import { genPagination } from 'Utils/helper'
import moment from 'moment'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const defaultPage = {
  currentPage: 1,
  pageSize: 20
}

class Famous extends Component {
  state = {
    name: ''
  }

  componentDidMount() {
    this._getFamousList(defaultPage)
  }

  _getFamousList(req) {
    const { dispatch, page } = this.props
    const defReq = {
      name: this.state.name.trim(),
      currentPage: page.currentPage,
      pageSize: page.pageSize
    }
    req = Object.assign({}, defReq, req)
    dispatch(actions.getFamousList(req))
  }

  handleChangeStatus = (id) => {
    this.props.dispatch(actions.changeStatus({ id })).then(res => {
      if (res) {
        this._getFamousList()
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          name: values.name
        }, () => {
          this._getFamousList({
            currentPage: 1
          })
        })
      }
    })
  }

  _handlePageChange = (page) => {
    const propsPage = this.props.page
    this._getFamousList({
      currentPage: page.pageSize !== propsPage.pageSize ? 1 : page.current,
      pageSize: page.pageSize,
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
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
      key: 'sort',
      title: '排序',
      dataIndex: 'sort'
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text, record, index) => {
        return (
          <div>
            {moment(text).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        )
      }
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
            {
              btnRole.includes('delete') && <Popconfirm
                title='删除后名家信息将无法追回，确认删除？'
                onConfirm={() => this.handleChangeStatus(record.id)}
              >
                <a size='small'>删除</a>
              </Popconfirm>
            }
            {
              btnRole.includes('delete') &&
              btnRole.includes('edit') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('edit') && <Link
                to={`${ANTIQUE_FAMOUS_ADD}/${record.id}`}
              >修改
              </Link>
            }
          </span>
        )
      }
    }
  ]

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination({ ...page, records: page.totalCount, pageNo: page.currentPage })
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row className='search-form'>
            <Col span={5}>
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
            <Col span={9}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {
                  btnRole.includes('add') && (
                    <Link to={ANTIQUE_FAMOUS_ADD}>
                      <Button
                        type='primary'
                        title='新增'
                      >
                        新增
                      </Button>
                    </Link>
                  )
                }
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
    list: state.antique.famous.famousList,
    page: state.antique.famous.page,
    auths: state.common.auths
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Famous))
