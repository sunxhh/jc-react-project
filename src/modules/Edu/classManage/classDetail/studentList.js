import React from 'react'
import { Form, Row, Col, Table, Input, DatePicker, Button, message } from 'antd'

import EditableCell from './EditableCell'
import styles from '../style.less'
import { isEmpty } from '../../../../utils/lang'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

class StudentList extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     scoreList: []
  //   }
  // }

  scoreList = []

  _onCellChange = (e, record, isRemark) => {
    if (e.target.value) {
      const scoreIndex = this.scoreList.findIndex(item => item.classStudentId === record.studentId)
      if (scoreIndex > -1) {
        const score = {
          classStudentId: record.studentId,
          examScore: isRemark ? this.scoreList[scoreIndex].examScore : e.target.value,
          examRemark: isRemark ? e.target.value : this.scoreList[scoreIndex].examRemark,
        }
        this.scoreList.splice(scoreIndex, 1, score)
      } else {
        const score = {
          classStudentId: record.studentId,
          examScore: isRemark ? record.examScore : e.target.value,
          examRemark: isRemark ? e.target.value : record.examRemark,
        }
        this.scoreList.push(score)
      }
    }
  }

  render() {
    const { getFieldDecorator, validateFieldsAndScroll } = this.props.form
    const columns = [
      {
        key: 'orderId',
        title: '序号',
        dataIndex: 'orderId',
        render: (text, record, index) => (
          <span>{index + 1}</span>
        )
      },
      {
        key: 'studentNo',
        title: '编号',
        dataIndex: 'studentNo'
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
      },
      {
        key: 'examScore',
        title: '成绩',
        dataIndex: 'examScore',
        width: 120,
        render: (text, record, index) => {
          return (
            <EditableCell
              maxNumber={999.9}
              maxLength='5'
              key={index}
              index={index}
              name='examScore'
              dispatch={this.props.dispatch}
              onChange={e => this._onCellChange(e, record)}
            />
          )
        }
      },
      {
        key: 'examRemark',
        title: '备注',
        dataIndex: 'examRemark',
        width: 200,
        render: (text, record, index) => {
          return (
            <EditableCell
              maxLength='100'
              key={index}
              value={text}
              index={index}
              name='examRemark'
              dispatch={this.props.dispatch}
              onChange={e => this._onCellChange(e, record, true)}
            />
          )
        }
      }
    ]

    return (
      <div className={styles['content-wrapper']}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='考试名称'
              >
                {getFieldDecorator('examName', {
                  rules: [{
                    required: true,
                    message: '请输入考试名称',
                  }],
                })(
                  <Input placeholder='请输入考试名称' />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='考试日期'
              >
                {getFieldDecorator('examDate', {
                  rules: [{
                    required: true,
                    message: '请选择考试日期',
                  }],
                })(
                  <DatePicker placeholder='请选择考试时间' />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={this.props.dataSource}
          rowSelection={this.props.rowSelection}
          pagination={false}
          rowKey='id'
        />

        <div className={styles['btn-style']}>
          <Button
            onClick={this.props.onCancel}
          >取消
          </Button>
          <Button
            type='primary'
            onClick={() => {
              validateFieldsAndScroll((err, values) => {
                if (!err) {
                  if (isEmpty(this.scoreList)) {
                    message.info('请输入学生成绩')
                  } else {
                    this.props.confirm({
                      classExams: this.scoreList,
                      examName: values.examName,
                      examDate: values.examDate.format('YYYY-MM-DD'),
                    }, this.props.onCancel)
                  }
                }
              })
            }}
          >保存
          </Button>
        </div>
      </div>
    )
  }
}

export default Form.create()(StudentList)
