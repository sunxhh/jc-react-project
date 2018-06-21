import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import storage from '../../../utils/storage'
import { Form, Input, Select, Row, Col, Button, Card, Icon, Modal, Table, message } from 'antd'
import { PAG_CONFIG } from '../pagination'
import styles from './index.less'
import BookItem from './buyBook'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const payStyle = {
  '1': '金诚币',
  '2': '银行卡'
}

const relationType = {
  '1': '父亲',
  '2': '母亲',
  '3': '本人',
}
// 获取当前登陆者的id和名字
const orderHandleId = storage.get('userInfo')['ticket']
const orderPeopleName = storage.get('userInfo')['fullName']
class BuyTextBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classid: 0,
      keys: [{
        key: 0,
        initVal: [],
        totalPrice: '',
        textbookPrices: [],
        orderClassId: '',
        orderClassName: '',
        feeData: {},
      }],
      studentId: '',
      visible: false,
      orderHandleId: orderHandleId,
      studentName: '',
      classIdInfo: [],
    }
  }

  componentDidMount() {
    this.props.dispatch(actions.sellUser()) // 获取销售人员
    this._handleAction(1)
  }
  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.studentListPage.currentPage, pageSize = this.props.studentListPage.pageSize) => {
    return {
      student: {
        name: this.state.studentName ? this.state.studentName : ''
      },
      currentPage: current,
      pageSize: pageSize
    }
  }

  // 发起学员列表查询
  _handleAction = (page, pageSize) => {
    const arg = this._getQueryParameter(page, pageSize)
    this.props.dispatch(actions.getStudentName(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSearch = () => {
    this._handleAction()
  }

  // 点击分页时获取表格数据
  _handlePagination = (page) => {
    this._handleAction(page.current, page.pageSize)
  }

  // 计算总价
  _calAllClassPrice = (param) => {
    let { keys } = this.state
    let { setFieldsValue } = this.props.form
    let sum = 0
    keys[param.index]['totalPrice'] = param.value
    keys[param.index]['textbookPrices'] = param.textbookPrices
    if (param.feeData) {
      keys[param.index]['feeData'] = param.feeData
    }
    keys.map((data) => {
      sum += data.totalPrice
    })
    setFieldsValue({ amountAll: sum })
    this.setState({ keys })
  }

  // 设置所选班级
  _setOrder = (param) => {
    const { keys } = this.state
    keys[param.index]['orderClassId'] = param.orderClassId
    keys[param.index]['orderClassName'] = param.orderClassName
    this.setState(keys)
  }

  // 姓名表格选项
  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.studentListPage
        return (
          <span>
            {
              pageSize *
              currentPage +
              (index + 1) -
              pageSize
            }
          </span>
        )
      }
    },
    {
      title: '编号',
      dataIndex: 'studentNo',
      key: 'studentNo'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '联系电话',
      dataIndex: 'linkPhone',
      key: 'linkPhone'
    }
  ]
  // 姓名弹窗
  showStudentModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  // 表格单元选择(将对应的数据渲染到对应的字段，同时保存学员的id)
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.form.setFieldsValue({
      'studentNo': selectedRows[0].studentNo,
      'studentName': selectedRows[0].name,
      'linkPhone': selectedRows[0].linkPhone,
      'linkType': selectedRows[0].linkType,
    })
    this.setState({
      studentId: selectedRows[0].id,
    })
    this.setState({ selectedRowKeys })
    this.handleCancel()
  }
  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    const { keys, studentId, classIdInfo } = this.state
    let repeatArr = classIdInfo.sort()
    for (let i = 0; i < repeatArr.length; i++) {
      if (repeatArr[i] === repeatArr[i + 1]) {
        message.error('请确认是否添加了相同的教材！')
        return
      }
    }
    let orderSub = []
    keys.forEach((data) => {
      let orderSubItem = {}
      let orderDetail = []
      orderSubItem['orderClassId'] = '0'
      orderSubItem['orderClassName'] = '0'
      if (!isEmpty(data.textbookPrices)) {
        data.textbookPrices.forEach((bookPrice) => {
          orderDetail.push({
            detailType: '3',
            detailObjType: '2',
            detailObjId: bookPrice['id'],
            detailNum: bookPrice['amount'] ? bookPrice['amount'] : 1,
            detailDiscount: '0'
          })
        })
      }
      orderSubItem['orderDetail'] = orderDetail
      orderSub.push(orderSubItem)
    })
    form.validateFields((err, values) => {
      if (orderSub[0].orderDetail.length === 0) {
        message.error('至少选择一个教材！')
        return
      }
      if (!err && orderSub[0].orderDetail.length !== 0) {
        dispatch(actions.addClassroom({
          order: {
            orderSub,
            studentId,
            orderSalerId: values.orderSalerId,
            orderHandleId: orderHandleId,
            orderType: '3',
            orderChargeType: values.orderChargeType
          }
        }))
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
      setFieldsValue,
      getFieldValue
    } = this.props.form
    const {
      coursePriceList,
      sellUser,
      studentList,
      studentListPage,
      classroomPagination,
      textbookPrices,
      coursePrices
    } = this.props
    const rowSelection = {
      type: 'radio',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card
            className={styles['search-container']}
            title='学员选择'
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='编号'
                >
                  {getFieldDecorator('studentNo')(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='姓名'
                >
                  {getFieldDecorator('studentName', {
                    rules: [{
                      required: true,
                      message: '学员姓名不能为空！'
                    }]
                  })(
                    <Input
                      disabled={true}
                      addonAfter={
                        <a
                          onClick={this.showStudentModal}
                          href='javascript:;'
                        >
                          <Icon
                            type='plus'
                            title='点击添加学员姓名'
                          />
                        </a>
                      }
                    />
                  )}
                </FormItem>
                <Modal
                  title='学生姓名选择'
                  width={1200}
                  footer={false}
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                >
                  <Row style={{ marginBottom: 20 }}>
                    <Col span={8}>
                      <Input
                        onChange={
                          (e) => {
                            this.setState({
                              studentName: e.target.value
                            })
                          }
                        }
                        placeholder='请输入姓名'
                      />
                    </Col>
                    <Col span={8}>
                      <Button
                        type='primary'
                        style={{ marginLeft: 12 }}
                        onClick={this._handleSearch}
                      >
                        查询
                      </Button>
                    </Col>
                  </Row>
                  <Table
                    columns={this._columns}
                    rowSelection={rowSelection}
                    dataSource={studentList}
                    onChange = {this._handlePagination}
                    rowKey='id'
                    locale={{
                      emptyText: '暂无数据'
                    }}
                    pagination = {{ ...studentListPage, ...PAG_CONFIG }}
                  />
                </Modal>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='联系电话'
                >
                  {getFieldDecorator('linkPhone')(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
              >
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  {getFieldDecorator('linkType')(
                    <Select
                      className={styles['phone']}
                      disabled={true}
                    >
                      {
                        Object.keys(relationType).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {relationType[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            title='教材选择'
          >
            <div id='classItem'>
              {
                this.state.keys.map((item, index) => {
                  return (
                    <BookItem
                      getFieldDecorator={getFieldDecorator}
                      getFieldValue={getFieldValue}
                      setFieldsValue={setFieldsValue}
                      textbookPrices={textbookPrices[index]}
                      coursePrices={coursePrices[index]}
                      coursePriceList={coursePriceList}
                      dispatch={this.props.dispatch}
                      classroomPagination={classroomPagination}
                      key={item.key}
                      itemKey={item.key}
                      remove={() => this.remove(item.key)}
                      keys={this.state.keys}
                      classNameItem={this.state.classNameItem}
                      totalPrice={item.totalPrice}
                      calTotalPrice = {this._calAllClassPrice}
                      setOrder = {this._setOrder}
                      classIdInfo = {this.state.classIdInfo}
                    />
                  )
                })
              }
            </div>
            <Row>
              <Col
                span={6}
                id='orderSalerId'
              >
                <FormItem
                  {...formItemLayout}
                  label='销售员'
                >
                  {getFieldDecorator('orderSalerId', {
                    rules: [{
                      required: true,
                      message: '销售员不能为空！'
                    }]
                  })(
                    <Select
                      placeholder='请选择销售人员'
                      getPopupContainer={() => document.getElementById('orderSalerId')}
                    >
                      {
                        sellUser && sellUser.map((item) => {
                          return (
                            <Option
                              key={item.uuid}
                              value={item.uuid}
                            >
                              {item.fullName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='经办人'
                >
                  {getFieldDecorator('orderHandleId', {
                    initialValue: orderPeopleName
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='总计'
                >
                  {getFieldDecorator('amountAll', {
                    initialValue: 0
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='orderChargeType'
              >
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  {getFieldDecorator('orderChargeType', {
                    rules: [{
                      required: true,
                      message: '支付方式不能为空！'
                    }]
                  })(
                    <Select
                      className={styles['phone']}
                      placeholder='请选择支付方式'
                      getPopupContainer={() => document.getElementById('orderChargeType')}
                    >
                      {
                        Object.keys(payStyle).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {payStyle[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <FormItem className={styles['operate-btn-center']}>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
              loading={this.props.showBtnSpin}
            >
              保存
            </Button>
            <Button
              onClick={() => history.go(-1)}
              title='点击取消'
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    sellUser: state.handleCenter.sellUser,
    studentList: state.handleCenter.studentList,
    studentListPage: state.handleCenter.studentListPage,
    coursePriceList: state.handleCenter.coursePriceList,
    coursePrices: state.handleCenter.coursePrices,
    textbookPrices: state.handleCenter.textbookPrices,
    classroomPagination: state.handleCenter.classroomPagination,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BuyTextBook))
