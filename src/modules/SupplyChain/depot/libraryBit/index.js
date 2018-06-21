import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Table, Divider, Select, Popconfirm } from 'antd'

import TableFilter from 'Components/tableFilter'
import { getLibraryList, libraryBitDetail, libraryDelete, libraryGoodsList as libraryGoodsListReq } from './reduck'
import AddModalContent from './addModalContent'
import { queryOrgByLevel } from 'Global/action'
import { listByWarehouse } from '../../reduck'
// import { isEmpty } from 'Utils/lang'
import { showModalWrapper } from '../../../../components/modal/ModalWrapper'
import { genPagination, genEllipsisColumn } from 'Utils/helper'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../../config'

const Option = Select.Option

class LibraryBit extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(queryOrgByLevel()).then(res => {
      res && dispatch(getLibraryList({ pageSize: 10, currentPage: 1, warehouseNo: res.myOrgLevel === '2' ? res.myOrgCode : '' }))
      res && dispatch(listByWarehouse({ warehouseNo: res.myOrgLevel === '2' ? res.myOrgCode : '' }))
    })
  }

  _handleDelete = (positionNo) => {
    const { dispatch, orgCode } = this.props
    this.props.dispatch(libraryDelete({ positionNo })).then(res => {
      res && dispatch(getLibraryList({ pageSize: 10, currentPage: 1, warehouseNo: orgCode }))
    })
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.libraryList
        return (
          <span>{pageSize * pageNo + (index + 1) - pageSize}</span>
        )
      }
    },
    {
      key: 'positionCode',
      title: '库位编码',
      dataIndex: 'positionCode',
    },
    {
      key: 'positionName',
      title: '库位名称',
      dataIndex: 'positionName',
    },
    genEllipsisColumn('skuNo', 'SKU 编码', 28, { width: 140 }),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    {
      key: 'houseareaName',
      title: '所属库区',
      dataIndex: 'houseareaName',
    },
    {
      key: 'warehouseName',
      title: '所属仓库',
      dataIndex: 'warehouseName',
    },
    {
      key: 'operatorName',
      title: '操作人',
      dataIndex: 'operatorName',
    },
    {
      key: 'operateTime',
      title: '操作时间',
      dataIndex: 'operateTime',
      width: 108,
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
  ]

  _handlePageChange = (pagination) => {
    // console.log('params', pagination, filters, sorter)
    const { libraryFilter, dispatch, libraryList } = this.props
    const { current, pageSize } = pagination
    dispatch(getLibraryList({ ...libraryFilter, currentPage: libraryList.pageSize !== pageSize ? 1 : current, pageSize }))
  }

  _handleSearch = (values) => {
    const { libraryFilter, dispatch, orgCode, orgLevel } = this.props
    const reqBean = {
      ...values,
      currentPage: libraryFilter.currentPage,
      pageSize: libraryFilter.pageSize
    }
    if (orgLevel === '2') {
      reqBean.warehouseNo = orgCode
    }
    dispatch(getLibraryList(reqBean))
  }

  getLibraryGoodsList = (libraryBitDetail) => {
    const { dispatch, listByWarehouseData, orgCode, orgName, libraryFilter } = this.props

    let libraryGoodsList = []
    if (libraryBitDetail) {
      dispatch(libraryGoodsListReq({ warehouseNo: orgCode, houseareaNo: libraryBitDetail.houseareaNo })).then(res => {
        showModalWrapper((
          <AddModalContent
            dispatch={dispatch}
            listFilter={libraryFilter}
            warehouseNo={orgCode}
            warehouseName={orgName}
            libraryGoodsList={res}
            reservoirAllList={listByWarehouseData}
            libraryBitDetail={libraryBitDetail}
          />
        ), {
          title: libraryBitDetail ? '编辑' : '新增',
          width: '80%',
          bodyStyle: {
            overflow: 'auto',
            width: 'calc(100% + 18px)',
            height: 650
          },
          style: {
            overflow: 'hidden',
            top: 10
          },
          maskClosable: true
        })
      })
    } else {
      showModalWrapper((
        <AddModalContent
          dispatch={dispatch}
          listFilter={libraryFilter}
          warehouseNo={orgCode}
          warehouseName={orgName}
          libraryGoodsList={libraryGoodsList}
          reservoirAllList={listByWarehouseData}
          libraryBitDetail={libraryBitDetail}
        />
      ), {
        title: libraryBitDetail ? '编辑' : '新增',
        width: 1200,
        bodyStyle: {
          overflow: 'auto',
          width: 'calc(100% + 18px)',
          height: 750
        },
        style: {
          overflow: 'hidden',
          top: 10
        },
        maskClosable: true
      })
    }
  }

  _handleAdd = (positionNo) => {
    const { dispatch } = this.props
    if (positionNo) {
      dispatch(libraryBitDetail({ positionNo })).then(res => {
        if (res) {
          this.getLibraryGoodsList(res)
        }
      })
    } else {
      this.getLibraryGoodsList()
    }
  }

  getOperateColumn = () => {
    return [{
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this._handleAdd(record.positionNo)}>编辑</a>
            <Divider type='vertical' />
            <Popconfirm
              title='确认删除该库位？'
              onConfirm={e => this._handleDelete(record.positionNo)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        )
      }
    }]
  }

  _handleWarehouseChange = (value) => {
    this.props.dispatch(listByWarehouse({ warehouseNo: value }))
  }

  _handleExport = () => {
    const { libraryFilter: filter } = this.props
    const exportBean = {
      positionCode: filter.positionCode,
      positionName: filter.positionName,
      goodsName: filter.goodsName,
      houseareaNo: filter.houseareaNo,
      warehouseNo: filter.warehouseNo,
      operatorName: filter.operatorName,
      skuNo: filter.skuNo,
    }
    const params = parmasUtil.json2url(exportBean)
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/whlib/export/v1?ticket=${ticket}&${params}`
    location.href = href
  }

  render() {
    const { libraryList, showListSpin, orgLevel, orgList, orgName, listByWarehouseData } = this.props
    const pagination = genPagination(libraryList)
    const filterSetting = {
      layout: 'inline',
      fields: [
        {
          id: 'positionCode',
          span: 8,
          props: {
            label: '库位编码'
          },
          placeHolder: '请输入库位编码'
        },
        {
          id: 'positionName',
          span: 8,
          props: {
            label: '库位名称'
          },
          placeHolder: '请输入库位名称'
        },
        {
          id: 'skuNo',
          span: 8,
          props: {
            label: 'SKU编码'
          },
          placeHolder: '请输入SKU编码'
        },
        {
          id: 'goodsName',
          span: 8,
          props: {
            label: 'SKU 名称'
          },
          placeHolder: '请输入SKU 名称'
        },
        {
          id: 'warehouseNo',
          span: 8,
          props: {
            label: '所属仓库',
          },
          placeHolder: '请选择所属仓库',
          options: {
            initialValue: orgLevel === '2' ? orgName : '',
          },
          element: (
            <Select
              allowClear
              disabled={orgLevel === '2'}
              getPopupContainer={() => document.getElementById('warehouseNo')}
              onChange={this._handleWarehouseChange}
            >
              <Option value=''>全部</Option>
              {
                orgList.map(item => (
                  <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                ))
              }
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'houseareaNo',
          span: 8,
          props: {
            label: '所属库区',
          },
          options: {
            initialValue: '',
          },
          element: (
            <Select
              allowClear
              placeholder='请选择所属库区'
              getPopupContainer={() => document.getElementById('houseareaNo')}
            >
              <Option value=''>全部</Option>
              {
                listByWarehouseData.map(item => (
                  <Option key={item.houseareaNo} value={item.houseareaNo}>{item.houseareaName}</Option>
                ))
              }
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'operatorName',
          span: 8,
          props: {
            label: '操作人',
          },
          placeHolder: '请输入操作人'
        },
      ],
      extendButtons: orgLevel && orgLevel === '2' ? [
        {
          id: 'add',
          name: ' 新增',
          props: {
            type: 'primary',
          },
          handleClick: () => this._handleAdd(),
        },
        {
          id: 'export',
          name: ' 导出',
          props: {
            type: 'primary',
          },
          handleClick: () => this._handleExport(),
        }
      ] : []
    }

    return (
      <div>
        <TableFilter filterSetting={filterSetting} handleChange={this._handleSearch} />
        <Table
          columns={orgLevel === '2' ? this._columns.concat(this.getOperateColumn()) : this._columns}
          dataSource={libraryList.data || []}
          onChange={this._handlePageChange}
          rowKey='positionNo'
          pagination={pagination}
          loading={showListSpin}
          scroll = {{ x: 1500 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    listByWarehouseData: state.supplyChain.commonSupply.listByWarehouseData,
    libraryList: state.supplyChain.libraryBit.libraryList,
    libraryFilter: state.supplyChain.libraryBit.libraryFilter,
    libraryGoodsList: state.supplyChain.libraryBit.libraryGoodsList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(LibraryBit)
