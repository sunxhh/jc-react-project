import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Button, Table, Form, Row, Col, Cascader, Icon, Menu, message } from 'antd'
import { getScheduleGrid, getCenterList, scheduleAdd, scheduleCancel } from './reduck'
import styles from './styles.less'
// import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'

const MenuItem = Menu.Item

class ScheduleList extends Component {
  constructor(props) {
    super(props)
    let curYear = moment().year()
    this.state = {
      weekArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      currDateArr: this._getYMDArr(moment()),
      cascadeArr: this._getCascadeDate(),
      yearArr: [curYear - 1, curYear - 2, curYear, curYear + 1, curYear + 2],
      monthArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      tableData: [],
      canSetFormState: true,
      materScheduleManage: '',
      centerName: ''
    }
  }

  static defaultProps = {
    centerList: [],
    nurseGrid: [],
    page: {
      current: 1,
      pageSize: 20,
      total: 0,
      isLoading: false,
    },
  }

  // 获取日期
  _getDay = () => {
    const { list } = this.props
    const data = list[0]
    return data ? [
      data['dateOne'],
      data['dateTwo'],
      data['dateThree'],
      data['dateFour'],
      data['dateFive'],
      data['dateSix'],
      data['dateSeven']
    ] : []
  }

  // 生成列数据
  _generateColumns = () => {
    const batchArr = { '0': 'One', '1': 'Two', '2': 'Three', '3': 'Four', '4': 'Five', '5': 'Six', '6': 'Seven' }
    const { weekArr } = this.state
    const dayArr = this._getDay()
    let columns = [{
      title: '日期',
      key: 'date',
      fixed: 'left',
      children: [{
        title: '星期',
        key: 'week',
        fixed: 'left',
        children: [{
          title: '班次',
          dataIndex: 'nurseName',
          key: 'nurseId',
          fixed: 'left',
          render: (text) => (
            <div className={styles['batch-cell']}><span>{text && text !== 'null' && text}</span></div>
          )
        }]
      }]
    }]
    dayArr.forEach((value, i) => {
      columns.push({
        title: value,
        key: `date${value}`,
        dataIndex: `date${value}`,
        width: 300,
        children: [
          {
            title: weekArr[i],
            key: `week${value}`,
            dataIndex: `week${value}`,
            width: 300,
            children: [
              {
                title: '早班',
                dataIndex: `mo${batchArr[i]}`,
                key: `mo${batchArr[i]}`,
                width: 50,
                render: (text, record, index) => {
                  const className = this._currentGtPlanDate(record[`date${batchArr[i]}`], '0') ? styles['outDate'] : styles['mo']
                  return (
                    <div
                      className={styles['batch-cell']}
                      onDoubleClick={() => { this._handleCellClick(record, `mo${batchArr[i]}`, index) }}
                    >
                      {
                        record[`mo${batchArr[i]}`] === '1'
                          ? <p className={className}>早</p>
                          : null
                      }
                    </div>
                  )
                }
              },
              {
                title: '午班',
                dataIndex: `no${batchArr[i]}`,
                key: `no${batchArr[i]}`,
                width: 50,
                render: (text, record, index) => {
                  const className = this._currentGtPlanDate(record[`date${batchArr[i]}`], '1') ? styles['outDate'] : styles['no']
                  return (
                    <div
                      className={styles['batch-cell']}
                      onDoubleClick={() => { this._handleCellClick(record, `no${batchArr[i]}`, index) }}
                    >
                      {
                        record[`no${batchArr[i]}`] === '1'
                          ? <p className={className}>中</p>
                          : null
                      }
                    </div>
                  )
                }
              }, {
                title: '晚班',
                dataIndex: `ev${batchArr[i]}`,
                key: `ev${batchArr[i]}`,
                width: 50,
                render: (text, record, index) => {
                  const className = this._currentGtPlanDate(record[`date${batchArr[i]}`], '2') ? styles['outDate'] : styles['ev']
                  return (
                    <div
                      className={styles['batch-cell']}
                      onDoubleClick={() => { this._handleCellClick(record, `ev${batchArr[i]}`, index) }}
                    >
                      {
                        record[`ev${batchArr[i]}`] === '1'
                          ? <p className={className}>晚</p>
                          : null
                      }
                    </div>
                  )
                }
              }, {
                title: '其他',
                dataIndex: `ot${batchArr[i]}`,
                key: `ot${batchArr[i]}`,
                width: 50,
                render: (text, record, index) => {
                  const className = this._currentGtPlanDate(record[`date${batchArr[i]}`], '3') ? styles['outDate'] : styles['ot']
                  return (
                    <div
                      className={styles['batch-cell']}
                      onDoubleClick={() => { this._handleCellClick(record, `ot${batchArr[i]}`, index) }}
                    >
                      {
                        record[`ot${batchArr[i]}`] === '1'
                          ? <p className={className}>其他</p>
                          : null
                      }
                    </div>
                  )
                }
              }]
          }
        ]
      })
    })
    return columns
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    this.setState({ canSetFormState: true })
    dispatch(getScheduleGrid(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const { currDateArr, centerName, centerId } = this.state
    return {
      centerName,
      centerId,
      year: currDateArr[0],
      month: currDateArr[1],
      week: currDateArr[2],
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 获取制定年月所跨周
  _getWeeksNumInMon = (year, monthMumber) => {
    year = year.toString()
    monthMumber = monthMumber.toString()
    let startDate = moment(new Date(year + '-' + monthMumber + '-1'))
    let startWeekNum = 0
    let endWeekNum = 0
    let endDate = ''
    startWeekNum = startDate.isoWeek()
    endDate = startDate.add(1, 'months').subtract(1, 'days')
    if (startWeekNum === 52 || startWeekNum === 53) {
      startWeekNum = 0
    }
    if (monthMumber === '12') {
      if (endDate.isoWeek() === 1) {
        endWeekNum = moment(startDate).isoWeeksInYear() + 1
      } else {
        endWeekNum = moment(startDate).isoWeeksInYear()
      }
    } else {
      endWeekNum = endDate.isoWeek()
    }
    return this._getWeeks(endWeekNum - startWeekNum + 1)
  }

  // 获取周集合
  _getWeeks = (num) => {
    const weeks = [
      { value: '1', label: '第一周' },
      { value: '2', label: '第二周' },
      { value: '3', label: '第三周' },
      { value: '4', label: '第四周' },
    ]
    if (num === 5) {
      weeks.push({ value: '5', label: '第五周' })
    } else if (num === 6) {
      weeks.push({ value: '5', label: '第五周' })
      weeks.push({ value: '6', label: '第六周' })
    }
    return weeks
  }

  // 获取切换月份数据源
  _getCascadeDate = () => {
    const months = [
      { value: '1', label: '一月' },
      { value: '2', label: '二月' },
      { value: '3', label: '三月' },
      { value: '4', label: '四月' },
      { value: '5', label: '五月' },
      { value: '6', label: '六月' },
      { value: '7', label: '七月' },
      { value: '8', label: '八月' },
      { value: '9', label: '九月' },
      { value: '10', label: '十月' },
      { value: '11', label: '十一月' },
      { value: '12', label: '十二月' }
    ]
    let curYear = moment().year()
    let yearArr = [
      { value: curYear - 2, label: curYear - 2, children: JSON.parse(JSON.stringify(months)) },
      { value: curYear - 1, label: curYear - 1, children: JSON.parse(JSON.stringify(months)) },
      { value: curYear, label: curYear, children: JSON.parse(JSON.stringify(months)) },
      { value: curYear + 1, label: curYear + 1, children: JSON.parse(JSON.stringify(months)) },
      { value: curYear + 2, label: curYear + 2, children: JSON.parse(JSON.stringify(months)) }
    ]

    let result = []
    yearArr.map((yearData) => {
      let months = yearData.children.map((data) => {
        data['children'] = this._getWeeksNumInMon(yearData.value, data.value)
        return data
      })
      yearData['children'] = months
      result.push(yearData)
    })
    return result
  }

  // 获取给定日期的年、月、日
  _getYMDArr = (m) => {
    let weekNum = m.isoWeek() - moment(m).startOf('month').isoWeek() + 1
    return [m.year(), (m.month() + 1).toString(), weekNum.toString()]
  }

  // 当前日期与表格时间对比
  _currentGtPlanDate = (planDate, planType) => {
    let str = ''
    if (planType === '0') {
      str = planDate + ' 11:00:00'
    } else if (planType === '1') {
      str = planDate + ' 15:30:00'
    } else if (planType === '2') {
      str = planDate + ' 21:00:00'
    } else if (planType === '3') {
      str = planDate + ' 23:59:59'
    }
    return new Date().getTime() > new Date(str).getTime()
  }

  // 表格点击事件
  _handleCellClick = (record, fieldType, index) => {
    const { dispatch } = this.props
    let { tableData, centerId, centerName } = this.state
    let planType = ''
    let typeKey = fieldType.substring(0, 2)
    let suffix = fieldType.substr(2)
    let planDate = record['date' + suffix]
    if (typeKey === 'mo') {
      planType = '0'
    } else if (typeKey === 'no') {
      planType = '1'
    } else if (typeKey === 'ev') {
      planType = '2'
    } else if (typeKey === 'ot') {
      planType = '3'
    }
    if (this._currentGtPlanDate(planDate, planType)) {
      message.error('不可以对当前时间之前进行排班！')
      return
    }
    const val = record[fieldType]
    const param = {
      centerId,
      centerName,
      planType,
      planDate,
      nurseId: record['nurseId'],
      nurseName: record['nurseName']
    }
    if (val === '1') {
      // 已排
      dispatch(scheduleCancel(param)).then((data) => {
        if (data.status === 'success') {
          record[fieldType] = '0'
          tableData[index] = record
          this.setState({ tableData })
        }
      })
    } else {
      // 未排
      dispatch(scheduleAdd(param)).then((data) => {
        if (data.status === 'success') {
          record[fieldType] = '1'
          tableData[index] = record
          this.setState({ tableData })
        }
      })
    }
  }

  // 点击查询
  _handleQuery = () => {
    const arr = this._getYMDArr(moment())
    this.setState({ currDateArr: arr }, () => {
      this._getList(1)
    })
  }

  // 上一周 下一周切换
  _handleWeekToggle = (type) => {
    let { currDateArr, cascadeArr, yearArr, monthArr } = this.state
    let year = currDateArr[0]
    let month = currDateArr[1]
    let week = currDateArr[2]
    let weekArr = cascadeArr[yearArr.indexOf(year)].children[monthArr.indexOf(month)].children
    if (type === '1') {
      // 下一周
      if (week === weekArr.length.toString()) {
        // 最后一周
        week = '1'
        // 最后一个月
        if (month === '12') {
          month = '1'
          year = year + 1
          if (yearArr.indexOf(year) === -1) {
            return
          }
        } else {
          month = (parseInt(month) + 1).toString()
        }
      } else {
        week = (parseInt(week) + 1).toString()
      }
    } else if (type === '-1') {
      let nextweekArr = []
      // 上一周
      if (week === '1') {
        // 第一周
        if (month === '1') {
          month = '12'
          year = year - 1
          if (yearArr.indexOf(year) === -1) {
            return
          }
        } else {
          month = (parseInt(month) - 1).toString()
        }
        nextweekArr = cascadeArr[yearArr.indexOf(year)].children[monthArr.indexOf(month)].children
        week = nextweekArr.length.toString()
      } else {
        week = (parseInt(week) - 1).toString()
      }
    }
    this.setState({ currDateArr: [year, month, week] }, () => {
      this._getList()
    })
  }

  // 切换月份
  _handleMonthChange = (value) => {
    this.setState({ currDateArr: value }, () => {
      this._getList()
    })
  }

  // 月子中心点击
  _handleMenuClick = (item) => {
    const { centerList } = this.props
    const center = centerList.find((val) => {
      return val.id === item.key
    })
    this.setState({ centerId: center.id, centerName: center.orgName }, () => {
      this._getList()
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (pages) => {
    const { page } = this.props
    const arg = { current: page && page.pageSize !== pages.pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    this._getList(arg.current, arg.pageSize)
  }

  // 每页数量变化
  // _handlePageSizeChange = (current, pageSize) => {
  //   this._getList(current, pageSize)
  // }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    this._isMounted = true
    document.querySelector('.ant-layout-content').style.background = '#f8f8f8'
    dispatch(getCenterList()).then((data) => {
      if (this._isMounted && data.result.length > 0) {
        this.setState({ centerId: data.result[0].id, centerName: data.result[0].orgName }, () => {
          this._getList()
        })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillReceiveProps(nextProps) {
    const { canSetFormState } = this.state
    const { list } = nextProps
    if (list && canSetFormState) {
      this.setState({ tableData: list, canSetFormState: false })
    }
  }

  render() {
    const { showListSpin, centerList, page } = this.props
    const { currDateArr, cascadeArr, tableData, centerId } = this.state
    const pages = genPagination({ ...page, records: page.total, pageNo: page.current })

    return (
      <div className={styles['center-wrap']}>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row>
            <Col
              span={14}
              offset={8}
            >
              <div className={styles['week-area']} id='rowSchedule'>
                <a
                  href='javascript:;'
                  onClick={() => { this._handleWeekToggle('-1') }}
                ><Icon type='left' />上一周
                </a>
                <Cascader
                  size={'large'}
                  className={styles['month-cas']}
                  allowClear={false}
                  options={cascadeArr}
                  placeholder='切换月份'
                  onChange={this._handleMonthChange}
                  value={currDateArr}
                  getPopupContainer={() => document.getElementById('rowSchedule')}
                />
                <a
                  href='javascript:;'
                  onClick={() => { this._handleWeekToggle('1') }}
                >下一周<Icon type='right' />
                </a>
              </div>
            </Col>
            <Col span={2}>
              <div className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  刷新
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <div>
          <Menu
            onClick={this._handleMenuClick}
            style={{ width: 150 }}
            mode='inline'
            className={styles['menu-list']}
            selectedKeys={[centerId]}
          >
            {
              centerList.map((value) => {
                return (
                  <MenuItem key={value.id}>{value.orgName}</MenuItem>
                )
              })
            }
          </Menu>
          <Table
            className={styles['c-table-center']}
            columns={this._generateColumns()}
            rowKey='nurseId'
            dataSource={tableData}
            bordered={true}
            loading={showListSpin}
            scroll={{ x: 1500 }}
            pagination={pages}
            onChange={this._handlePageChange}
          />
        </div>
      </div>
    )
  }
}

const
  mapStateToProps = (state) => {
    return {
      list: state.nurseSchedule.nurseGrid,
      centerList: state.nurseSchedule.centerList,
      centerName: state.nurseSchedule.centerName,
      page: state.nurseSchedule.page,
      showListSpin: state.common.showListSpin,
    }
  }

const
  mapDispatchToProps = (dispatch) => ({
    dispatch
  })

export default connect(mapStateToProps, mapDispatchToProps)(
  Form
    .create()(
      ScheduleList
    ))

