import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Form, Row, Col, Select, Input, Card, Table, Icon, Button } from 'antd'

import { libraryBitDetail, LIBRARY_BIT_DETAIL, LIBRARY_GOODS_LIST, libraryBitAdd, libraryBitEdit, libraryGoodsList as libraryGoodsListReq } from './reduck'
import { RESERVOIR_ALL_LIST } from '../../reduck'
import styles from './libraryBit.less'
import { isEmpty } from 'Utils/lang'
// import { connect } from 'react-redux'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class AddModalContent extends Component {
  constructor(props) {
    super(props)
    const { libraryBitDetail } = this.props

    let libraryGoodsList = this.props.libraryGoodsList
    if (libraryBitDetail && libraryBitDetail.goodLists && !isEmpty(libraryBitDetail.goodLists)) {
      libraryGoodsList = libraryGoodsList.filter(item => {
        return !libraryBitDetail.goodLists.some(e => e.skuNo === item.skuNo)
      })
    }
    this.state = {
      tableData: libraryBitDetail && libraryBitDetail.goodLists ? libraryBitDetail.goodLists : [],
      selectedTableIds: [],
      selectedWaitTableIds: [],
      selectedTableRows: [],
      selectedWaitTableRows: [],
      libraryBitDetail: this.props.libraryBitDetail || {},
      libraryGoodsList: libraryGoodsList,
      libraryGoodsListForSearch: libraryGoodsList,
      filterDropdownVisible: false,
      searchText: '',
      okLoading: false
    }
  }

  componentWillMount() {
    const { dispatch, bitId } = this.props
    if (bitId) {
      dispatch(libraryBitDetail({}))
    } else {
      dispatch(createAction(LIBRARY_BIT_DETAIL)({}))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(createAction(LIBRARY_GOODS_LIST)([]))
    dispatch(createAction(RESERVOIR_ALL_LIST)([]))
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value })
  }

  onSearch = () => {
    let { getFieldValue } = this.props.form
    let { libraryGoodsListForSearch } = this.state
    const skuSearchValue = getFieldValue('skuSearch')
    const skuSearchFilter = skuSearchValue ? skuSearchValue.replace(/(^\s+)|(\s+$)/g, '') : ''
    const skuSearch = skuSearchFilter ? skuSearchFilter.split(/\s+/g) : []

    if (isEmpty(skuSearch)) {
      this.setState({ libraryGoodsList: libraryGoodsListForSearch })
    } else {
      let filterDataArr = []
      skuSearch.forEach((item) => {
        let filterData = libraryGoodsListForSearch.filter((value) => {
          return value.skuNo.indexOf(item) !== -1
        })
        filterDataArr = [...filterDataArr, ...filterData]
      })
      this.setState({ libraryGoodsList: filterDataArr })
    }
  }

  // 待选列表复选框事件
  _onSelectWaitTable = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedWaitTableRows: selectedRows })
    this.setState({ selectedWaitTableIds: selectedRowKeys })
  }

  // 已选列表复选框事件
  _onSelectTable = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedTableRows: selectedRows })
    this.setState({ selectedTableIds: selectedRowKeys })
  }

  // 向右点击
  _handleRightClick = () => {
    const { selectedWaitTableRows, selectedWaitTableIds, tableData } = this.state
    const { libraryGoodsList, libraryGoodsListForSearch } = this.state
    if (selectedWaitTableRows.length === 0) {
      return
    }
    const filterData = libraryGoodsList.filter((value) => {
      return selectedWaitTableIds.indexOf(value.skuNo) === -1
    })

    const leaveData = libraryGoodsListForSearch.filter((value) => {
      return selectedWaitTableIds.indexOf(value.skuNo) === -1
    })

    this.setState({
      tableData: tableData.concat(selectedWaitTableRows),
      libraryGoodsList: filterData,
      libraryGoodsListForSearch: leaveData
    })

    this.setState({ selectedWaitTableIds: [] })
    this.setState({ selectedWaitTableRows: [] })
  }

  // 向左点击
  _handleLeftClick = () => {
    const { selectedTableRows, selectedTableIds, tableData } = this.state
    const { libraryGoodsList, libraryGoodsListForSearch } = this.state
    if (selectedTableRows.length === 0) {
      return
    }
    const filterData = tableData.filter((value) => {
      return selectedTableIds.indexOf(value.skuNo) === -1
    })
    this.setState({
      tableData: filterData,
      libraryGoodsList: libraryGoodsList.concat(selectedTableRows),
      libraryGoodsListForSearch: libraryGoodsListForSearch.concat(selectedTableRows),
    })
    this.setState({ selectedTableIds: [] })
    this.setState({ selectedTableRows: [] })
  }

  _handleAdd = e => {
    const { libraryBitDetail, libraryFilter } = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          okLoading: true
        })
        let reqFunc = libraryBitAdd
        const reqBean = {
          positionCode: values.positionCode,
          positionName: values.positionName,
          skuNoList: this.state.tableData.map(item => item.skuNo),
        }
        if (libraryBitDetail) {
          reqFunc = libraryBitEdit
          reqBean.positionNo = libraryBitDetail.positionNo
        } else {
          reqBean.warehouseNo = this.props.warehouseNo
          reqBean.houseareaNo = values.houseareaNo
        }
        this.props.dispatch(reqFunc(reqBean, libraryFilter)).then(res => {
          res && this.props.onCancel && this.props.onCancel()
          this.setState({
            okLoading: false
          })
        })
      }
    })
  }

  _handleChange = (value) => {
    const { dispatch, warehouseNo } = this.props
    dispatch(libraryGoodsListReq({ warehouseNo: warehouseNo, houseareaNo: value })).then(res => {
      this.setState(
        {
          libraryGoodsList: res,
          libraryGoodsListForSearch: res,
          tableData: [],
          selectedTableIds: [],
          selectedWaitTableIds: [],
          selectedTableRows: [],
          selectedWaitTableRows: []
        }
      )
    })
  }

  render() {
    const { warehouseName, reservoirAllList, form } = this.props
    const { tableData, selectedWaitTableIds, selectedTableIds, libraryBitDetail, libraryGoodsList } = this.state
    const { getFieldDecorator } = form
    const rowWaitSelection = {
      selectedRowKeys: selectedWaitTableIds,
      onChange: this._onSelectWaitTable,
    }
    const rowSelection = {
      selectedRowKeys: selectedTableIds,
      onChange: this._onSelectTable,
    }
    const columnsLeft = [
      {
        key: 'skuNo',
        title: 'SKU 编码',
        dataIndex: 'skuNo',
      },
      {
        key: 'goodsName',
        title: 'SKU 名称',
        dataIndex: 'goodsName',
      },
    ]

    const columnsRight = [
      {
        key: 'skuNo',
        title: 'SKU 编码',
        dataIndex: 'skuNo'
      },
      {
        key: 'goodsName',
        title: 'SKU 名称',
        dataIndex: 'goodsName',
      },
    ]
    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='库位编码'
            >
              {getFieldDecorator('positionCode', {
                rules: [
                  {
                    required: true,
                    message: '请填写库位编码',
                  },
                ],
                initialValue: libraryBitDetail.positionCode
              })(
                <Input
                  maxLength='15'
                  placeholder='请填写库位编码'
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='库位名称'
            >
              {getFieldDecorator('positionName', {
                rules: [
                  {
                    required: true,
                    message: '请填写库位名称',
                  },
                ],
                initialValue: libraryBitDetail.positionName
              })(
                <Input
                  maxLength='15'
                  placeholder='请填写库位名称'
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='所属仓库'
            >
              {getFieldDecorator('warehouseName', {
                rules: [
                  {
                    required: true,
                    message: '请填写所属仓库',
                  },
                ],
                initialValue: libraryBitDetail.warehouseName || warehouseName
              })(
                <Input
                  disabled={true}
                  placeholder='请填写所属仓库'
                />
              )}
            </FormItem>
          </Col>
          <Col span={12} id={'houseareaNoBg'}>
            <FormItem
              {...formItemLayout}
              label='所属库区'
            >
              {getFieldDecorator('houseareaNo', {
                rules: [
                  {
                    required: true,
                    message: '请填写所属库区',
                  },
                ],
                initialValue: libraryBitDetail.houseareaNo
              })(
                <Select
                  disabled={!isEmpty(this.props.libraryBitDetail)}
                  onChange={this._handleChange}
                  getPopupContainer={() => document.getElementById('houseareaNoBg')}
                >
                  {reservoirAllList.map(item => {
                    return (
                      <Option key={item.houseareaNo} value={item.houseareaNo}>{item.houseareaName}</Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Card title='货物信息'>
          <div>
            <Row>
              <Col span={24}>
                <Col span={11}>
                  <Card
                    type='inner'
                    title={<p>待选货物</p>}
                  >
                    <div className={styles['sku-search']}>
                      {getFieldDecorator('skuSearch', {
                        initialValue: ''
                      })(
                        <TextArea
                          className={styles['sku-search-input']}
                          placeholder='请输入SKU编码'
                          maxLength={500}
                        />
                      )}
                      <Button
                        type='primary'
                        className={styles['sku-search-button']}
                        onClick={this.onSearch}
                      >搜索
                      </Button>
                    </div>

                    <Table
                      className={styles['c-table-center']}
                      columns={columnsLeft}
                      rowKey='skuNo'
                      dataSource={libraryGoodsList}
                      rowSelection={rowWaitSelection}
                      pagination={false}
                    />
                  </Card>
                </Col>
                <Col span={2}>
                  <Icon
                    type='double-right'
                    onClick={this._handleRightClick}
                    className={styles['arrow-right']}
                  />
                  <Icon
                    type='double-left'
                    onClick={this._handleLeftClick}
                    className={styles['arrow-left']}
                  />
                </Col>
                <Col span={11}>
                  <Card
                    type='inner'
                    title={<p>已选货物</p>}
                  >
                    <Table
                      className={styles['c-table-center']}
                      columns={columnsRight}
                      rowKey='skuNo'
                      dataSource={tableData}
                      rowSelection={rowSelection}
                      pagination={false}
                    />
                  </Card>

                </Col>
              </Col>
            </Row>
          </div>
        </Card>
        <div className={styles['btn-style']}>
          <Button
            onClick={this.props.onCancel}
          >取消
          </Button>
          <Button
            type='primary'
            loading={this.state.okLoading}
            onClick={(e) => {
              this._handleAdd(e)
            }}
          >保存
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(AddModalContent)
