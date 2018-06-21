import React from 'react'
import { Input, Button } from 'antd'
import PropTypes from 'prop-types'
import { showModalSelectForm } from './ModalSelectForm'

export default class ModalSelectInput extends React.Component {
  static propTypes = {
    displayName: PropTypes.string.isRequired, // 展示字段名
    params: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // SelectForm表单参数
    inputParams: PropTypes.object, // Input组件参数（参考antdesign官网）
    onSelect: PropTypes.func, // 选中后的函数
    beforeClick: PropTypes.func, // 触发弹层出现前添加的事件
  }

  static defaultProps = {
    onSelect: () => {},
    beforeClick: () => {
      return true
    }
  }

  constructor(props) {
    super(props)
    const value = props.value || {}
    this.state = {
      selectedRows: value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ selectedRows: nextProps.value })
    }
  }

  // 弹层组件触发选择操作
  _modalOnSelect = (selectedRows) => {
    const { onChange, onSelect } = this.props
    this.setState({ selectedRows }, () => {
      if (onChange) {
        onChange(selectedRows)
      }
      onSelect(selectedRows)
    })
  }

  // 点击添加事件
  _handleAddClick = () => {
    const { params, beforeClick } = this.props
    let param = {}
    if (!beforeClick()) {
      return
    }
    if (typeof params === 'function') {
      param = params()
    } else {
      param = params
    }

    // 添加组件内的onSelect事件
    param.onSelect = this._modalOnSelect
    showModalSelectForm(param)
  }

  // 获取输入框的值
  _getInputValue = () => {
    const { selectedRows } = this.state
    const { displayName } = this.props
    let arr = selectedRows && selectedRows.length > 0 ? selectedRows.map((item) => {
      return item[displayName]
    }) : []
    return arr.join(';')
  }

  render() {
    const { inputParams } = this.props
    return (
      <span className='input-plus' >
        <Input
          value={this._getInputValue()}
          readOnly
          onClick={!(inputParams && inputParams.disabled) ? this._handleAddClick : undefined}
          {...inputParams}
          suffix={
            inputParams && inputParams.disabled
              ? <Button
                className='input-plus-btn'
                icon='plus'
                disabled={true}
              />
              : <Button
                type='primary'
                className='input-plus-btn'
                icon='plus'
                onClick={this._handleAddClick}
              />
          }
        />
      </span>
    )
  }
}

