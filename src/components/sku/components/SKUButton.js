import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'

class SKUButton extends Component {
  render() {
    let { disabled, buttonAdd } = this.props
    return (
      <div style={{ background: '#f8f8f8', padding: 10, marginTop: 10 }}>
        {typeof disabled === 'string' ? (
          <Tooltip trigger='hover' position='top-left' content={disabled}>
            <Button type='primary' onClick={this.props.onClick} disabled={!!disabled}>
              {buttonAdd || '添加'}
            </Button>
          </Tooltip>
        ) : (
          <Button type='primary' onClick={this.props.onClick} disabled={!!disabled}>
            {buttonAdd || '添加'}
          </Button>
        )}
      </div>
    )
  }
}

SKUButton.contextTypes = {
  prefix: PropTypes.string,
}

export default SKUButton
