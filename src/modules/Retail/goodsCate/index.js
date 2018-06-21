import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Select, Radio, InputNumber, Spin, message } from 'antd'

import { debounce } from 'Utils/function'
import { isEmpty } from 'Utils/lang'
import styles from './styles.less'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class GoodsCate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasInit: false,
      oneList: [],
      twoList: [],
      type: '',
      disabled: true,
    }
    this._handleOrgSearch = debounce(this._handleOrgSearch, 800)
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName: '' }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryPar(
      {
        orgCode: '',
      },
    ))
  }

  componentWillReceiveProps(nextProps) {
    const { hasInit } = this.state
    const { oneList, twoList } = nextProps
    if (!hasInit && !isEmpty(oneList) && !isEmpty(twoList)) {
      this.setState({
        oneList,
        twoList,
        hasInit: true
      })
    }
  }

  // 生成列表
  _columns = (type) => {
    return [
      {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 80,
        render: (text, record, index) => {
          return (
            <span>{index + 1}</span>
          )
        }
      },
      {
        key: 'goodsCatgName',
        title: type === '1' ? '一级分类' : '二级分类',
        dataIndex: 'goodsCatgName',
        render: (text, record) => (
          <span>{text && text !== 'null' && text}</span>
        )
      },
      {
        key: 'sort',
        title: '排序',
        dataIndex: 'sort',
        render: (text, record, index) => (
          <span>
            {
              record.isEdit
                ? <InputNumber
                  value={record.sort}
                  onChange={(value) => { this._handleInputChange(value, index, type) }}
                  style={{ width: '100px' }}
                  maxLength='50'
                  min={1}
                  step={1}
                />
                : (text && text !== 'null' && text)
            }
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: 100,
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <div className={styles['table-ope']}>
              {
                btnRole.includes('edit') && !record.isEdit &&
                <a
                  href='javascript:;'
                  onClick={(e) => { this._sort(e, record, index, type) }}
                >编辑
                </a>
              }
              {
                btnRole.includes('edit') && record.isEdit &&
                <a
                  href='javascript:;'
                  onClick={(e) => { this._sortSave(e, record, index, type) }}
                >保存
                </a>
              }
            </div>
          )
        }
      }
    ]
  }

  // 获取列表数据的公用方法
  _getList = (type) => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(Module.actions.getCateList(arg)).then((res) => {
      if (res.status === 'success') {
        if (type === '1') {
          this.setState({
            oneList: res.goodsCatgOneList,
            type: res.type
          })
        } else if (type === '2') {
          this.setState({
            twoList: res.goodsCatgTwoList,
            type: res.type
          })
        } else {
          this.setState({
            oneList: res.goodsCatgOneList,
            twoList: res.goodsCatgTwoList,
            type: res.type
          })
        }
      }
    })
  }

  // 获取所有表格需要的参数
  _getParameter = () => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(Module.actions.setQueryPar(arg))
    return {
      ...arg
    }
  }

  // 点击查询
  _handleQuery = (e) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err) => {
      if (!err) {
        this._getList()
        this.setState({
          disabled: false,
        })
      }
    })
  }

  // 排序
  _sort = (e, record, index, type) => {
    const { oneList, twoList } = this.state
    const list = type === '1' ? oneList : twoList
    let isEdit = list.some((data) => {
      return data.isEdit === true
    })
    if (isEdit) {
      message.error('请先保存正在编辑的排序！')
      return
    }
    if (type === '1') {
      oneList[index]['isEdit'] = true
      this.setState({ oneList })
    } else if (type === '2') {
      twoList[index]['isEdit'] = true
      this.setState({ twoList })
    }
  }

  // 保存排序
  _sortSave = (e, record, index, type) => {
    const { dispatch } = this.props
    const { oneList, twoList } = this.state
    if (type === '1') {
      const sort = oneList[index]['sort']
      if (!sort) {
        message.error('请填写显示顺序！')
        return
      } else if (!(/(^[1-9]\d*$)/.test(sort))) {
        message.error('请输入正整数')
        return
      }
      dispatch(Module.actions.goodSort({ id: record.id, sort })).then(res => {
        if (res.status === 'success') {
          oneList[index]['isEdit'] = false
          this._getList('1')
        }
      })
    } else if (type === '2') {
      const sort = twoList[index]['sort']
      if (!sort) {
        message.error('请填写显示顺序！')
        return
      } else if (!(/(^[1-9]\d*$)/.test(sort))) {
        message.error('请输入正整数')
        return
      }
      dispatch(Module.actions.goodSort({ id: record.id, sort })).then(res => {
        if (res.status === 'success') {
          twoList[index]['isEdit'] = false
          this._getList('2')
        }
      })
    }
  }

  // 编辑排序
  _handleInputChange = (value, index, type) => {
    const { oneList, twoList } = this.state
    if (type === '1') {
      oneList[index]['sort'] = value
      this.setState({
        oneList
      })
    } else if (type === '2') {
      twoList[index]['sort'] = value
      this.setState({
        twoList
      })
    }
  }

  // 查询门店
  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName }))
  }

  // 选择c端展示级别
  _onChange =(e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    const orgCode = this.props.initQueryPar.orgCode
    if (!orgCode) {
      message.error('请先选择门店！')
      return
    }
    form.validateFields((err) => {
      if (!err) {
        dispatch(Module.actions.chooseCate(
          {
            orgCode: this.props.initQueryPar.orgCode,
            // orgCode: '100001',
            categoryType: e.target.value
          }
        ))
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, initQueryPar, selectFetchingFlag, shopList } = this.props
    const { oneList, twoList } = this.state
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='所属门店：'
                {...formItemLayout}
              >
                {getFieldDecorator('orgCode', {
                  rules: [
                    {
                      required: true,
                      message: '请先选择门店'
                    }
                  ],
                  initialValue: initQueryPar.orgCode || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择所属门店'
                    filterOption={false}
                    onSearch={this._handleOrgSearch}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(shopList) && shopList.map(shop => (
                      <SelectOption
                        key={shop.orgCode}
                        value={shop.orgCode}
                        title={shop.orgName}
                      >
                        {shop.orgName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={2}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Form>
          <div className={styles['table-wrapper']}>
            <Row>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  {getFieldDecorator('type', {
                    initialValue: this.state.type === null ? '1' : this.state.type,
                  })(
                    <RadioGroup onChange={this._onChange} disabled={this.state.disabled}>
                      <Radio value={'1'}>按照一级分类显示</Radio>
                      <Radio value={'2'}>按照二级分类显示</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div className={styles['table-wrapper']}>
            <Row>
              <Col span={24}>
                <Col span={11}>
                  <Table
                    className={styles['c-table-center']}
                    columns={this._columns('1')}
                    rowKey='id'
                    dataSource={oneList}
                    loading={showListSpin}
                    pagination={false}
                  />
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <Table
                    className={styles['c-table-center']}
                    columns={this._columns('2')}
                    rowKey='id'
                    dataSource={twoList}
                    loading={showListSpin}
                    pagination={false}
                  />

                </Col>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.goodsCate'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.goodsCate'], mapStateToProps)(Form.create()(GoodsCate))
