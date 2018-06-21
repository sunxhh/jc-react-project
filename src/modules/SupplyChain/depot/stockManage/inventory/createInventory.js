import React, { Component } from 'react'
import { Form, Input, Radio, Select, Button, TreeSelect } from 'antd'

import { listByWarehouse, listGoodsCatg } from '../../../reduck'
import { createInventory } from '../reduck'
import styles from './inventory.less'
import apis from '../../../apis'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  },
}

class CreateInventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      selectData: [],
      isLoading: false,
      mode: '1'
    }
  }

  _handleParams = (params) => {
    return {
      ...params,
      skuNoList: params.skuNoList ? params.skuNoList.split(/\s+/g) : [],
    }
  }

  _packagesColumns = [
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

  _handleSelect = (selectedGoods) => {
    const skuNos = this.sort(selectedGoods)
    const { onCancel, dispatch, orgCode, filter } = this.props
    onCancel()
    const reqBean = {
      warehouseNo: orgCode,
      inventoryType: '4',
      skuNos: skuNos.map(item => item.skuNo)
    }
    dispatch(createInventory(reqBean, filter))
  }

  _handleShowGoodsList = () => {
    const { goodsCateList } = this.props
    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        style: { minWidth: '80%' }
      },
      rowKey: 'skuNo',
      selectType: 'checkbox',
      fetch: fetchData,
      url: apis.depot.stock.goods,
      beforeSearch: this._handleParams,
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

  handleModeChange = (e) => {
    const { dispatch, orgCode } = this.props
    if (e.target.value === '1') {
      this.setState({
        isVisible: false,
        mode: '1'
      })
    } else if (e.target.value === '4') {
      this._handleShowGoodsList()
    } else {
      this.setState({
        isVisible: true,
        mode: e.target.value
      })
      if (e.target.value === '2') {
        dispatch(listByWarehouse({ warehouseNo: orgCode })).then(res => {
          if (res) {
            this.setState({
              selectData: res,
            })
          }
        })
      } else {
        dispatch(listGoodsCatg({ warehouseNo: orgCode })).then(res => {
          if (res) {
            this.setState({
              selectData: res,
            })
          }
        })
      }
    }
  }

  _renderModeComp = mode => {
    const { selectData } = this.state
    if (mode === '3') {
      return (
        <Select
          getPopupContainer={() => document.getElementById('selectedArea')}
        >
          {selectData.map(item => (
            <Option key={item.goodsCatgNo} value={item.goodsCatgNo}>{item.goodsCatgName}</Option>
          ))}
        </Select>
      )
    } else {
      return (
        <Select
          getPopupContainer={() => document.getElementById('selectedArea')}
        >
          {selectData.map(item => (
            <Option key={item.houseareaNo} value={item.houseareaNo}>{item.houseareaName}</Option>
          ))}
        </Select>
      )
    }
  }

  _handleAdd = () => {
    const { orgCode, dispatch, filter } = this.props
    const { mode } = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const reqBean = {
          warehouseNo: orgCode,
          inventoryType: mode
        }
        if (mode === '2') {
          reqBean.houseareaNo = values.houseareaNo
        } else if (mode === '3') {
          reqBean.goodsCatgNo = values.goodsCatgNo
        }
        this.setState({
          isLoading: true
        })
        dispatch(createInventory(reqBean, filter)).then(res => {
          res && this.props.onCancel && this.props.onCancel()
          this.setState({
            isLoading: false
          })
        })
      }
    })
  }

  render() {
    const { orgName } = this.props
    const { getFieldDecorator } = this.props.form
    const { mode, isVisible } = this.state
    const modeKey = mode === '2' ? 'houseareaNo' : 'goodsCatgNo'
    return (
      <Form>
        <FormItem
          label='库存部门'
          {...formItemLayout}
        >
          {getFieldDecorator('orgCode', {
            initialValue: orgName
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('mode', {
            initialValue: '1'
          })(
            <Radio.Group onChange={this.handleModeChange}>
              <Radio.Button value='1'>按仓库</Radio.Button>
              <Radio.Button value='2'>按库区</Radio.Button>
              <Radio.Button value='3'>按二级分类</Radio.Button>
              <Radio.Button value='4'>按单品</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        <div
          id='selectedArea'
          style={{ position: 'relative' }}
        >
          {isVisible && (
            <FormItem
              label={mode === '2' ? '所属库区' : '二级分类'}
              {...formItemLayout}
            >
              {getFieldDecorator(modeKey, {
                rules: [{
                  required: true,
                  message: '请选择' + (mode === '2' ? '所属库区' : '二级分类')
                }]
              })(
                this._renderModeComp(mode)
              )}
            </FormItem>
          )}
        </div>
        <div className={styles['btn-style']}>
          <Button
            onClick={this.props.onCancel}
          >取消
          </Button>
          <Button
            type='primary'
            onClick={(e) => {
              this._handleAdd(e)
            }}
            loading={this.state.isLoading}
          >保存
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(CreateInventory)
