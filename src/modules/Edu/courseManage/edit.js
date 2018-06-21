import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { Form, Input, Button, Card, Row, Col, Select, Table, Popover, InputNumber, Icon } from 'antd'
import { isEmpty } from '../../../utils/lang'
import {
  editCourse,
  getCourseDetail,
  getCourseTypeList,
  getCourseModelList,
  getPayModelList,
  getBookList,
  setBookList,
  resetCourseDetail
} from './reduck'
import styles from './index.less'

const FormItem = Form.Item
const SelectOption = Select.Option
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}
const TextArea = Input.TextArea

class CourseEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unit: '', // 1.元/课时 2.元/期,
      tableData: [],
      selectedTableIds: [],
      selectedWaitTableIds: [],
      selectedTableRows: [],
      selectedWaitTableRows: [],
      isTermSelected: false, // 是否选择按学期
      hasGetFromState: false
    }
  }

  // 待选教材
  _waitColumns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    },
    {
      key: 'textBookTitle',
      title: '教材名称',
      dataIndex: 'textBookTitle',
      render: (text) => {
        const str = text && text.length > 5 ? `${text.substring(0, 5)}...` : text
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text}</div>}
            title='教材名称'
          >
            <span>{str}</span>
          </Popover>)
      }
    },
    {
      key: 'salePrice',
      title: '价格',
      dataIndex: 'salePrice',
      render: (text) => {
        const str = this._formatPrice(text)
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{str}</div>}
            title='价格'
          >
            <span>{str}</span>
          </Popover>)
      }
    },
    {
      key: 'buyPrice',
      title: '成本',
      dataIndex: 'buyPrice',
      render: (text) => {
        const str = this._formatPrice(text)
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{str}</div>}
            title='成本'
          >
            <span>{str}</span>
          </Popover>)
      }
    },
    {
      key: 'memo',
      title: '备注',
      dataIndex: 'memo',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text}</div>}
            title='备注'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>)
      }
    }
  ]

  // 已选教材
  _columns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    },
    {
      key: 'textBookTitle',
      title: '教材名称',
      dataIndex: 'textBookTitle',
      render: (text) => {
        const str = text && text.length > 5 ? `${text.substring(0, 5)}...` : text
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text}</div>}
            title='教材名称'
          >
            <span>{str}</span>
          </Popover>)
      }
    },
    {
      key: 'amount',
      title: '数量',
      width: 50,
      dataIndex: 'amount',
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={text > 0 ? text : 1}
          maxLength={9}
          precision={0}
          onChange={(value) => { this._handleNumChange(value, index) }}
        />
      )
    },
    {
      key: 'salePrice',
      title: '价格',
      dataIndex: 'salePrice',
      render: (text, record) => {
        const str = text && text !== 'null' && record.amount && record.amount !== 'null' ? this._formatPrice(text * record.amount) : text
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{str}</div>}
            title='价格'
          >
            <span>{str}</span>
          </Popover>)
      }
    },
    {
      key: 'buyPrice',
      title: '成本',
      dataIndex: 'buyPrice',
      render: (text, record) => {
        const str = text && text !== 'null' && record.amount && record.amount !== 'null' ? this._formatPrice(text * record.amount) : text
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{str}</div>}
            title='成本'
          >
            <span>{str}</span>
          </Popover>)
      }
    }
  ]

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(editCourse({
          ...this.getUserArg(values)
        }))
      }
    })
  }
  // 获取表单提交数据
  getUserArg = (values) => {
    const { info } = this.props
    const { tableData, isTermSelected } = this.state
    const courseTextbook = tableData.map((value) => {
      // 如果value存在courseId属性说明是来自修改
      return {
        textbookId: value.courseId ? value.textbookId : value.id,
        amount: value.amount ? value.amount : 1
      }
    })
    return {
      course: {
        id: info.id,
        courseType: values['courseType'],
        courseName: values['courseName'],
        courseModel: values['courseModel'],
        memo: values['memo'],
        payModel: values['payModel'],
        standardFees: values['standardFees'],
        unit: isTermSelected ? '2' : '1',
        courseTimeTotal: values['courseTimeTotal']
      },
      courseTextbook
    }
  }

  // 书籍数量变化
  _handleNumChange = (value, index) => {
    let { tableData } = this.state
    if (isNaN(value) || value === '') {
      value = 1
    }
    tableData[index]['amount'] = value
    this.setState({ tableData })
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
    const { bookList, dispatch } = this.props
    if (selectedWaitTableRows.length === 0) {
      return
    }
    const filterData = bookList.filter((value) => {
      return selectedWaitTableIds.indexOf(value.id) === -1
    })
    this.setState({ tableData: tableData.concat(selectedWaitTableRows) })
    this.setState({ selectedWaitTableIds: [] })
    this.setState({ selectedWaitTableRows: [] })
    dispatch(setBookList(filterData))
  }

  // 向左点击
  _handleLeftClick = () => {
    const { selectedTableRows, selectedTableIds, tableData } = this.state
    const { bookList, dispatch } = this.props
    if (selectedTableRows.length === 0) {
      return
    }
    const filterData = tableData.filter((value) => {
      return selectedTableIds.indexOf(value.id) === -1
    })
    this.setState({ tableData: filterData })
    this.setState({ selectedTableIds: [] })
    this.setState({ selectedTableRows: [] })
    dispatch(setBookList(bookList.concat(selectedTableRows)))
  }

  // 学费标准显隐每期课时
  _handlePayModelChange = (value) => {
    this.setState({ isTermSelected: value === '2' })
  }

  // 课程类别更改事件
  _handleCourseTypeChange = (value) => {
    const { dispatch } = this.props
    dispatch(getBookList({ textbook: { courseType: value }}))
    this.setState({ selectedTableIds: [] })
    this.setState({ selectedTableRows: [] })
    this.setState({ selectedWaitTableIds: [] })
    this.setState({ selectedWaitTableRows: [] })
    this.setState({ tableData: [] })
  }

  // 数字验证
  _isNumber = (rule, value, callback) => {
    const objReg = rule.field === 'courseTimeTotal'
      ? /(^[0-9]{1,9}$)|(^[0-9]{1,9}[\.]{1}[0-9]{1,1}$)/
      : /(^[0-9]{1,9}$)|(^[0-9]{1,9}[\.]{1}[0-9]{1,2}$)/
    if (isEmpty(value)) {
      callback()
      return
    }
    if ((String(value) && !objReg.test(value)) || parseFloat(value) <= 0) {
      callback('请输入正确的格式!')
      return
    }
    callback()
  }

  // 格式化价格
  _formatPrice(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 100) / 100
    return f.toString()
  }

  // 格式化数字
  _formatNum(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 10) / 10
    return f.toString()
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    const courseId = match.params.courseId
    dispatch(resetCourseDetail())
    dispatch(getCourseDetail({ id: courseId }))
    dispatch(getCourseTypeList())
    dispatch(getCourseModelList())
    dispatch(getPayModelList())
  }

  componentWillReceiveProps(nextProps) {
    const { info } = nextProps
    const { hasGetFromState } = this.state
    if (!isEmpty(info) && !hasGetFromState) {
      info.payModel === '2' && this.setState({ isTermSelected: true })
      info.courseTextbook && info.courseTextbook.length > 0 && this.setState({ tableData: info.courseTextbook })
      this.setState({ hasGetFromState: true })
    }
  }

  render() {
    const { form, info, courseTypeList, courseModelList, bookListLoading, payModelList, bookList } = this.props
    const { getFieldDecorator } = form
    const { tableData, selectedWaitTableIds, selectedTableIds, isTermSelected } = this.state
    const rowWaitSelection = {
      selectedRowKeys: selectedWaitTableIds,
      onChange: this._onSelectWaitTable,
    }
    const rowSelection = {
      selectedRowKeys: selectedTableIds,
      onChange: this._onSelectTable,
    }
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              loading={this.props.showBtnSpin}
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
          <Card
            title={<span className={styles['card-tit']}>基础信息</span>}
            className={styles['card-wrapper']}
          >
            <Row>
              <Col span={23}>
                <Row
                  id='rowUser'
                  justify='start'
                  type='flex'
                >
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='课程类别：'
                    >
                      {getFieldDecorator('courseType', {
                        rules: [
                          { required: true, message: '请选择课程类别！' }
                        ],
                        initialValue: info.courseType
                      })(
                        <Select
                          optionLabelProp='title'
                          filterOption={false}
                          placeholder='请选择课程类别'
                          onChange={this._handleCourseTypeChange}
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {!isEmpty(courseTypeList) ? courseTypeList.map(d => (
                            <SelectOption
                              key={d.value}
                              value={d.value}
                              title={d.name}
                            >
                              {d.name}
                            </SelectOption>
                          )) : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='课程名称：'
                    >
                      {getFieldDecorator('courseName', {
                        rules: [{
                          required: true,
                          whitespace: true,
                          message: '请输入课程名称！'
                        }],
                        initialValue: info.courseName
                      })(
                        <Input
                          placeholder='请输入课程名称'
                          maxLength={50}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='课程模式：'
                    >
                      {getFieldDecorator('courseModel', {
                        whitespace: true,
                        rules: [{
                          required: true,
                          message: '请选择课程模式！'
                        }],
                        initialValue: info.courseModel
                      })(
                        <Select
                          optionLabelProp='title'
                          filterOption={false}
                          placeholder='请选择课程模式'
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {!isEmpty(courseModelList) ? courseModelList.map(d => (
                            <SelectOption
                              key={d.value}
                              value={d.value}
                              title={d.name}
                            >
                              {d.name}
                            </SelectOption>
                          )) : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='备注：'
                    >
                      {getFieldDecorator('memo', {
                        initialValue: info.memo
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
          <Card
            title={<span className={styles['card-tit']}>学费标准</span>}
            className={styles['card-wrapper']}
          >
            <Row>
              <Col span={23}>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='收费模式：'
                  >
                    {getFieldDecorator('payModel', {
                      rules: [
                        { required: true, message: '请选择收费模式！' }
                      ],
                      initialValue: info.payModel
                    })(
                      <Select
                        optionLabelProp='title'
                        filterOption={false}
                        placeholder='请选择收费模式'
                        getPopupContainer={() => document.getElementById('rowUser')}
                        onChange={this._handlePayModelChange}
                      >
                        {!isEmpty(payModelList) ? payModelList.map(d => (
                          <SelectOption
                            key={d.value}
                            value={d.value}
                            title={d.name}
                          >
                            {d.name}
                          </SelectOption>
                        )) : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='学费标准：'
                  >
                    {getFieldDecorator('standardFees', {
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: '请输入学费标准！'
                      }, {
                        validator: this._isNumber
                      }],
                      initialValue: this._formatPrice(info.standardFees)
                    })(
                      <Input
                        placeholder='请输入学费标准'
                        maxLength={12}
                        addonAfter={`元/${isTermSelected ? '期' : '课时'}`}
                      />
                    )}
                  </FormItem>
                </Col>
                {
                  isTermSelected &&
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='每期课时：'
                    >
                      {getFieldDecorator('courseTimeTotal', {
                        rules: [{
                          required: true,
                          whitespace: true,
                          message: '请输入每期课时！'
                        }, {
                          validator: this._isNumber
                        }],
                        initialValue: this._formatNum(info.courseTimeTotal)
                      })(
                        <Input
                          placeholder='请输入每期课时'
                          maxLength={11}
                          addonAfter='课时'
                        />
                      )}
                    </FormItem>
                  </Col>
                }
              </Col>
            </Row>
          </Card>
          <Card
            title={<span className={styles['card-tit']}>教材信息</span>}
            className={styles['card-wrapper']}
          >
            <div className={styles['card-check-item']}>
              <Row>
                <Col span={24}>
                  <Col span={11}>
                    <Card
                      type='inner'
                      title={<p className={styles['book-table-tit']}>待选教材（课程类别相同）</p>}
                    >
                      <Table
                        className={styles['c-table-center']}
                        columns={this._waitColumns}
                        rowKey='id'
                        dataSource={bookList}
                        rowSelection={rowWaitSelection}
                        loading={bookListLoading}
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
                      title={<p className={styles['book-table-tit']}>已选教材</p>}
                    >
                      <Table
                        className={styles['c-table-center']}
                        columns={this._columns}
                        rowKey='id'
                        dataSource={tableData}
                        rowSelection={rowSelection}
                        loading={bookListLoading}
                        pagination={false}
                      />
                    </Card>

                  </Col>
                </Col>
              </Row>
            </div>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bookListLoading: state.eduCourse.bookListLoading,
    info: state.eduCourse.courseInfo,
    courseTypeList: state.eduCourse.courseTypeList,
    courseModelList: state.eduCourse.courseModelList,
    payModelList: state.eduCourse.payModelList,
    unitList: state.eduCourse.unitList,
    bookList: state.eduCourse.bookList,
    showBtnSpin: state.common.showButtonSpin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CourseEdit))
