import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import List from './list'
import { Button, Form, Row, Col, Select } from 'antd/lib/index'
import { ORDER_CENTER_TEMPLATE_ADD } from 'Global/urls'
import { getTemplateList, getOrgList, clearFilter } from './reduck'
import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

class TemplateManager extends Component {
  state = {}

  componentWillMount() {
    const { filter, page, org, dispatch } = this.props
    this._pageChange({ current: filter && filter.currentPage || 1, pageSize: page.pageSize })
    isEmpty(org) && dispatch(getOrgList({ 'org': { 'orgMod': 1, 'orgLevel': 1 }}))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(urls.ORDER_CENTER_TEMPLATE)) {
      dispatch(clearFilter())
    }
  }

  // 点击分页获取列表数据
  _pageChange = (pagination) => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getTemplateList(finalFilter))
  }

  // 机构名称筛选
  _handleChange = value => {
    const { filter, dispatch } = this.props
    const finalFilter = { ...filter, organizationType: value, currentPage: 1 }
    dispatch(getTemplateList(finalFilter))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { org, filter } = this.props
    return (
      <div>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='机构名称:'
            >
              <div
                id='organizationType'
                style={{ position: 'relative' }}
              >
                {getFieldDecorator('organizationType', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter.organizationType,
                })(
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
                    placeholder='选择机构名称'
                    optionFilterProp='children'
                    onChange={this._handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Select.Option value=''>全部</Select.Option>
                    {org && org.map((key, index) => {
                      return <Select.Option key={key.id} value={key.id}>{key.orgName}</Select.Option>
                    })
                    }
                  </Select>
                )}
              </div>
            </FormItem>
          </Col>
          <Col span={3} offset={13}>
            <Link to={ORDER_CENTER_TEMPLATE_ADD}>
              <Button
                type='primary'
                title='新增订单模板'
              >
                新增订单模板
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <List
            pageChange={this._pageChange}
          />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filter: state.orderCenter.template.templateFilter || {},
    page: state.orderCenter.template.templatePage,
    list: state.orderCenter.template.templateList,
    org: state.orderCenter.template.orgList
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(TemplateManager))
