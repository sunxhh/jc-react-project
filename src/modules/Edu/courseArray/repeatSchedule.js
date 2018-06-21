import React from 'react'
import { Icon } from 'antd'
import { createAction } from 'redux-actions'

import RepeatScheduleItem from './repeatScheduleItem'
import styles from './courseArray.less'
import {
  DELETE_REPEAT_SCHEDULE
} from './reduck'

class RepeatSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailType: [1, 2, 3, 4, 5, 6, 7]
    }
  }

  _deleteSchedule = (index) => {
    const { dispatch } = this.props
    dispatch(createAction(DELETE_REPEAT_SCHEDULE)(index))
  }

  render() {
    const { dataSource, getFieldDecorator, classroomList, teacherList, showModal } = this.props
    // const { detailType } = this.state
    return (
      <div>
        {dataSource.map((item, index, arr) => (
          <RepeatScheduleItem
            key={'repeatScheduleItem' + index}
            dataSource={item}
            getFieldDecorator={getFieldDecorator}
            classroomList={classroomList}
            teacherList={teacherList}
            index={index}
            operateDom={(
              <div className={styles['schedule-operate']}>
                {arr.length > 1 && (
                  <div onClick={() => this._deleteSchedule(index)}>
                    <Icon type='delete' style={{ fontSize: 18 }} />
                  </div>
                )}
                <span onClick={() => showModal(index)}>
                  <Icon
                    style={{ fontSize: 18, marginTop: 10, color: '#1890ff' }}
                    type='edit'
                  />
                </span>
              </div>
            )}
          />
        ))}
      </div>
    )
  }
}

export default RepeatSchedule
