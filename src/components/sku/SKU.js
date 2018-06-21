import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SKUGroup from './components/SKUGroup'
import SKUButton from './components/SKUButton'
import styles from './index.less'

const noop = res => res

const noopPromise = () => new Promise(noop)

class SKU extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skuTree: [].concat(props.skuTree),
      data: props.value,
    }
  }

  componentWillMount() {
    const { onFetchGroup } = this.props
    if (typeof onFetchGroup === 'function') {
      onFetchGroup().then(skuTree => {
        this.setState({ skuTree: [].concat(skuTree) })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        data: nextProps.value,
      })
    }
  }

  addSKU = () => {
    let { data } = this.state
    data.push({
      [this.props.leafOptionValue]: [],
    })
    data = [].concat(data)
    this.setState({ data })
  }

  rebuildSKU = (sku, index) => {
    let { optionValue } = this.props
    let { data } = this.state
    if (
      data.some(
        (item, idx) => item[optionValue] === sku[optionValue] && index !== idx
      )
    ) {
      this.setState({ data })
      return false
    }
    if (data[index]) {
      data[index] = sku
    } else {
      data.push(sku)
    }
    this.setState({ data })
    console.log(data)
    this.props.onChange(data)
  }

  deleteSKU(index) {
    let { data } = this.state
    data.splice(index, 1)
    data = [].concat(data)
    this.setState({ data })
    this.props.onChange(data)
  }

  render() {
    const { maxSize, onCreateGroup, disabled, optionValue, editable } = this.props

    const { skuTree, data } = this.state
    let groupEditable = true
    let containerAddable = true
    let containerDeleteable = true
    let containerReplaceable = true
    if (typeof editable !== 'boolean') {
      groupEditable = editable.groupEditable
      containerAddable = editable.containerAddable
      containerDeleteable = editable.containerDeleteable
      containerReplaceable = editable.containerReplaceable
    } else if (editable === false) {
      groupEditable = false
      containerAddable = false
      containerDeleteable = false
      containerReplaceable = false
    }
    return (
      <div className={styles['dx-sku']} id='sku-container'>
        {data.map((item, index) => (
          <SKUGroup
            key={index}
            index={index}
            sku={item}
            skuTree={(item[optionValue] ? [item] : []).concat(skuTree.filter(item => !data.some(i => i[optionValue] === item[optionValue])))}
            onSKUChange={this.rebuildSKU}
            onSKUDelete={this.deleteSKU.bind(this, index)}
            onSKUCreate={onCreateGroup}
            leafOptionValue={this.props.leafOptionValue}
            optionValue={optionValue}
            optionText={this.props.optionText}
            childOptionValue={this.props.childOptionValue}
            childOptionText={this.props.childOptionText}
            onFetchSKU={this.props.onFetchSKU}
            onReplaceChange={this.props.onReplaceChange}
            groupEditable={groupEditable}
            containerAddable={containerAddable}
            containerDeleteable={containerDeleteable}
            containerReplaceable={containerReplaceable}
          />
        ))}
        {data.length < maxSize && groupEditable && (
          <SKUButton
            onClick={this.addSKU}
            disabled={disabled}
          />
        )}
      </div>
    )
  }
}

SKU.propTypes = {
  value: PropTypes.array,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  maxSize: PropTypes.number,
  skuTree: PropTypes.array,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onFetchGroup: PropTypes.func,
  onFetchSKU: PropTypes.func,
  onChange: PropTypes.func,
  onReplaceChange: PropTypes.func,
  editable: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
}

SKU.defaultProps = {
  value: [],
  maxSize: 3,
  skuTree: [],
  leafOptionValue: 'leaf',
  optionValue: 'id',
  optionText: 'text',
  childOptionValue: 'id',
  childOptionText: 'text',
  onFetchGroup: noopPromise,
  onFetchSKU: noopPromise,
  onChange: noop,
  onReplaceChange: noop,
  editable: true
}

export default SKU
