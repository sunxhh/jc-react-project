import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Card, Row, Col, Select, DatePicker, Table, InputNumber, Popconfirm, message, TreeSelect } from 'antd'
import moment from 'moment'

import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'

import { getCodeList, getProviderDetail, getContractDetail, contractModify, getProviderList } from './reduck'
import apis from '../../apis'
import { getGoodsCateList } from '../../reduck'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const TextArea = Input.TextArea

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        contractNo: this.props.match.params.id,
        detail: '2'
      },
      selectedList: [],
      startValue: null,
      endValue: null,
      endOpen: false,
      contractSkuGoodsReqs: []
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getProviderList())
    dispatch(getContractDetail(this.state.reqBean)).then(res => {
      if (res.code === 0) {
        this.props.dispatch(getProviderDetail({ supplierNo: res.data.supplierNo }))
        this.setState({
          selectedList: res.data.pagerVo.data,
          contractSkuGoodsReqs: res.data.pagerVo.data
        })
      }
    })
    dispatch(getCodeList({ 'codeKeys': ['goodsType'] }))
    dispatch(getGoodsCateList({ parentNo: '', status: '1' }))
  }

  _filterType = (inputValue, childGoodsCatgList) => {
    return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  _packagesColumns = [
    {
      key: 'goodsNo',
      title: '货物编码',
      dataIndex: 'goodsNo',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsName',
      title: '货物名称',
      dataIndex: 'goodsName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'specName',
      title: '规格',
      dataIndex: 'specName',
      render: (text, record, index) => {
        const skuSpecs = record.skuSpecs
        const length = record.skuSpecs.length
        return skuSpecs.map((item, index) => {
          if (index === length - 1) {
            return <span key={index}>{item.specName}</span>
          } else {
            return <span key={index}>{item.specName} / </span>
          }
        })
      }
    },
    {
      key: 'goodsCatgName',
      title: '货物分类',
      dataIndex: 'goodsCatgName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsTypeName',
      title: '货物类型',
      dataIndex: 'goodsTypeName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    }
  ]

  sort = (arr) => {
    for (let j = 0; j < arr.length - 1; j++) {
      for (let i = 0; i < arr.length - 1 - j; i++) {
        if (arr[i].index > arr[i + 1].index) {
          let temp = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = temp
        }
      }
    }
    return arr
  }

  _handleSelect= (selectedRows) => {
    const contractSkuGoodsReqs = []
    const skuNos = this.sort(selectedRows)
    const finalData = skuNos.concat(this.state.selectedList)
    finalData.forEach((item, index) => {
      const isTrue = this.state.contractSkuGoodsReqs.some((e, i) => {
        return item.skuNo === e.skuNo
      })
      if (!isTrue) {
        contractSkuGoodsReqs.push({
          ...item,
          supplierRate: this.props.provideDetail.supplierRate,
          purchasePrice: ''
        })
      }
    })
    this.state.contractSkuGoodsReqs.forEach((item, index) => {
      const isTrue = finalData.some((e, i) => {
        return item.skuNo === e.skuNo
      })
      if (!isTrue) {
        this.state.contractSkuGoodsReqs.splice(index, 1)
      }
    })
    this.setState({
      selectedList: finalData,
      contractSkuGoodsReqs: [...contractSkuGoodsReqs, ...this.state.contractSkuGoodsReqs]
    })
  }

  _handleParams = (params) => {
    return {
      ...params,
      goodsNoList: params.goodsNoList ? params.goodsNoList.split(/\s+/g) : [],
      skuNoList: params.skuNoList ? params.skuNoList.split(/\s+/g) : [],
    }
  }

  _handleAddClick = () => {
    const { goodsCateList } = this.props
    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        style: { minWidth: '80%' }
      },
      rowKey: 'skuNo',
      selectType: 'checkbox',
      fetch: fetchData,
      url: apis.purchase.contract.listForChoose,
      instantSelected: false,
      disabledSelectedList: true,
      selectedTagFieldName: 'skuNo',
      beforeSearch: this._handleParams,
      extraParams: {
        useAt: '',
        expectSkuNoList: this.state.contractSkuGoodsReqs ? this.state.contractSkuGoodsReqs.map(item => item.skuNo) : []
      },
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false,
      },
      listFieldName: 'data',
      // selectedList: this.state.contractSkuGoodsReqs,
      onSelect: selectedRows => this._handleSelect(selectedRows),
      // selectedList: form.getFieldValue('comboList'),
      columns: this._packagesColumns,
      showOrderFlag: true,
      filter: [{
        id: 'goodsNoList',
        props: {
          label: '货物编码：'
        },
        element: (
          <TextArea
            placeholder='请输入货物编码'
            maxLength={500}
          />
        )
      }, {
        id: 'skuNoList',
        props: {
          label: 'SKU编码：'
        },
        element: (
          <TextArea
            placeholder='请输入SKU编码'
            maxLength={500}
          />
        )
      }, {
        id: 'goodsCatgNo',
        props: {
          label: '货物分类：'
        },
        element: (
          <TreeSelect
            dropdownStyle={{ height: 400, overflow: 'auto' }}
            style={{ width: 200 }}
            placeholder='请选择货物分类'
            allowClear
            treeDefaultExpandAll
            showSearch={true}
            filterTreeNode={this._filterType}
          >
            {
              goodsCateList && goodsCateList.map(item => {
                if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                  return (
                    <TreeNode
                      value={item.goodsCatgNo}
                      title={item.goodsCatgName}
                      key={item.goodsCatgNo}
                    >
                      {
                        item.childGoodsCatgList.map(i => {
                          if (i.childGoodsCatgList && !isEmpty(i.childGoodsCatgList)) {
                            return (
                              <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo}>
                                {
                                  i.childGoodsCatgList.map(ele => {
                                    return (
                                      <TreeNode value={ele.goodsCatgNo} title={ele.goodsCatgName} key={ele.goodsCatgNo} />
                                    )
                                  })
                                }
                              </TreeNode>
                            )
                          } else {
                            return (
                              <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo} />
                            )
                          }
                        })
                      }
                    </TreeNode>
                  )
                } else {
                  return (
                    <TreeNode
                      value={item.goodsCatgNo}
                      disabled={true}
                      title={item.goodsCatgName}
                      key={item.goodsCatgNo}
                    />
                  )
                }
              })
            }
          </TreeSelect>
        )
      }, {
        id: 'goodsName',
        props: {
          label: '货物名称：'
        },
        element: (
          <Input style={{ width: '181px' }} placeholder='请输入货物名称' />
        )
      }]
    })
  }

  onChangeRate = (e, record) => {
    // const contractSkuGoods = []
    const contractSkuGoods = this.state.contractSkuGoodsReqs
    if (isEmpty(contractSkuGoods)) {
      contractSkuGoods.push({
        skuNo: record.skuNo,
        supplierRate: e,
        purchasePrice: ''
      })
    }
    const isTrue = contractSkuGoods.some(item => {
      return item.skuNo === record.skuNo
    })
    if (isTrue) {
      contractSkuGoods.map(item => {
        if (item.skuNo === record.skuNo) {
          item.supplierRate = e
          item.purchasePrice = item.purchasePrice
        }
      })
    } else {
      contractSkuGoods.push({
        skuNo: record.skuNo,
        supplierRate: e,
        purchasePrice: ''
      })
    }
    this.setState({
      contractSkuGoodsReqs: contractSkuGoods
    })
  }

  onChangePrice = (e, record) => {
    const contractSkuGoods = this.state.contractSkuGoodsReqs
    if (isEmpty(contractSkuGoods)) {
      contractSkuGoods.push({
        skuNo: record.skuNo,
        purchasePrice: e,
        supplierRate: ''
      })
    }
    const isTrue = contractSkuGoods.some(item => {
      return item.skuNo === record.skuNo
    })
    if (isTrue) {
      contractSkuGoods.map(item => {
        if (item.skuNo === record.skuNo) {
          item.purchasePrice = e
          item.supplierRate = item.supplierRate
        }
      })
    } else {
      contractSkuGoods.push({
        skuNo: record.skuNo,
        purchasePrice: e,
        supplierRate: ''
      })
    }
    this.setState({
      contractSkuGoodsReqs: contractSkuGoods
    })
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        return (
          <span>{index + 1}</span>
        )
      }
    },
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
    },
    {
      key: 'skuGoodsName',
      title: 'SKU名称',
      dataIndex: 'skuGoodsName',
    },
    {
      key: 'goodsCatgName',
      title: '货物分类',
      dataIndex: 'goodsCatgName',
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
    },
    {
      key: 'supplierRate',
      title: '税率（%）',
      dataIndex: 'supplierRate',
      render: (text, record, index) => {
        // const { provideDetail } = this.props
        return (
          <span>
            <InputNumber
              min={0}
              max={100}
              precision={2}
              value={text}
              onChange={(e) => this.onChangeRate(e, record)}
            />
          </span>
        )
      }
    },
    {
      key: 'purchasePrice',
      title: '采购价（元）',
      dataIndex: 'purchasePrice',
      render: (text, record, index) => {
        return (
          <span>
            <InputNumber
              precision={2}
              min={0.01}
              max={9999999999999.99}
              value={text}
              onChange={(e) => this.onChangePrice(e, record)}
            />
          </span>
        )
      }
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return (
          <a size='small'>
            <span>
              <Popconfirm
                title='确定要删除吗?' onConfirm={() => this._handleDelete(record.skuNo)} okText='确定'
                cancelText='取消'
              >
                删除
              </Popconfirm>
            </span>
          </a>
        )
      }
    }
  ]

  _handleDelete = (skuNo) => {
    const contractSkuGoods = this.state.contractSkuGoodsReqs
    const skuNoIndex = contractSkuGoods.findIndex((item, index) => {
      return item.skuNo === skuNo
    })
    contractSkuGoods.splice(skuNoIndex, 1)
    this.setState({
      contractSkuGoodsReqs: contractSkuGoods
    })
  }

  disabledStartDate = (startValue) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let currDate = moment(startValue).format('YYYY-MM-DD')
    return startValue && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    let startTime = new Date(startValue).getFullYear() + '-' + (new Date(startValue).getMonth() + 1) + '-' + (new Date(startValue).getDate() + 1)
    let endTime = moment(endValue).format('YYYY-MM-DD')
    if (!endValue || !startValue) {
      return false
    }
    return new Date(endTime).valueOf() <= new Date(startTime).valueOf()
  }

  _timeChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  onStartChange = (value) => {
    this._timeChange('startValue', value)
  }

  onEndChange = (value) => {
    this._timeChange('endValue', value)
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  // 新增提交

  _handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { contractSkuGoodsReqs } = this.state
        const { initGoodsList } = this.props
        const finalReqs = []
        initGoodsList.forEach((item, index) => {
          const isExist = contractSkuGoodsReqs.some(i => {
            return item.skuNo === i.skuNo
          })
          if (isExist) {
            const skuNoIndex = contractSkuGoodsReqs.findIndex((i, index) => {
              return item.skuNo === i.skuNo
            })
            if (contractSkuGoodsReqs[skuNoIndex].purchasePrice === item.purchasePrice && contractSkuGoodsReqs[skuNoIndex].supplierRate === item.supplierRate) {
              console.log('没有做修改')
            } else {
              finalReqs.push({
                skuNo: item.skuNo,
                supplierRate: contractSkuGoodsReqs[skuNoIndex].supplierRate ? contractSkuGoodsReqs[skuNoIndex].supplierRate.toString() : 0,
                purchasePrice: contractSkuGoodsReqs[skuNoIndex].purchasePrice ? contractSkuGoodsReqs[skuNoIndex].purchasePrice.toString() : '',
                event: 'ADD' //
              })
            }
          } else {
            finalReqs.push({
              skuNo: item.skuNo,
              supplierRate: item.supplierRate,
              purchasePrice: item.purchasePrice,
              event: 'DEL'
            })
          }
        })
        contractSkuGoodsReqs.forEach((item, index) => {
          const isExist = initGoodsList.some(i => {
            return item.skuNo === i.skuNo
          })
          if (!isExist) {
            if (item.supplierRate === this.props.provideDetail.supplierRate && item.purchasePrice === '') {
              finalReqs.push({
                skuNo: item.skuNo,
                supplierRate: item.supplierRate,
                purchasePrice: item.purchasePrice,
                event: 'ADD'
              })
            } else {
              finalReqs.push({
                skuNo: item.skuNo,
                supplierRate: item.supplierRate,
                purchasePrice: item.purchasePrice,
                event: 'ADD' //
              })
            }
          }
        })
        const addData = {
          contractNo: this.props.match.params.id,
          startTime: values.startTime && !isEmpty(values.startTime) ? values.startTime.format('YYYY-MM-DD') : '',
          endTime: values.endTime && !isEmpty(values.endTime) ? values.endTime.format('YYYY-MM-DD') : '',
          accountPeriod: values.accountPeriod,
          defectiveRate: values.defectiveRate,
          arrivalRate: values.arrivalRate,
          remark: values.remark,
        }
        if (!isEmpty(finalReqs)) {
          const isTrue = finalReqs.some(item => {
            return item.purchasePrice === ''
          })
          if (isTrue) {
            message.warning('采购价不能为空')
            return
          }
          addData.contractSkuGoodsReqs = finalReqs
        }
        this.props.dispatch(contractModify(addData))
      }
    })
  }

  render () {
    const { getFieldDecorator, showButtonSpin } = this.props.form
    const { providerList, contractDetail } = this.props
    const { endOpen } = this.state
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              loading={showButtonSpin}
              // disabled={editDisabled}
              htmlType='submit'
            >
              保存
            </Button>
            <Button
              title='点击取消'
              onClick={() => history.go(-1)}
            >
              取消
            </Button>
          </FormItem>
          <Card title='基础信息'>
            <Row>
              <Col>
                <Row
                  id='rowUser'
                  justify='start'
                  type='flex'
                >
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='合同编码：'
                    >
                      {getFieldDecorator('contractNo', {
                        initialValue: this.props.match.params.id && this.props.match.params.id
                      })(
                        <Input disabled={true} placeholder='请输入合同编码' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商名称：'
                    >
                      <div
                        id='supplierNo'
                        style={{ position: 'relative', marginBottom: '6px' }}
                      >
                        {getFieldDecorator('supplierNo', {
                          rules: [{
                            required: true,
                            message: '请输入供应商名称',
                          }],
                          initialValue: contractDetail && contractDetail.supplierNo
                        })(
                          <Select
                            disabled={true}
                            onChange={this._supplierNoChange}
                            placeholder='请选择供应商名称'
                            getPopupContainer={() => document.getElementById('supplierNo')}
                          >
                            {
                              providerList && providerList.map(item => (
                                <Option value={item.supplierNo} key={item.supplierNo}>{item.supplierName}</Option>
                              ))
                            }
                          </Select>
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='开始时间'
                    >
                      <div
                        id='startTime'
                        style={{ position: 'relative' }}
                      >
                        {getFieldDecorator('startTime', {
                          rules: [{
                            required: true,
                            message: '请选择开始时间'
                          }],
                          initialValue: contractDetail && contractDetail.startTime && moment(contractDetail.startTime)
                        })(
                          <DatePicker
                            disabled={contractDetail.edit === '2' ? Boolean(1) : Boolean(0)}
                            style={{ width: '100%' }}
                            disabledDate={this.disabledStartDate}
                            // showTime
                            format='YYYY-MM-DD'
                            placeholder='请选择开始时间'
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                            getCalendarContainer={() => document.getElementById('startTime')}
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='结束时间'
                    >
                      <div
                        id='endTime'
                        style={{ position: 'relative' }}
                      >
                        {getFieldDecorator('endTime', {
                          rules: [{
                            required: false,
                          }],
                          initialValue: contractDetail && contractDetail.endTime && moment(contractDetail.endTime)
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={this.disabledEndDate}
                            // showTime
                            format='YYYY-MM-DD'
                            placeholder='请选择结束时间'
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                            getCalendarContainer={() => document.getElementById('endTime')}
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='账期：'
                    >
                      {getFieldDecorator('accountPeriod', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.accountPeriod
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                          max={99999}
                          formatter={value => `${value}天`}
                          parser={value => value.replace('天', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='缺品率：'
                    >
                      {getFieldDecorator('defectiveRate', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.defectiveRate
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          precision={2}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='到货率：'
                    >
                      {getFieldDecorator('arrivalRate', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.arrivalRate
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          precision={2}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='备注：'
                    >
                      {getFieldDecorator('remark', {
                        initialValue: contractDetail && contractDetail.remark
                      })(
                        <TextArea
                          placeholder='请输入备注'
                          maxLength={500}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card title='货物信息'>
            <Row>
              <div className={styles['operate-btn']}>
                <Button
                  title='添加货物'
                  type='primary'
                  onClick={this._handleAddClick}
                >
                  添加货物
                </Button>
              </div>
              <div>
                <Table
                  columns={this._columns}
                  dataSource={this.state.contractSkuGoodsReqs}
                  rowKey='id'
                  pagination={false}
                />
              </div>
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    providerList: state.purchase.contract.providerList,
    goodsType: state.purchase.contract.codeList.goodsType,
    provideDetail: state.purchase.contract.provideDetail,
    contractDetail: state.purchase.contract.contractDetail,
    list: state.purchase.contract.goodsList,
    initGoodsList: state.purchase.contract.initGoodsList,
    goodsCateList: state.purchase.commonPurc.goodsCateList,
    showButtonSpin: state.common.showButtonSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit))
