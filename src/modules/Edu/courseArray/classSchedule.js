import React from 'react'
import { Calendar, Select } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

import TableFilter from '../../../components/tableFilter'

import {
  getScheduleList,
  queryOrg
} from './reduck'

const Option = Select.Option

class ClassSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleMonth: moment(new Date()).format('YYYY-MM'),
      scheduleClassName: '',
      teacherName: '',
      classroomName: '',
      scheduleOrgId: '',
      studentName: '',
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getScheduleList({
      scheduleMonth: this.state.scheduleMonth,
    }))
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
  }

  componentDidMount() {
    const radioButton = document.getElementsByClassName('ant-radio-group-default')
    if (radioButton && radioButton.length > 0) {
      radioButton[0].style.display = 'none'
    }
  }

  getListData = (value) => {
    const { scheduleList } = this.props
    if (value.month() === moment(this.state.scheduleMonth).month()) {
      const date = value.date()
      const result = scheduleList.filter(item => new Date(moment(item.homeDate)).getDate() === date)
      if (result.length > 0) {
        return result[0].detail.map((item, index) => {
          const startTime = item.startTime ? moment(new Date(item.startTime)).format('HH:mm') : ''
          const endTime = item.endTime ? moment(new Date(item.endTime)).format('HH:mm') : ''
          const timeSection = startTime && endTime ? (startTime + '-' + endTime + '/') : '空'
          return (
            <span key={index}>
              <span>{timeSection}</span>
              <span>{item.scheduleClassName + '/'}</span>
              <span>{item.teacherName + '/'}</span>
              <span>{item.classroomName}</span><br />
            </span>
          )
        })
      }
    }
    return []
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value)
    return (
      <div style={{ overflowWrap: 'break-word', fontSize: 4 }}>
        {listData}
      </div>
    )
  }

  _handleSearch = (values) => {
    this.setState({
      scheduleClassName: values.scheduleClassName || '',
      teacherName: values.teacherName || '',
      classroomName: values.classroomName || '',
      scheduleOrgId: values.scheduleOrgId || '',
      studentName: values.studentName || '',
    }, () => {
      this.props.dispatch(getScheduleList(this.state))
    })
  }

  _handleSelect = (date) => {
    if (date.month() !== moment(this.state.scheduleMonth).month()) {
      const scheduleMonth = date.format('YYYY-MM')
      this.setState({
        scheduleMonth
      }, () => {
        this.props.dispatch(getScheduleList({ ...this.state, scheduleMonth }))
      })
    }
  }

  _handlePanelChange = (date) => {
    const scheduleMonth = date.format('YYYY-MM')
    this.setState({
      scheduleMonth
    }, () => {
      this.props.dispatch(getScheduleList({ ...this.state, scheduleMonth }))
    })
  }

  render() {
    const { orgList, orgLevel, orgId } = this.props
    const filterSetting = {
      layout: 'horizontal',
      fields: [
        {
          id: 'scheduleClassName',
          span: 6,
          props: {
            label: '班级名称'
          },
          placeHolder: '班级名称'
        },
        {
          id: 'teacherName',
          span: 6,
          props: {
            label: '教师'
          },
          placeHolder: '教师'
        },
        {
          id: 'classroomName',
          span: 6,
          props: {
            label: '教室'
          },
          placeHolder: '教室'
        },
        {
          id: 'studentName',
          span: 6,
          props: {
            label: '学员',
          },
          placeHolder: '学员'
        },
        {
          id: 'scheduleOrgId',
          span: 6,
          props: {
            label: '所属机构',
          },
          options: {
            initialValue: orgLevel === '2' ? orgId : '',
          },
          element: (
            <Select
              disabled = {orgLevel === '2'}
              getPopupContainer={() => document.getElementById('scheduleOrgId')}
            >
              <Option value=''>全部</Option>
              {
                orgList.map(item => (
                  <Option key={item.id} value={item.id}>{item.orgName}</Option>
                ))
              }
            </Select>
          ),
          hasPopup: true
        }
      ],
      extendButtons: [
        {
          id: 'print',
          name: ' 打印',
          props: {
            type: 'primary',
          },
          handleClick: () => {
            window.print()
          },
        }
      ]
    }
    return (
      <div>
        <TableFilter filterSetting={filterSetting} handleChange={this._handleSearch} />
        <Calendar
          dateCellRender={this.dateCellRender}
          onPanelChange={this._handlePanelChange}
          onSelect={this._handleSelect}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    scheduleList: state.courseArray.scheduleList,
    orgList: state.courseArray.orgList,
    orgLevel: state.courseArray.orgLevel,
    orgId: state.courseArray.orgId,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassSchedule)
