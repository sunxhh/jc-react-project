import React, { Component } from 'react'
// import { Select } from 'antd'
import { Select, Tag, Icon, Popover, Button, Dropdown, Menu } from 'antd'

import styles from '../index.less'

const Option = Select.Option
const MenuItem = Menu.Item

class SKUContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leafValue: [],
      popoverVisible: false
    }
  }

  resetLeaf = (visible) => {
    this.setState({ leafValue: [] })
  }

  selectSKU = () => {
    let { sku, childOptionValue, childOptionText, leafOptionValue } = this.props
    let { leafValue } = this.state
    const skuLeaf = leafValue.map(item => {
      return {
        [childOptionValue]: item.key,
        [childOptionText]: item.label,
      }
    })
    // const skuLeaf = this.skuLeaf.state.selectedItems.map((item, key) => {
    //   item[childOptionValue] = item.value || leafValue[key]
    //   delete item.cid
    //   return item
    // })
    let skuLeafIds = sku[leafOptionValue].map(item => item[childOptionValue])
    skuLeaf.forEach(item => {
      if (skuLeafIds.indexOf(item[childOptionValue]) < 0) {
        sku[leafOptionValue].push(item)
      }
    })
    this.resetLeaf()
    this.props.onSKULeafChange(sku[leafOptionValue])
  }

  removeSKULeaf(e, idx) {
    e.stopPropagation()
    let { sku, leafOptionValue } = this.props
    const leaves = sku[leafOptionValue].filter((item, index) => idx !== index)
    this.props.onSKULeafChange(leaves)
  }

  createSKULeaf = (leaf) => {
    this.setState({
      leafValue: [].concat(this.state.leafValue, [leaf]),
    })
  }

  deSelectSKULeaf = (leaf) => {
    this.setState({
      leafValue: this.state.leafValue.filter(item => item.key !== leaf.key)
    })
  }

  updateLeafValue = sku => {
    let { optionValue } = this.props
    let { leafValue } = this.state
    leafValue = leafValue.filter(item => item !== sku[optionValue])
    this.setState({ leafValue: [].concat(leafValue) })
  }

  renderSKUPopContent(mode) {
    let { childOptionValue, childOptionText, skuOptions, sku, leafOptionValue } = this.props
    const extProps = mode ? { mode: 'multiple' } : {}
    if (!this.state.popoverVisible) {
      return null
    }
    return (
      <Select
        style={{ width: 240, marginBottom: 8 }}
        {...extProps}
        ref={skuLeaf => (this.skuLeaf = skuLeaf)}
        showSearch
        labelInValue
        optionFilterProp='children'
        onSelect={this.createSKULeaf}
        onDeselect={this.deSelectSKULeaf}
        placeholder='请选择'
        getPopupContainer={() => document.getElementById('sku-container')}
      >
        {skuOptions.filter(item => !sku[leafOptionValue].some(i => i[childOptionValue] === item[childOptionValue])).map(item => (
          <Option key={item[childOptionValue]} value={item[childOptionValue]}>{item[childOptionText]}</Option>
        ))}
      </Select>
    )
  }

  _handlePopoverClick = type => {
    if (type === 1) {
      this.selectSKU()
    }
    this.setState({
      popoverVisible: false,
      leafValue: []
    })
  }

  _renderPopoverContent = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button size='small' onClick={() => this._handlePopoverClick(0)}>取消</Button>
        <Button size='small' type='primary' onClick={() => this._handlePopoverClick(1)}>确认</Button>
      </div>
    )
  }

  _replaceLeaf = (index, leaf) => {
    const { sku, onSKULeafChange, leafOptionValue, onReplaceChange } = this.props
    const spliceItem = sku[leafOptionValue].splice(index, 1, leaf)
    onSKULeafChange(sku[leafOptionValue])
    onReplaceChange(spliceItem[0], leaf)
  }

  _renderLeafMenu = (index) => {
    let { childOptionValue, childOptionText, skuOptions, sku, leafOptionValue } = this.props
    return (
      <Menu style={{ maxHeight: 300, overflow: 'auto' }}>
        {skuOptions.filter(item => !sku[leafOptionValue].some(i => i[childOptionValue] === item[childOptionValue])).map(item => {
          return (
            <MenuItem key={item[childOptionValue]}>
              <span onClick={() => this._replaceLeaf(index, item)}>{item[childOptionText]}</span>
            </MenuItem>
          )
        })}
      </Menu>
    )
  }

  _onBlurHandler = () => {
    this.setState({ popoverVisible: false, leafValue: [] })
  }

  _onClickHandler(e) {
    e.nativeEvent.stopImmediatePropagation()
  }

  componentDidMount() {
    document.addEventListener('click', this._onBlurHandler, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onBlurHandler, false)
  }

  render() {
    let { childOptionValue, childOptionText, sku, optionValue, skuOptions, containerReplaceable, containerAddable, containerDeleteable, leafOptionValue } = this.props

    return (
      <div className={styles['dx-sku-container']}>
        <div className='sku-list'>
          {sku[leafOptionValue].map((item, index) => {
            return containerReplaceable ? (
              <Dropdown
                key={item[childOptionValue]}
                trigger={['click']}
                overlay={this._renderLeafMenu(index)}
                getPopupContainer={() => document.getElementById('sku-container')}
              >
                <Tag
                  color='#2db7f5'
                  closable={containerDeleteable}
                  onClose={(e) => this.removeSKULeaf(e, index)}
                >{item[childOptionText]}
                </Tag>
              </Dropdown>
            ) : (
              <Tag
                key={item[childOptionValue]}
                color='#2db7f5'
                closable={containerDeleteable}
                onClose={(e) => this.removeSKULeaf(e, index)}
              >{item[childOptionText]}
              </Tag>
            )
          })}
          <span onClick={this._onClickHandler}>
            {sku[optionValue] && containerAddable && sku[leafOptionValue].length < skuOptions.length ? (
              <Popover
                ref={leafPopover => (this.leafPopover = leafPopover)}
                trigger='click'
                placement='bottomLeft'
                title={this.renderSKUPopContent('multiple')}
                content={this._renderPopoverContent()}
                visible={this.state.popoverVisible}
                getPopupContainer={() => document.getElementById('sku-container')}
              >
                <Tag
                  onClick={() => this.setState({ popoverVisible: true })}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type='plus' /> 添加
                </Tag>
              </Popover>
            ) : null}
          </span>
        </div>
      </div>
    )
  }
}

export default SKUContainer
