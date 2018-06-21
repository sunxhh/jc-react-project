import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import style from './style.less'
import { genPagination, genPlanColumn, genSelectColumn } from 'Utils/helper'
import { ORDER_CENTER_TEMPLATE_DETAIL, ORDER_CENTER_TEMPLATE_ADD } from 'Global/urls'
import { delTemplateList, doneTemplate } from './reduck'
import { AlignCenter, TemplateStatus } from '../dict'

class List extends Component {
  _handlePageChange = (page) => {
    this.props.pageChange && this.props.pageChange(page)
  }

  // 删除模板
  _handleDel = (templateNo) => {
    const filter = { templateNo: templateNo }
    this.props.dispatch(delTemplateList(filter)).then(res => {
      const { page } = this.props
      res && this._handlePageChange(page)
    })
  }

  // 启用模板
  _doneTemplate = (templateNo) => {
    const filter = { templateNo: templateNo }
    this.props.dispatch(doneTemplate(filter)).then(res => {
      const { page } = this.props
      res && this._handlePageChange(page)
    })
  }

  render() {
    const { org, loading } = this.props
    const _columns = [
      genSelectColumn('organizationType', '机构名称', org, AlignCenter),
      genPlanColumn('templateName', '模板名称', AlignCenter),
      genSelectColumn('status', '状态', TemplateStatus, AlignCenter),
      {
        key: 'operation',
        title: '操作',
        ...AlignCenter,
        render: (item) =>
          (
            <div>
              <Link className={style['distance']} to={`${ORDER_CENTER_TEMPLATE_DETAIL}/${item.templateNo}`}>
                查看
              </Link>
              {
                item.status === 0 &&
                <span>
                  <Popconfirm
                    title='模板生效后，将不可以修改，是否启用？'
                    onConfirm={() => this._doneTemplate(item.templateNo)}
                    okText='启用'
                    cancelText='取消'
                  >
                    <a href='#'>启用</a>
                  </Popconfirm>
                  <Link className={style['distance']} to={`${ORDER_CENTER_TEMPLATE_ADD}/${item.templateNo}`}>
                    修改
                  </Link>
                  <Popconfirm
                    title='是否删除？'
                    onConfirm={() => this._handleDel(item.templateNo)}
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='#'>删除</a>
                  </Popconfirm>
                </span>
              }
            </div>
          )
      }
    ]

    const { list, page } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <Table
          columns={_columns}
          dataSource={list}
          bordered
          pagination={pagination}
          onChange={this._handlePageChange}
          rowKey='templateNo'
          loading={loading}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    list: state.orderCenter.template.templateList,
    page: state.orderCenter.template.templatePage,
    org: state.orderCenter.template.orgList,
    loading: state.common.showListSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
