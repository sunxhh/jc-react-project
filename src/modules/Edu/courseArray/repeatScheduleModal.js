import React from 'react'
import { Form, Button } from 'antd'
import { createAction } from 'redux-actions'

import styles from './courseArray.less'
import {
  ADD_REPEAT_SCHEDULE,
  EDIT_REPEAT_SCHEDULE
} from './reduck'
import RepeatScheduleItem from './repeatScheduleItem'

const FormItem = Form.Item

class RepeatScheduleModal extends React.Component {
  _handleModalSubmit = () => {
    const { dispatch, form, onCancel, allLength } = this.props
    const index = this.props.index || 0
    form.validateFields((err, values) => {
      if (!err) {
        const finalSchedule = {
          teacherId: values['teacherId' + index],
          classroomId: values['classroomId' + index],
          startDate: values['date' + index][0].format('YYYY-MM-DD'),
          endDate: values['date' + index][1].format('YYYY-MM-DD'),
          startTime: values['startTime' + index].format('HH:mm'),
          endTime: values['endTime' + index].format('HH:mm'),
          detailType: values['detailType' + index].join(','),
          maxNum: values['maxNum' + index]
        }
        if (index < allLength) {
          dispatch(createAction(EDIT_REPEAT_SCHEDULE)({
            schedule: finalSchedule,
            index
          }))
        } else {
          dispatch(createAction(ADD_REPEAT_SCHEDULE)(finalSchedule))
        }
        // setFieldsValue({ ['classroomId' + index]: values.classroomId })
        onCancel()
      }
    })
  }

  render() {
    const { dataSource, form, classroomList, teacherList, onCancel, index } = this.props
    return (
      <Form>
        <RepeatScheduleItem
          classroomList={classroomList}
          teacherList={teacherList}
          dataSource={dataSource}
          inModal={true}
          getFieldDecorator={form.getFieldDecorator}
          index={index}
          form={form}
        />
        <FormItem className={styles['operate-modal-btn']}>
          <Button
            type='primary'
            htmlType='submit'
            onClick={() => this._handleModalSubmit()}
          >
            保存
          </Button>
          <Button
            onClick={onCancel}
            title='点击取消'
          >
            取消
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(RepeatScheduleModal)
