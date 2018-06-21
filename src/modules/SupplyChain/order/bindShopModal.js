import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Icon, Table, message } from 'antd'

import { isEmpty } from 'Utils/lang'
import { genPagination, genSelectColumn } from 'Utils/helper'
import { getShopInfoList } from 'Global/action'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

class BindShopModal extends Component {
  state = {
    dataSource: [],
    page: {},
    selectData: {}
  }

  _columns = [
    {
      key: 'shopNumber',
      dataIndex: 'shopNumber',
      title: '店铺Id'
    },
    {
      key: 'shopName',
      dataIndex: 'shopName',
      title: '店铺名称'
    },
    genSelectColumn('mode', '经营方式', [
      { name: '线下', value: '0' },
      { name: '线上', value: '1' },
    ]),
    genSelectColumn('selfSupport', '是否自营', [
      { name: '是', value: '0' },
      { name: '否', value: '1' },
    ]),
  ]

  componentWillMount() {
    this.shopInfoList({
      pageSize: 5,
      currentPage: 1
    })
  }

  shopInfoList = (params) => {
    getShopInfoList(
      params
    ).then(res => {
      if (res) {
        this.setState({
          dataSource: res.result,
          page: res.page
        })
      }
    })
  }

  _handleSearch = () => {
    const { form } = this.props
    const { page } = this.state
    const searchData = form.getFieldsValue()
    this.shopInfoList({
      shopNumber: searchData.shopNumber,
      shopName: searchData.shopName,
      pageSize: page.pageSize || 5,
      currentPage: 1
    })
  }

  _handleChange = (pagination) => {
    const { form } = this.props
    const searchData = form.getFieldsValue()
    const { current, pageSize } = pagination
    const finalFilter = {
      shopNumber: searchData.shopNumber,
      shopName: searchData.shopName,
      currentPage: this.state.page.pageSize !== pageSize ? 1 : current,
      pageSize
    }
    this.shopInfoList(finalFilter)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, page } = this.state
    const rowSelection = {
      type: 'radio',
      onSelect: (record) => {
        this.setState({
          selectData: record
        })
      }
    }
    return (
      <div>
        <Form>
          <Row>
            <Col span={9}>
              <FormItem
                {...formItemLayout}
                label='店铺Id'
              >
                {getFieldDecorator('shopNumber', {

                })(
                  <Input placeholder='请输入店铺Id' />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                {...formItemLayout}
                label='店铺名称'
              >
                {getFieldDecorator('shopName', {

                })(
                  <Input placeholder='请输入店铺名称' />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                <Button type='primary' onClick={this._handleSearch}><Icon type='search' />搜索</Button>
                <Button
                  type='primary'
                  onClick={() => {
                    if (!this.state.selectData || isEmpty(this.state.selectData)) {
                      message.error('请先选择一个店铺')
                      return
                    }
                    this.props.handleSelect(this.state.selectData)
                    this.props.onCancel()
                  }}
                  style={{ marginLeft: 10 }}
                >
                  保存
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        {!isEmpty(dataSource) && (
          <Table
            onChange={this._handleChange}
            rowSelection={rowSelection}
            columns={this._columns}
            dataSource={dataSource}
            pagination={genPagination({ pageNo: page.currentPage, records: page.totalCount, pageSize: page.pageSize })}
          />
        )}
      </div>
    )
  }
}

export default Form.create()(BindShopModal)
