/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/2
 * Time: 上午9:55
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, Button, Table, TreeSelect } from 'antd'
import { queryOrgByLevel } from 'Global/action'
import styles from './index.less'
import * as actions from './reduck'
import storage from '../../../utils/storage'
import ParamsUtil from '../../../utils/params'
import { isEmpty } from '../../../utils/lang'
import { genEllipsisColumn } from 'Utils/helper'
import { supplyChainUrl } from '../../../config'

const TreeNode = TreeSelect.TreeNode

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ReportCost extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel } = this.props
    dispatch(actions.getGoodsTypeList({
      codeKeys: ['goodsType']
    }))
    dispatch(actions.getGoodsCatg({
      parentNo: '',
      status: 1
    }))
    this._getOrderList(1, 10)
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
  }
  // 获取列表数据的公用方法
  _getOrderList = (currentPage, pageSize) => {
    const arg = this._getParameter(currentPage, pageSize)
    const { dispatch } = this.props
    dispatch(actions.getReportList(arg))
  }

  // 获取所有搜索参数
  _getParameter = (currentPage = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      skuNo: arg.skuNo ? arg.skuNo : '',
      goodsName: arg.goodsName ? arg.goodsName : '',
      goodsCatgNo: arg.goodsCatgNo ? arg.goodsCatgNo : '',
      goodsType: arg.goodsType ? arg.goodsType : '',
      warehouseNo: arg.warehouseNo ? arg.warehouseNo : '',
      currentPage: currentPage,
      pageSize: pageSize
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this._getOrderList(page.pageSize !== pageSize ? 1 : current, pageSize)
  }

  // 搜索
  _search = () => {
    this._getOrderList(1)
  }

  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      fixed: 'left',
      width: 60,
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
    genEllipsisColumn('skuNo', 'SKU编码', 13, { width: 140 }),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    {
      title: '所属分类',
      dataIndex: 'goodsCatgName',
      key: 'goodsCatgName'
    },
    {
      title: '货物类型',
      dataIndex: 'goodsType',
      key: 'goodsType',
      render: (text, record) => {
        return (
          <span>
            {
              this.props.goodsTypeList && this.props.goodsTypeList.map(item => {
                if (item.value === text) {
                  return item.name
                }
              })
            }
          </span>

        )
      }
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit',
      key: 'goodsUnit'
    },
    {
      title: '仓库部门',
      dataIndex: 'warehouseName',
      key: 'warehouseName'
    },

    {
      title: '库存数量',
      dataIndex: 'stockCount',
      key: 'stockCount',
      render: text => text.toFixed(2)
    },
    {
      title: '库存金额（元）',
      dataIndex: 'stockAmount',
      key: 'stockAmount',
    },
    {
      title: '加权成本（元）',
      dataIndex: 'weight',
      key: 'weight',
      render: text => text.toFixed(2)
    }
  ]

  // 导出
  _handleExport = () => {
    let ticket = storage.get('userInfo') && storage.get('userInfo').ticket
    const arg = this.props.form.getFieldsValue()
    const reqBody = {
      skuNo: arg.skuNo || '',
      goodsName: arg.goodsName || '',
      goodsCatgNo: arg.goodsCatgNo || '',
      goodsType: arg.goodsType || '',
      warehouseNo: arg.warehouseNo || '',
      ticket: ticket
    }
    const state = ParamsUtil.json2url(reqBody)
    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/report/skuweight/exportReportSkuWeightList/v1?${state}`
    window.open(href)
  }
  // 过滤
  _filterType = (inputValue, childGoodsCatgList) => {
    return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      orderList,
      page,
      showListSpin,
      goodsTypeList,
      orgLevel,
      orgList,
      orgCode,
      orgName,
      getGoodsCatg,
      auths,
      match
    } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <div className={styles['search-container']}>
          <Form
            id='filter-form'
          >
            <Row className='search-form'>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='SKU编码'
                >
                  {getFieldDecorator('skuNo')(
                    <Input
                      placeholder='请输入SKU编码'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='SKU名称'
                >
                  {getFieldDecorator('goodsName')(
                    <Input
                      placeholder='请输入SKU名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='goodsCatgNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='所属分类'
                >
                  {getFieldDecorator('goodsCatgNo')(
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder='请选择所属分类'
                      allowClear
                      treeDefaultExpandAll
                      treeNodeFilterProp='children'
                      filterTreeNode={this._filterType}
                      getPopupContainer={() => document.getElementById('goodsCatgNo')}
                    >
                      {
                        getGoodsCatg && getGoodsCatg.map(item => {
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
                              <TreeNode value={item.goodsCatgNo} title={item.goodsCatgName} key={item.goodsCatgNo} />
                            )
                          }
                        })
                      }
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='goodsType'
              >
                <FormItem
                  {...formItemLayout}
                  label='货物类型'
                >
                  {getFieldDecorator('goodsType', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择货物类型'
                      getPopupContainer={() => document.getElementById('goodsType')}
                    >
                      <Option value=''>全部</Option>
                      {
                        goodsTypeList && goodsTypeList.map((key) => {
                          return (
                            <Option
                              key={key.value}
                              value={key.value}
                            >
                              {key.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='warehouseName'
              >
                <FormItem
                  {...formItemLayout}
                  label='仓库部门'
                >
                  {getFieldDecorator('warehouseNo', {
                    initialValue: orgLevel === '2' ? orgCode : ''
                  })(
                    <Select
                      showSearch={true}
                      allowClear
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      placeholder='请选择仓库部门'
                      getPopupContainer={() => document.getElementById('warehouseName')}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <option value=''>全部</option>
                      {
                        orgLevel && orgLevel === '2' ? (<Option value={orgCode} key={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                            )
                          }))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button
                  type='primary'
                  className={styles['queryBtn']}
                  onClick={this._search}
                >查询
                </Button>
                {
                  btnRole.includes('export') &&
                  <Button
                    type='primary'
                    onClick={this._handleExport}
                  >
                    导出
                  </Button>
                }
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles['tabs']}>
          <Table
            columns={this._columns}
            dataSource={orderList}
            rowKey=''
            locale={{
              emptyText: '暂无数据'
            }}
            loading={showListSpin}
            onChange={this._handlePageChange}
            scroll={{ x: 1200 }}
            pagination={{
              total: parseInt(page.records),
              pageSize: parseInt(page.pageSize),
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${page.records} 项`,
              pageSizeOptions: ['5', '10', '20', '50'],
              current: parseInt(page.currentPage),
            }
            }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orderList: state.supplyChain.reportCost.reportList,
    goodsTypeList: state.supplyChain.reportCost.goodsTypeList,
    getGoodsCatg: state.supplyChain.reportCost.getGoodsCatg,
    page: state.supplyChain.reportCost.page,
    showListSpin: state.common.showListSpin,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReportCost))

