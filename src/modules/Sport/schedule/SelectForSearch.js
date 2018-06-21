import React, { Component } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const Option = Select.Option

class SelectForSearch extends Component {
  static propTypes = {
    options: PropTypes.array,
    optionsValueLabel: PropTypes.object,
    showAllOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  }

  static defaultProps = {
    options: [],
    optionsValueLabel: { value: 'value', label: 'label' },
    showAllOption: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      options: this.props.options
    }
  }

  _onChange = value => {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  _onSearch = value => {
    const { options, optionsValueLabel } = this.props
    this.setState({
      options: options.filter(item => item[optionsValueLabel.label].includes(value))
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options
    })
  }

  render() {
    const { showAllOption, optionsValueLabel, showSearch } = this.props
    const { options } = this.state
    return (
      <Select
        {...this.props}
        filterOption={!showSearch}
        onChange={(value) => this._onChange(value)}
        onSearch={(value) => this._onSearch(value)}
      >
        {showAllOption && (
          <Option key='-1' value={showAllOption.value || ''}>{showAllOption.label || '全部'}</Option>
        )}
        {options.map(item => (
          <Option key={item[optionsValueLabel.value]} value={item[optionsValueLabel.value]}>
            {item[optionsValueLabel.label]}
          </Option>
        ))}
      </Select>
    )
  }
}

export default SelectForSearch
