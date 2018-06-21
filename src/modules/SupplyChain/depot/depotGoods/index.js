import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Select, Form, Row, Col, Popconfirm, TreeSelect, message, Divider } from 'antd'
import { getDepotGoodsList, handleDelete, depotGoodsAdd, handlePrint, getPrintIp } from './reduck'
import { Link } from 'react-router-dom'
import { showModalSelectForm } from '../../../../components/modal/ModalSelectForm'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { codeList } from '../../reduck'
import { getGoodsCateList } from '../../depot/qualityWatch/reduck'
import { queryOrgByLevel } from 'Global/action'
import { isEmpty } from '../../../../utils/lang'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Goods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        goodsNo: '',
        skuNo: '',
        goodsName: '',
        goodsCatgNo: '',
        goodsType: '',
        warehouseNo: '',
        currentPage: 1,
        pageSize: 10
      },
      selectedList: []
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(queryOrgByLevel()).then(res => {
      if (res.myOrgLevel !== '2') {
        dispatch(getDepotGoodsList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { warehouseNo: res.myOrgCode }) }, () => {
          dispatch(getDepotGoodsList(this.state.reqBean))
        })
      }
    })
    dispatch(codeList({ 'codeKeys': ['goodsType'] }))
    // dispatch(getSelectList({ 'selectKeys': ['goodsCatg'] }))
    dispatch(getGoodsCateList({ parentNo: '', status: '1' }))
    dispatch(getPrintIp())
  }

  _print = (name, barCode) => {
    const { dispatch, printIp } = this.props
    dispatch(handlePrint(`${printIp}api/printer/barCode`, { name: name, barCode: barCode, count: 1 })).then(res => {
      if (res) {
        message.success('打印成功')
      }
    })
  }

  _genFilterFields = () => {
    const { orgLevel } = this.props
    const _columns = [
      {
        key: 'rowNo',
        title: '序号',
        width: 60,
        dataIndex: 'rowNo',
        render: (text, record, index) => {
          const { pageSize, pageNo } = this.props.page
          return (
            <span>{pageSize * pageNo + (index + 1) - pageSize}</span>
          )
        }
      },
      {
        key: 'goodsNo',
        title: '货物编码',
        dataIndex: 'goodsNo',
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <span>
              {
                btnRole.includes('check') ? (
                  <Link
                    to={`/supplyChain/depot/goods/detail/${record.goodsNo}`}
                  >{text}
                  </Link>
                ) : (
                  { text }
                )
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
        title: '货物名称',
        dataIndex: 'goodsName',
      },
      {
        key: 'specName',
        title: '规格',
        dataIndex: 'specName',
        render: (text, record, index) => {
          const length = record.goodsSpecList && record.goodsSpecList.length
          return record.goodsSpecList && record.goodsSpecList.map((item, index) => {
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
      },
      {
        key: 'goodsType',
        title: '货物类型',
        dataIndex: 'goodsType',
      },
      {
        key: 'goodsUnit',
        title: '库存单位',
        dataIndex: 'goodsUnit',
      },
      {
        key: 'warehouseName',
        title: '仓库部门',
        dataIndex: 'warehouseName',
      },
    ]
    if (orgLevel === '2') { // 二级机构
      _columns.push({
        key: 'operate',
        title: '操作',
        fixed: 'right',
        width: 136,
        dataIndex: 'operate',
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <span>
              {
                btnRole.includes('delete') && (
                  <Popconfirm
                    title={`确认删除该货物?`}
                    okText='确定'
                    cancelText='取消'
                    onConfirm={() => this._handleDelete(record.skuNo, record.warehouseNo)}
                  >
                    <a
                      href='javascript:void(0);'
                      title='删除'
                    >
                      删除
                    </a>
                    <Divider type='vertical' />
                  </Popconfirm>
                )
              }
              <a onClick={() => this._print(record.goodsName, record.skuNo)}>
                打印条码
              </a>
            </span>
          )
        }
      })
    }
    return _columns
  }

  _filterType = (inputValue, childGoodsCatgList) => {
    return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          goodsNo: values.goodsNo ? values.goodsNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          skuNo: values.skuNo ? values.skuNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          goodsName: values.goodsName ? values.goodsName.replace(/(^\s+)|(\s+$)/g, '') : '',
          goodsCatgNo: values.goodsCatgNo,
          goodsType: values.goodsType,
          warehouseNo: values.warehouseNo,
          currentPage: 1,
          pageSize: 10
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getDepotGoodsList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { current, pageSize } = pagination
    const { page } = this.props
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize })
    }, () => {
      this.props.dispatch(getDepotGoodsList(this.state.reqBean))
    })
  }

  _handleDelete = (skuNo, warehouseNo) => {
    const { dispatch } = this.props
    dispatch(handleDelete({ skuNo: skuNo, warehouseNo: warehouseNo })).then(res => {
      if (res) {
        dispatch(getDepotGoodsList(this.state.reqBean))
      }
    })
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
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsName',
      title: '货物名称',
      dataIndex: 'goodsName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'specName',
      title: '规格',
      dataIndex: 'specName',
      render: (text, record, index) => {
        const length = record.skuSpecs && record.skuSpecs.length
        return record.skuSpecs && record.skuSpecs.map((item, index) => {
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
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
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
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    }
  ]

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
      url: apis.common.listForChoose,
      beforeSearch: this._handleParams,
      extraParams: {
        useAt: 'CKHW',
        expectSkuNoList: this.state.selectedList ? this.state.selectedList.map(item => item.skuNo) : []
      },
      instantSelected: false,
      selectedTagFieldName: 'skuNo',
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false,
      },
      listFieldName: 'data',
      // selectedList: this.state.selectedList,
      onSelect: this._handleSelect,
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
            showSearch
            dropdownStyle={{ height: 400, overflow: 'auto' }}
            style={{ width: 200 }}
            placeholder='请选择货物分类'
            allowClear
            treeNodeFilterProp='title'
            filterTreeNode={this._filterType}
            getPopupContainer={() => document.getElementById('modalRow')}
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
          <Input placeholder='请输入货物名称' />
        )
      }]
    })
  }

  _handleSelect= (selectedRows) => {
    const { form, orgLevel, orgCode } = this.props
    const skuNoList = []
    selectedRows.map(item => {
      skuNoList.push(item.skuNo)
    })
    this.setState({
      selectedList: selectedRows
    }, () => {
      this.props.dispatch(depotGoodsAdd({ skuNoList: skuNoList })).then(res => {
        if (res) {
          form.setFieldsValue({
            goodsNo: null,
            skuNo: null,
            goodsName: null,
            goodsCatgNo: null,
            goodsType: null,
            warehouseNo: orgLevel && orgLevel === '2' ? orgCode : null
          })
          this.props.dispatch(getDepotGoodsList({ currentPage: 1, pageSize: 20, warehouseNo: orgLevel === '2' ? orgCode : '' }))
        }
      })
    })
  }

  _selectChange = (rule, value, callback) => {
    const { goodsCateList, form } = this.props
    const bool = goodsCateList && goodsCateList.some(item => { return item.goodsCatgNo === value })
    if (bool) {
      message.warning('请勿选择一级分类', 2)
      form.setFieldsValue({
        goodsCatgNo: ''
      })
    } else {
      callback()
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { auths, match, list, page, showListSpin, goodsType, orgLevel, orgList, goodsCateList, orgCode, orgName } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const _columns = this._genFilterFields()
    const pagination = genPagination(page)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物编码'
              >
                {getFieldDecorator('goodsNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入货物编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='SKU编码'
              >
                {getFieldDecorator('skuNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入SKU编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物名称'
              >
                {getFieldDecorator('goodsName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入货物名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物分类'
              >
                <div
                  id='goodsCatgNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsCatgNo', {
                    rules: [{
                      required: false,
                    }, {
                      validator: (rule, value, callback) => {
                        this._selectChange(rule, value, callback)
                      }
                    }],
                  })(
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder='请选择货物分类'
                      allowClear
                      treeNodeFilterProp='title'
                      filterTreeNode={this._filterType}
                      getPopupContainer={() => document.getElementById('goodsCatgNo')}
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
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物类型'
              >
                <div
                  id='goodsType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsType', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: ''
                  })(
                    <Select
                      allowClear={true}
                      placeholder='请选择货物类型'
                      getPopupContainer={() => document.getElementById('goodsType')}
                    >
                      <Option value=''>全部</Option>
                      {
                        goodsType && goodsType.map(item => (
                          <Option value={item.value} key={item.value}>{item.name}</Option>
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
                label='仓库部门'
              >
                <div
                  id='warehouseNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('warehouseNo', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: orgLevel === '2' ? orgCode : ''
                  })(
                    <Select
                      allowClear={true}
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      showSearch={false}
                      optionFilterProp='children'
                      placeholder='请选择仓库部门'
                      getPopupContainer={() => document.getElementById('warehouseNo')}
                    >
                      <Option key='' value=''>全部</Option>
                      {
                        orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>
                                {item.orgName}
                              </Option>
                            )
                          })
                        )
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <div className='operate-btn'>
            <Button
              type='primary'
              htmlType='submit'
            >查询
            </Button>
            {
              btnRole.includes('add') && orgLevel === '2' &&
              <Button
                disabled={orgLevel === '2' ? Boolean(0) : Boolean(1)}
                type='primary'
                title='添加货物'
                onClick={this._handleAddClick}
              >
                添加货物
              </Button>
            }
          </div>
        </Form>
        <Table
          columns={_columns}
          dataSource={list}
          onChange={this._handlePageChange}
          rowKey=''
          pagination={pagination}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgList: state.common.orgList,
    list: state.supplyChain.depotGoods.depotGoodsList,
    page: state.supplyChain.depotGoods.depotGoodsPage,
    goodsType: state.supplyChain.commonSupply.goodsType,
    goodsCatg: state.supplyChain.qualityWatch.goodsCatg,
    goodsCateList: state.supplyChain.qualityWatch.goodsCateList,
    printIp: state.supplyChain.depotGoods.printIp
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Goods))
