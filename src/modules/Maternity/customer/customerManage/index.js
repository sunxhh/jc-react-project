import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as urls from 'Global/urls'
import TableFilter from '../../../../components/tableFilter/index'
import { getCustomerList, getCenterList, changeStatus, saveIndexQueryData } from './reduck'
import { Link } from 'react-router-dom'
import { Select, Table, Popconfirm, Divider, Popover } from 'antd'
import style from './index.less'
import moment from 'moment'

const Option = Select.Option

const type = {
  '0': '宝宝会员',
  '1': '妈妈会员',
  '2': '登记客户'
}

const process = {
  '0': '未启用',
  '1': '潜在用户',
  '2': '意向用户',
  '3': '签单用户',
  '4': '正式客户'
}

const sex = {
  0: '女',
  1: '男'
}

const source = {
  '1': '客户介绍',
  '2': '来访咨询'
}

const status = {
  '1': '有效',
  '2': '无效'
}

const reqBean = {
  centerId: null,
  type: null,
  sex: null,
  source: null,
  status: null,
  process: null,
  keyWords: null,
  currentPage: 1,
  pageSize: 20,
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: reqBean
    }
  }

  componentWillMount() {
    const { dispatch, indexQueryData } = this.props
    dispatch(getCustomerList(indexQueryData))
    dispatch(getCenterList({}))
  }

  componentWillUnmount () {
    if (!location.pathname.startsWith(`${urls.MATER_CUSTOMER_MANAGE}`)) {
      this.props.dispatch(saveIndexQueryData({ currentPage: 1, pageSize: 20 }))
    }
  }

  _handleChangeStatus = (id, status) => {
    const req = {
      id: id,
      status: status
    }
    this.props.dispatch(changeStatus(req, this.props.indexQueryData))
  }

  _handleSearch = values => {
    const finalReqBean = {
      currentPage: 1,
      centerId: values.centerId === '' ? null : values.centerId,
      type: values.type === '' ? null : values.type,
      sex: values.sex === '' ? null : values.sex,
      source: values.source === '' ? null : values.source,
      status: values.status === '' ? null : values.status,
      process: values.process === '' ? null : values.process,
      keyWords: values.keyWords === undefined ? null : values.keyWords,
      pageSize: 20
    }
    this.setState({
      reqBean: finalReqBean
    }, () => {
      this.props.dispatch(getCustomerList(this.state.reqBean))
      this.props.dispatch(saveIndexQueryData(this.state.reqBean))
    })
  }

  onChange = page => {
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page })
    }, () => {
      this.props.dispatch(getCustomerList(this.state.reqBean))
      this.props.dispatch(saveIndexQueryData(this.state.reqBean))
    })
  }

  _addCustomerBtn = () => {
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    if (btnRole.includes('add')) {
      return {
        id: 'add',
        name: '新增',
        props: {
          type: 'primary',
        },
        handleClick: `${urls.CUSTOMER_ADD}` // type: ['string', 'function'] string: 路由跳转；function: 执行点击事件
      }
    }
  }

  _getEditBtn = (hasAuth, record) => {
    if (!hasAuth) {
      return null
    }
    return record.type.toString() === '0'
      ? <Link to={`${urls.CUSTOMER_EDIT_BABY}/${record.id}`} >编辑</Link>
      : <Link to={`${urls.CUSTOMER_EDIT}/editBasic/${record.id}/edit`}>编辑</Link>
  }

  render() {
    const { result, page, centerList, indexQueryData, showListSpin } = this.props
    const columns = [{
      key: 'index',
      title: '编号',
      dataIndex: 'index',
      fixed: 'left',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{pageSize * currentPage + (index + 1) - pageSize}</span>
        )
      }
    }, {
      title: '所在中心',
      dataIndex: 'centerId',
      render: text => {
        return centerList.filter(center => {
          return center.id === text
        }).map(item => {
          return (
            <span key={item.id}>{item.orgName}</span>
          )
        })
      }
    }, {
      key: 'name',
      title: '客户名',
      dataIndex: 'name'
    }, {
      key: 'type',
      title: '客户类型',
      dataIndex: 'type',
      render: (text, record, index) => { return <span>{ type[record.type] }</span> }
    }, {
      key: 'process',
      title: '跟进阶段',
      dataIndex: 'process',
      render: (text, record, index) => { return <span>{ process[record.process] }</span> }
    }, {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex',
      render: (text, record, index) => { return <span>{ sex[record.sex] }</span> }
    }, {
      key: 'mobile',
      title: '联系方式',
      dataIndex: 'mobile'
    }, {
      key: 'source',
      title: '客户来源',
      dataIndex: 'source',
      render: (text, record, index) => { return <span>{ source[record.source] }</span> }
    }, {
      key: 'status',
      title: '客户状态',
      dataIndex: 'status',
      render: (text, record, index) => { return <span>{ status[record.status] }</span> }
    }, {
      key: 'processorName',
      title: '跟进人员',
      dataIndex: 'processorName'
    }, {
      key: 'modifyTime',
      title: '最近更改日期',
      dataIndex: 'modifyTime',
      render: text => {
        return (
          <Popover
            placement='topRight'
            content={<div className={style['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='最近更改日期'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    }, {
      key: 'processTime',
      title: '上次跟进日期',
      dataIndex: 'processTime',
      render: text => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '暂无'}</span>
      }
    }, {
      key: 'createUser',
      title: '创建人',
      dataIndex: 'createUser'
    }, {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: 135,
      fixed: 'right',
      render: (text, record) => {
        let status = record.status
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const statusHtml = (
          <div className={style['basic-a']}>
            {
              btnRole.includes('check') &&
              <Link to={`${urls.CUSTOMER_SEE}/seeBasic/${record.id}/see/${record.type}`}>查看</Link>
            }
            {
              btnRole.includes('check') && (
                btnRole.includes('edit') ||
                (btnRole.includes('follow') && record.type.toString() !== '0') ||
                btnRole.includes('invalid')) &&
                <Divider type='vertical' />
            }
            {
              this._getEditBtn(btnRole.includes('edit'), record)
            }
            {
              btnRole.includes('edit') && (
                (btnRole.includes('follow') && record.type.toString() !== '0') ||
                btnRole.includes('invalid')) &&
                <Divider type='vertical' />
            }
            {
              (btnRole.includes('follow') && record.type.toString() !== '0') &&
              <Link
                to={`${urls.CUSTOMER_FOLLOW}/${record.id}`}
              >
                跟进情况
              </Link>
            }
            {
              btnRole.includes('follow') && record.type.toString() !== '0' && btnRole.includes('invalid') &&
              <Divider type='vertical' />
            }
          </div>
        )
        return (
          <div className={style['basic-a']}>
            {statusHtml}
            {
              btnRole.includes('invalid') &&
              <Popconfirm
                title={`确定要置为${status === 1 ? '无效' : '有效'}吗？`}
                onConfirm={() => this._handleChangeStatus(record.id, status === 1 ? 2 : 1)}
              >
                <a size='small'>{status === 1 ? <span>置为无效&nbsp;&nbsp;</span> : <span>置为有效&nbsp;&nbsp;</span>}</a>
              </Popconfirm>
            }
          </div>
        )
      }
    }]

    const filterSetting = {
      layout: 'inline', // ['horizontal', 'vertical', 'inline'] default: inline
      fields: [
        {
          id: 'centerId',
          props: {
            label: '所在中心',
          },
          options: {
            initialValue: indexQueryData.centerId || ''
          },
          span: 8,
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('centerId')}
            >
              <Option value=''>全部</Option>
              {
                centerList && centerList.map(item => {
                  return (
                    <Option
                      key={item.id}
                      value={item.id}
                    >{item.orgName}
                    </Option>
                  )
                })
              }
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'type',
          props: {
            label: '客户类型',
          },
          span: 8,
          options: {
            initialValue: indexQueryData.type || ''
          },
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('type')}
            >
              <Option value=''>全部</Option>
              <Option value='0'>宝宝会员</Option>
              <Option value='1'>妈妈会员</Option>
              <Option value='2'>登记客户</Option>
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'sex',
          props: {
            label: '性别',
          },
          span: 8,
          options: {
            initialValue: indexQueryData.sex || ''
          },
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('sex')}
            >
              <Option value=''>全部</Option>
              <Option value='0'>女</Option>
              <Option value='1'>男</Option>
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'source',
          props: {
            label: '客户来源',
          },
          span: 8,
          options: {
            initialValue: indexQueryData.source || ''
          },
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('source')}
            >
              <Option value=''>全部</Option>
              <Option value='1'>客户介绍</Option>
              <Option value='2'>来访咨询</Option>
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'status',
          props: {
            label: '客户状态',
          },
          span: 8,
          options: {
            initialValue: indexQueryData.status || ''
          },
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('status')}
            >
              <Option value=''>全部</Option>
              <Option value='1'>有效</Option>
              <Option value='2'>无效</Option>
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'process',
          props: {
            label: '跟进阶段',
          },
          span: 8,
          options: {
            initialValue: indexQueryData.process || ''
          },
          element: (
            <Select
              dropdownMatchSelectWidth={false}
              getPopupContainer={() => document.getElementById('process')}
            >
              <Option value=''>全部</Option>
              <Option value='1'>潜在用户</Option>
              <Option value='2'>意向用户</Option>
              <Option value='3'>签单用户</Option>
              <Option value='4'>正式客户</Option>
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'keyWords',
          props: {
            label: '关键词',
          },
          span: 8,
          placeHolder: '关键词'
        },
      ],
      extendButtons: [
        this._addCustomerBtn()
      ]
    }

    const pagination = {
      total: parseInt(page.totalCount),
      pageSize: parseInt(page.pageSize),
      current: parseInt(page.currentPage),
      showTotal: total => `共${total}条`,
      onChange: this.onChange,
      showQuickJumper: true,
    }

    return (
      <div>
        <TableFilter
          filterSetting={filterSetting}
          handleChange={this._handleSearch}
        />
        <Table
          columns={columns}
          loading={showListSpin}
          dataSource={result}
          rowKey={'id'}
          pagination={pagination}
          scroll={{ x: 1600 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    indexQueryData: state.customerManage.saveIndexQueryData,
    result: state.customerManage.result,
    page: state.customerManage.page || {},
    centerList: state.customerManage.centerList,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Index)
