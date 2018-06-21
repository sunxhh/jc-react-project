import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'antd'
import { getSortDetail } from './reduck'

class SortDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortOrderId: this.props.match.params.id,
      isPagination: true
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getSortDetail({ sortOrderId: this.props.match.params.id, currentPage: 1, pageSize: 10000 }))
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageNo, pageSize } = this.props.page
        return (
          <span>
            {
              pageNo *
              pageSize +
              (index + 1) -
              pageSize
            }
          </span>
        )
      }
    },
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
    },
    {
      key: 'goodsName',
      title: 'SKU名称',
      dataIndex: 'goodsName',
    },
    {
      key: 'goodsCatgName',
      title: '所属分类',
      dataIndex: 'goodsCatgName',
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
    },
    {
      key: 'goodsQuantity',
      title: '订单数量',
      dataIndex: 'goodsQuantity',
    },
    {
      key: 'sortQuantity',
      title: '分拣数量',
      dataIndex: 'sortQuantity',
    },
    {
      key: 'positionCode',
      title: '库位号',
      dataIndex: 'positionCode',
    },
    {
      key: 'outerOrderId',
      title: '订单号',
      dataIndex: 'outerOrderId',
    }
  ]

  _handlePageChange = (page) => {
    this.props.dispatch(getSortDetail({ sortOrderId: this.state.sortOrderId, currentPage: parseInt(page), pageSize: 10000 }))
  }

  _handlePrint = () => {
    this.setState({
      isPagination: false
    }, () => {
      const headstr = `<html><head><style media=print>.noPrint{display: none}.PageNext{page-break-after:always;}</style></head><body>`
      const footstr = '</body>'
      const newstr = document.all.item(`printPage`).innerHTML
      const oldstr = document.body.innerHTML
      document.body.innerHTML = headstr + newstr + footstr
      window.print()
      document.body.innerHTML = oldstr
      window.location.reload()
    })
  }

  render () {
    const { list, showListSpin, page, sortDetail } = this.props
    const { isPagination } = this.state
    const pagination = {
      current: parseInt(page.pageNo),
      onChange: this._handlePageChange,
      pageSize: parseInt(page.pageSize),
      total: parseInt(page.records),
      showTotal: (total) => (<span>共{total}条</span>)
    }
    return (
      <div>
        <div style={{ padding: '10px', height: '53px', clear: 'both', lineHeight: '34px', marginBottom: '12px' }}>
          <div style={{ float: 'right' }}>
            <Button
              type='primary'
              title='返回'
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
            <Button
              title='A4打印'
              type='primary'
              onClick={this._handlePrint}
            >
              A4打印
            </Button>
          </div>
        </div>
        <div id='printPage'>
          <div style={{ marginBottom: '15px' }}>
            单据编号：
            <span style={{ display: 'inline-block', marginRight: '15px' }}>{this.state.sortOrderId}</span>
            收件人：
            <span style={{ display: 'inline-block', marginRight: '15px' }}>{sortDetail.receiveUserName}</span>
            电话：
            <span style={{ display: 'inline-block', marginRight: '15px' }}>{sortDetail.receiveUserTelephone}</span>
            地址：
            <span style={{ display: 'inline-block', marginRight: '15px' }}>{((sortDetail.receiveUserProvince + sortDetail.receiveUserCity + sortDetail.receiveUserArea) || '') + sortDetail.receiveUserAddress}</span>
          </div>
          <Table
            columns={this._columns}
            dataSource={list}
            rowKey='skuNo'
            pagination={isPagination ? pagination : false}
            loading={showListSpin}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    list: state.supplyChain.sortList.detail,
    page: state.supplyChain.sortList.detailPage,
    sortDetail: state.supplyChain.sortList.sortDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SortDetail)
