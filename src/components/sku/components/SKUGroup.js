import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, Icon } from 'antd'
import SKUContainer from './SKUContainer'
import styles from '../index.less'

const noop = res => res
const Option = Select.Option

class SKUGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skuOptions: [],
    }
  }

  componentWillMount() {
    let { sku, optionValue } = this.props
    sku[optionValue] && this.fetchLeafById(sku[optionValue])
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sku !== nextProps.sku) {
      let { optionValue } = this.props
      nextProps.sku[optionValue] && this.fetchLeafById(nextProps.sku[optionValue])
    }
  }

  // 选择sku
  selectSKUHandler = (value, option) => {
    let { index, onSKUChange, optionValue, optionText, leafOptionValue } = this.props
    const sku = { [optionValue]: value, [optionText]: option.props.children, [leafOptionValue]: [] }
    if (sku[optionValue] === this.props.sku[optionValue]) return
    this.fetchLeafById(value).then(res => {
      if (sku[optionValue]) {
        onSKUChange(sku, index)
        return
      }
    })
  }

  fetchLeafById(id) {
    return this.props.onFetchSKU(id).then(skuOptions => {
      this.setState({
        skuOptions
      })
    })
  }

  onSKULeafChange = leaf => {
    let { sku, index, onSKUChange, leafOptionValue } = this.props
    sku[leafOptionValue] = leaf
    onSKUChange(sku, index)
  }

  rebuildSKULeaf(sku, index) {
    let { subGroup } = this.state
    if (subGroup[index]) {
      subGroup[index][this.props.leafOptionValue] = [].concat(sku)
    }
    this.setState({ subGroup })
    this.props.onChange(subGroup)
  }

  checkSKU = evt => {
    let { sku, index, onSKUChange } = this.props
    onSKUChange(sku, index)
  }

  render() {
    let { sku, skuTree, optionValue, optionText, groupEditable, containerAddable, containerReplaceable } = this.props

    return (
      <div>
        <div className={styles['dx-sku-group']}>
          <Select
            style={{ width: 240 }}
            onSelect={this.selectSKUHandler}
            showSearch
            optionFilterProp='children'
            value={sku[optionValue] || undefined}
            placeholder='请选择'
            disabled={!groupEditable}
            getPopupContainer={() => document.getElementById('sku-container')}
          >
            {skuTree.map((item, index) => (
              <Option key={item[optionValue]} value={item[optionValue]}>{item[optionText]}</Option>
            ))}
          </Select>
          {groupEditable && (
            <Icon
              onClick={this.props.onSKUDelete}
              style={{ padding: 4, borderRadius: '50%', background: '#fff', color: '#000' }}
              type='close'
            />
          )}
        </div>
        <SKUContainer
          index={this.props.index}
          sku={sku}
          onSKULeafChange={this.onSKULeafChange}
          skuOptions={this.state.skuOptions}
          {...this.props}
          containerAddable={containerAddable}
          containerReplaceable={containerReplaceable}
        />
      </div>
    )
  }
}

SKUGroup.propTypes = {
  index: PropTypes.number,
  sku: PropTypes.object.isRequired,
  onSKUDelete: PropTypes.func,
  onSKUChange: PropTypes.func,
}

SKUGroup.defaultProps = {
  index: 0,
  data: {},
  onSKUDelete: noop,
  onSKUChange: noop,
}

export default SKUGroup
