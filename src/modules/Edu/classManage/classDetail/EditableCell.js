import React, { Component } from 'react'
import { Input, Icon } from 'antd'
import styles from '../style.less'

export default class EditableCell extends Component {
  state = {
    editable: false,
    value: ''
  }

  handleChange = (e) => {
    const value = e.target.value
    const valueLength = value.length
    if (this.props.maxNumber && value) {
      const maxNumber = this.props.maxNumber
      const reg = /(^[0-9]+$)|(^[0-9]+\.{1}[1-9]?$)/
      if (!(reg.test(value) && (parseFloat(value) <= maxNumber))) {
        const valueArr = value.split('')
        valueArr.splice(valueLength - 1, 1)
        e.target.value = valueArr.join('')
      }
    }
    this.setState({ value: e.target.value })
    this.props.onChange(e)
  }

  check = () => {
    this.setState({ editable: false })
    this.setState({
      value: parseFloat(this.state.value)
    })
    this.props.onChange({ target: { value: parseFloat(this.state.value) }})
  }

  edit = () => {
    this.setState({ editable: true })
  }

  render() {
    const { editable, value } = this.state
    return (
      <div className={styles['editable-cell']}>
        {
          editable
            ? (
              <div className={styles['editable-cell-input-wrapper']}>
                <Input
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                  maxLength={this.props.maxLength || '20000'}
                />
                <Icon
                  type='check'
                  className={styles['editable-cell-icon-check']}
                  onClick={this.check}
                />
              </div>
            )
            : (
              <div className={styles['editable-cell-text-wrapper']}>
                {value || this.props.default}
                <Icon
                  type='edit'
                  className={styles['editable-cell-icon']}
                  onClick={this.edit}
                />
              </div>
            )
        }
      </div>
    )
  }
}
