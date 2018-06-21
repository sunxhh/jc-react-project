import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Table, Tag, message, LocaleProvider, Input } from 'antd'
import { isEmpty } from 'Utils/lang'
import { unshiftIndexColumn } from 'Utils/helper'
import styles from './ModalForm.less'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import { showModalWrapper } from './ModalWrapper'

const FormItem = Form.Item

class SelectForm extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired, // 表格列的配置描述
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // 主键

    onSelect: PropTypes.func, // 选择时的回调
    onCancel: PropTypes.func, // 关闭弹层方法
    beforeSearch: PropTypes.func, // 搜索查询前的回调返回经过处理后的请求参数

    fetch: PropTypes.func, // 后台请求方法
    url: PropTypes.string, // 数据请求地址
    filter: PropTypes.array, // 筛选条件，参考 ModalForm 的入参
    extraParams: PropTypes.object, // 额外的请求参数
    initDataSource: PropTypes.array, // 外部数据源与onlySelectFlag配合使用
    onlySelectFlag: PropTypes.bool, // onlySelectFlag 则仅仅可以选择不做查询翻页等功能
    showSelectedTagFlag: PropTypes.bool, // 是否显示选中标签
    selectedList: PropTypes.array, // 选中回显集合

    pagination: PropTypes.object, // 自定义分页
    showOrderFlag: PropTypes.bool, // 是否显示 Table 序号
    empty: PropTypes.func, // 没有数据是表格展示内容

    selectType: PropTypes.string, // 选择框类型 radio/checkbox
    instantSelected: PropTypes.bool, // 选中后立即返回，还是附加确定按钮

    selectedTagFieldName: PropTypes.string, // 选中标签展示所需字段
    currentPageFieldName: PropTypes.string, // 请求时页码的值，结合筛选条件向后台发起请求,同时后端返回的字段值
    listFieldName: PropTypes.string, // 后端返回的列表数组的字段名 (res.data.result) default：result
    pageFieldName: PropTypes.string, // 后端返回的翻页的字段名 (res.data.page) default：page
    totalFieldName: PropTypes.string, // 后端返回的总条数的字段名 (res.data.page.totalCount) default:totalCount
    disabledSelectedList: PropTypes.bool, // 是否置灰已选择的数据
  }

  static defaultProps = {
    filter: [],
    currentPageFieldName: 'currentPage', // 后台普遍会定义为currentPage，如果有变化传入props
    extraParams: {},
    instantSelected: true,
    rowKey: 'id',
    selectType: 'radio',
    listFieldName: 'result',
    pageFieldName: 'page',
    totalFieldName: 'totalCount',
    showOrderFlag: false,
    onlySelectFlag: false,
    selectedTagFieldName: 'name',
    selectedList: [],
    showSelectedTagFlag: false,
    onSelect: () => {},
    disabledSelectedList: false,
  }

  constructor(props) {
    super(props)

    // 是否显示序号
    const finalColumns = props.columns
    let selectedRows = []
    let selectedIds = []
    let selectedList = []
    // 回显选中效果
    if (!isEmpty(props.selectedList)) {
      selectedList = JSON.parse(JSON.stringify(props.selectedList))
      selectedRows = selectedList
      selectedIds = selectedList.map((data) => {
        return data[props.rowKey]
      })
    }

    this.state = {
      selectedIds,
      selectedRows,
      loading: false,
      dataSource: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: total => `共 ${total} 条`,
        ...props.pagination
      },
      columns: finalColumns,
      params: {
        ...props.extraParams,
        [props.currentPageFieldName]: 1,
        pageSize: 10
      }
    }
  }

  componentWillMount() {
    const { onlySelectFlag } = this.props
    if (!onlySelectFlag) {
      this._handleSearch()
    }
  }

  // 获取表格的rowSelection
  _getRowSelection = () => {
    const { selectType, disabledSelectedList, selectedList } = this.props
    const { selectedIds } = this.state
    const exSelection = !disabledSelectedList ? {} : {
      getCheckboxProps: (record) => ({
        disabled: selectedList.some(item => this._getItemIdByRowKey(item) === this._getItemIdByRowKey(record))
      })
    }
    return {
      ...exSelection,
      selectedRowKeys: selectedIds,
      type: selectType,
      onSelect: this._onSelect,
      onSelectAll: this._onSelectAll,
    }
  }

  // 发起列表查询
  _handleSearch = () => {
    const { fetch, url, currentPageFieldName, listFieldName, pageFieldName, totalFieldName, beforeSearch } = this.props
    let { params, pagination } = this.state
    this.setState({ loading: true })
    if (typeof beforeSearch === 'function') {
      params = beforeSearch(params)
    }
    fetch(url, params).then(res => {
      if (res.code === 0) {
        let pageData = res.data[pageFieldName]
        let data = res.data[listFieldName]
        let noPageData = isEmpty(pageData)
        let newPagenation = {
          current: noPageData ? res.data['pageNo'] : pageData[currentPageFieldName],
          total: noPageData ? res.data['records'] : pageData[totalFieldName],
          pageSize: noPageData ? res.data['pageSize'] : pageData['pageSize'],
        }
        this.setState({
          loading: false,
          dataSource: data,
          pagination: {
            showSizeChanger: pagination.showSizeChanger,
            showQuickJumper: pagination.showQuickJumper,
            pageSizeOptions: pagination.pageSizeOptions,
            showTotal: pagination.showTotal,
            current: newPagenation.current,
            total: newPagenation.total,
            pageSize: newPagenation.pageSize,
          }
        })
      } else {
        message.error(res.errmsg)
        this.setState({ loading: false })
      }
    })
  }

  // 翻页处理
  _handleTableChange = (page) => {
    const { currentPageFieldName, form } = this.props
    const { params } = this.state
    this.setState({
      params: {
        ...params,
        ...form.getFieldsValue(),
        [currentPageFieldName]: page.current,
        pageSize: page.pageSize
      }
    }, this._handleSearch)
  }

  // 查询点击
  _handleSearchClick = () => {
    const { currentPageFieldName, form } = this.props
    const { params } = this.state
    this.setState({
      params: {
        ...params,
        ...form.getFieldsValue(),
        [currentPageFieldName]: 1,
      },
      selectedRows: [],
      selectedIds: [],
      selectedList: [],
    }, this._handleSearch)
  }

  // 获取行Id
  _getItemIdByRowKey = data => {
    const { rowKey } = this.props
    return typeof rowKey === 'function' ? rowKey(data) : data[rowKey]
  }

  // 更改选中状态
  _changeSelectedState = (selectedRows, callback) => {
    let selectedIds = selectedRows.map((row) => {
      // 如果rowkey为函数
      return this._getItemIdByRowKey(row)
    })
    this.setState({ selectedRows: selectedRows, selectedIds: selectedIds }, callback)
  }

  // 单选
  _onSelect = (record, selected) => {
    const { instantSelected, selectType } = this.props
    const { selectedRows } = this.state
    let finalSelectedRows = []
    if (selectType === 'radio') {
      finalSelectedRows = [record]
    } else {
      if (selected) {
        finalSelectedRows = [record, ...selectedRows]
      } else {
        finalSelectedRows = selectedRows.filter(item => {
          const itemId = this._getItemIdByRowKey(item)
          return itemId !== this._getItemIdByRowKey(record)
        })
      }
    }
    this._changeSelectedState(finalSelectedRows, () => {
      instantSelected && this._handleSelect()
    })
  }

  // 全选 只适用于复选框
  _onSelectAll = (selected, currSelectedRows, changeRows) => {
    const { selectedRows } = this.state
    let finalSelectedRows = []
    if (selected) {
      finalSelectedRows = [...currSelectedRows, ...selectedRows].filter((item, index, arr) => {
        const itemId = this._getItemIdByRowKey(item)
        return arr.findIndex(i => this._getItemIdByRowKey(i) === itemId) === index
      })
    } else {
      finalSelectedRows = selectedRows.filter(item => {
        return changeRows.findIndex(iItem => {
          return this._getItemIdByRowKey(iItem) === this._getItemIdByRowKey(item)
        }) < 0
      })
    }
    this._changeSelectedState(finalSelectedRows)
  }

  // 行选中
  _handleRow = (row, index) => {
    const { disabledSelectedList, selectedList } = this.props
    return {
      onClick: disabledSelectedList && selectedList.some(item => this._getItemIdByRowKey(item) === this._getItemIdByRowKey(row))
        ? null
        : () => { this._toggleSelect(row, index) }
    }
  }

  // 切换选中状态
  _toggleSelect = (row, index) => {
    const { selectedRows, selectedIds } = this.state
    const { rowKey, selectType, instantSelected } = this.props
    let selectId = typeof rowKey === 'function' ? rowKey(row) : row[rowKey]
    let filterIds = []
    let duplicateIndex = ''
    if (instantSelected) {
      this.setState({ selectedRows: [row], selectedIds: [selectId] }, () => {
        this._handleSelect()
      })
    } else {
      if (selectType === 'checkbox') {
        duplicateIndex = selectedRows.findIndex((item, index) => {
          let itemId = typeof rowKey === 'function' ? rowKey(item) : item[rowKey]
          return itemId === selectId
        })
        if (duplicateIndex !== -1) {
          // 之前选过了移除
          selectedRows.splice(duplicateIndex, 1)
          filterIds = selectedIds.filter((val) => {
            return val !== selectId
          })
          this.setState({ selectedRows, selectedIds: filterIds })
        } else {
          // 没有选过添加
          this.setState({ selectedRows: [...selectedRows, row], selectedIds: [...selectedIds, selectId] })
        }
      } else {
        this.setState({ selectedRows: [row], selectedIds: [selectId] })
      }
    }
  }

  // 确认操作
  _handleSelect = () => {
    const { selectedRows } = this.state
    const { onCancel, onSelect } = this.props
    if (selectedRows.length === 0) {
      message.error('请至少选中一个！')
      return
    }
    if (onSelect instanceof Promise) {
      onSelect(selectedRows).then((res) => {
        onCancel()
      })
    } else {
      onSelect(selectedRows)
      onCancel()
    }
  }

  _isDisabledRow = (data) => {
    const { selectedList, disabledSelectedList } = this.props
    if (!disabledSelectedList) {
      return false
    } else {
      return selectedList.some(item => this._getItemIdByRowKey(item) === this._getItemIdByRowKey(data))
    }
  }

  _getTags = () => {
    const { selectedTagFieldName, selectType } = this.props
    const { selectedRows } = this.state
    return selectedRows.map((data, i) => {
      return (
        <Tag
          key={new Date().getTime() + i}
          closable = {selectType === 'checkbox' && !this._isDisabledRow(data)}
          onClose = {selectType === 'checkbox' ? () => { this._toggleSelect(data, i) } : ''}
        >
          {data[selectedTagFieldName]}
        </Tag>
      )
    })
  }

  render() {
    const { filter, form, instantSelected, empty, onCancel, onlySelectFlag, initDataSource, rowKey, showSelectedTagFlag } = this.props
    const { loading, dataSource, pagination, columns, selectedRows } = this.state
    let finalColumn = columns
    if (this.props.showOrderFlag && columns[0]['key'] !== 'key') {
      finalColumn = unshiftIndexColumn(columns, { pageSize: pagination.pageSize, pageNo: pagination.current })
    }
    return (
      <LocaleProvider locale={zhCN}>
        <div>
          <Form
            className={styles['jc-modal-form']}
            layout='inline'
          >
            {
              !onlySelectFlag && !isEmpty(filter) &&
              <Row id='modalRow'>
                <Col span={24}>
                  {
                    filter.map(filterItem => (
                      <FormItem
                        key={filterItem.id}
                        {...filterItem.props}
                        className={styles['modal-form-item']}
                      >
                        {form.getFieldDecorator(filterItem.id, filterItem.options)(
                          filterItem.element || <Input />
                        )}
                      </FormItem>
                    ))
                  }
                  <FormItem>
                    <Button
                      type='primary'
                      onClick={this._handleSearchClick}
                      icon='search'
                      style={{ marginBottom: '20px' }}
                    >查询</Button>
                  </FormItem>
                </Col>
              </Row>
            }
          </Form>
          {
            !isEmpty(selectedRows) && showSelectedTagFlag &&
            <Row className={styles['modal-selected']}>
              {this._getTags()}
            </Row>
          }
          {
            ((!onlySelectFlag && isEmpty(dataSource)) || (onlySelectFlag && isEmpty(initDataSource))) && empty
              ? <div className={styles['modal-table-no-data']}>{ empty() }</div>
              : <Table
                bordered={true}
                columns={finalColumn}
                loading={loading}
                rowKey={rowKey}
                dataSource={onlySelectFlag ? initDataSource : dataSource}
                onChange={this._handleTableChange}
                onRow={this._handleRow}
                rowSelection={this._getRowSelection()}
                scroll={{
                  x: columns.length > 8 ? 820 : 0
                }}
                pagination={onlySelectFlag ? false : pagination}
                style={onlySelectFlag ? { marginBottom: '16px' } : {}}
              />
          }

          <div className={styles['jc-modal-form']}>
            <div className={styles['jc-modal-form-footer']}>
              <Button onClick={onCancel}>取消</Button>
              {
                !instantSelected &&
                <Button type='primary' onClick={this._handleSelect}>确定</Button>
              }
            </div>
          </div>
        </div>
      </LocaleProvider>
    )
  }
}

const showModalSelectForm = (params = {}) => {
  const {
    // Modal 容器的属性
    modalParam, // 弹出框的属性，参考 Modal 组件

    ...restParams // SelectForm 属性
  } = params

  const SelectFormCompnent = Form.create()(SelectForm)

  showModalWrapper(
    <SelectFormCompnent {...restParams} />,
    {
      title: 'title',
      style: { minWidth: '700px' },
      ...modalParam
    }
  )
}

export { showModalSelectForm }
