import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, InputNumber, Modal } from 'antd'
import { getSortDetail, pickGoods } from './reduck'
import { isEmpty } from '../../../../utils/lang'

class Continue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortOrderId: this.props.match.params.id,
      detailList: [],
      visible: false,
      list: [],
      isPagination: false
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getSortDetail({ sortOrderId: this.props.match.params.id, currentPage: 1, pageSize: 10000 }))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.continueList !== nextProps.continueList) {
      this.setState({
        detailList: JSON.parse(JSON.stringify(nextProps.continueList))
      })
    }
    if (this.props.list !== nextProps.list) {
      this.setState({
        list: JSON.parse(JSON.stringify(nextProps.list))
      })
    }
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
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
      key: 'sortsQuantity',
      title: '分拣数量',
      dataIndex: 'sortsQuantity',
      render: (text, record, index) => {
        return (
          <span className='noPrint'>
            <InputNumber
              min={0}
              step={1}
              precision={3}
              max={record.goodsQuantity}
              defaultValue={record.sortQuantity}
              onChange={(e) => this.onChange(e, record, index)}
            />
          </span>
        )
      }
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

  onChange = (e, record, index) => {
    const detailList = this.state.detailList
    detailList[index] = {
      skuNo: record.skuNo,
      outerOrderId: record.outerOrderId,
      sortQuantity: !isEmpty(e) ? e : 0
    }
    this.setState({
      detailList
    })
  }

  save = (operatorStatus) => {
    const { dispatch } = this.props
    dispatch(pickGoods({ sortOrderId: this.state.sortOrderId, operateStatus: operatorStatus, detailList: this.state.detailList }))
  }

  mySubmit = (operatorStatus) => {
    const { dispatch } = this.props
    const { detailList, sortOrderId } = this.state
    const isSame = detailList.some((item, index) => {
      if (item.sortQuantity !== this.props.pickList[index].sortQuantity) {
        return true
      } else {
        this.setState({
          visible: true,
        })
      }
    })
    isSame && dispatch(pickGoods({ sortOrderId: sortOrderId, operateStatus: operatorStatus, detailList: detailList }))
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleOk = (e) => {
    const { dispatch } = this.props
    const { detailList, sortOrderId } = this.state
    this.setState({
      visible: false
    }, () => {
      dispatch(pickGoods({ sortOrderId: sortOrderId, operateStatus: '3', detailList: detailList }))
    })
  }

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
    const { showListSpin, page, sortDetail } = this.props
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
              title='保存'
              onClick={() => this.save('2')}
            >
              保存
            </Button>
            <Button
              type='primary'
              title='提交'
              onClick={() => this.mySubmit('3')}
            >
              提交
            </Button>
            <Button
              type='primary'
              title='取消'
              onClick={() => history.go(-1)}
            >
              取消
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
            dataSource={this.state.list}
            rowKey='skuNo'
            pagination={isPagination ? pagination : false}
            loading={showListSpin}
          />
        </div>
        <Modal
          title='提示信息'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          已完全按照订单数量进行分拣，是否继续操作？
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    list: state.supplyChain.sortList.detail,
    pickList: state.supplyChain.sortList.detailList,
    continueList: state.supplyChain.sortList.continueList,
    page: state.supplyChain.sortList.detailPage,
    sortDetail: state.supplyChain.sortList.sortDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Continue)
