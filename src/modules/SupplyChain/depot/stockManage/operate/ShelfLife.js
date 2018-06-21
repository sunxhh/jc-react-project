import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isEmpty } from '../../../../../utils/lang'
import { Modal, Table, Button, InputNumber, DatePicker, message, Popconfirm, Divider } from 'antd'

class ShelfLife extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    readonly: PropTypes.bool,
    skuNo: PropTypes.string,
    goodsName: PropTypes.string,
    count: PropTypes.number,
    dataSource: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    pageType: PropTypes.string
  }
  static defaultProps = {
    readonly: false,
    goodsName: '',
    count: 0,
    dataSource: [],
  }

  constructor(props) {
    super(props)
    // initial state
    this.state = {
      dataSource: isEmpty(props.dataSource) && props.pageType !== 'INFO' ? [{
        key: `NEW_TEMP_ID_${this._index++}`,
        count: props.count,
        productionDate: null,
        shelfLife: props.shelfLife || null,
        overdue: '',
        editable: true,
        isNew: true,
      }] : props.dataSource.map(item => ({
        key: `NEW_TEMP_ID_${this._index++}`,
        count: item.count,
        productionDate: item.productionDate,
        shelfLife: item.shelfLife,
        overdue: moment(item['productionDate']).add(item['shelfLife'], 'days').format('YYYY-MM-DD'),
        editable: false,
      }))
      // .concat({
      //   key: `NEW_TEMP_ID_${this._index++}`,
      //   count: '',
      //   productionDate: null,
      //   shelfLife: '',
      //   overdue: '',
      //   editable: true,
      //   isNew: true,
      // })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this._index = 0
      this.setState({
        dataSource: nextProps.dataSource.map(item => ({
          key: `NEW_TEMP_ID_${this._index++}`,
          count: item.count,
          productionDate: item.productionDate,
          shelfLife: item.shelfLife,
          overdue: moment(item['productionDate']).add(item['shelfLife'], 'days').format('YYYY-MM-DD'),
          editable: false,
        }))
      })
    }
  }

  _columns = [
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => {
        if (!this.props.readonly && record.editable) {
          return (
            <InputNumber
              min={0}
              precision={3}
              max={99999999999.999}
              value={text}
              autoFocus
              onChange={value => this._handleCellChange(value, 'count', record.key)}
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder='数量'
            />
          )
        }
        return text
      },
    }, {
      title: '生成日期',
      dataIndex: 'productionDate',
      key: 'productionDate',
      render: (text, record) => {
        if (!this.props.readonly && record.editable) {
          return (
            <DatePicker
              value={text && moment(text)}
              onChange={(date, dateString) => this._handleCellChange(dateString, 'productionDate', record.key)}
              // onOpenChange={e => this.handleKeyPress(e, record.key)}
              placeholder='生成日期'
            />
          )
        }
        return text
      },
    }, {
      title: '保质期(天)',
      dataIndex: 'shelfLife',
      key: 'shelfLife',
      render: (text, record) => {
        if (!this.props.readonly && record.editable) {
          return (
            <InputNumber
              disabled={(this.props.shelfLife && !isEmpty(this.props.shelfLife)) ? Boolean(1) : Boolean(0)}
              min={0}
              precision={0}
              max={99999}
              maxLength='5'
              value={text}
              onChange={value => this._handleCellChange(value, 'shelfLife', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder='保质期'
            />
          )
        }
        return text
      },
    }, {
      title: '过期日期',
      dataIndex: 'overdue',
      key: 'overdue',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (this.props.readonly) {
          return null
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this._saveRow(e, record.key)}>保存</a>
                <Divider type='vertical' />
                <Popconfirm title='是否要删除此行？' onConfirm={() => this._remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            )
          }
          return (
            <span>
              <a onClick={e => this._saveRow(e, record.key)}>保存</a>
              <Divider type='vertical' />
              <a onClick={e => this._cancel(e, record.key)}>取消</a>
            </span>
          )
        }
        return (
          <span>
            <a onClick={e => this._toggleEditable(e, record.key)}>编辑</a>
            <Divider type='vertical' />
            <Popconfirm title='是否要删除此行？' onConfirm={() => this._remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      },
    }
  ]

  _index = 0 // 行索引
  _cacheOriginData = {} // 缓存待编辑数据

  _handleAdd = () => {
    const newData = this.state.dataSource.map(item => ({ ...item }))
    newData.push({
      key: `NEW_TEMP_ID_${this._index++}`,
      count: this.props.count, // modified
      productionDate: null,
      shelfLife: this.props.shelfLife || null,
      overdue: '',
      editable: true,
      isNew: true,
    })
    this.setState({ dataSource: newData })
  }

  _getRowByKey(key, newData) {
    return (newData || this.state.dataSource).filter(item => item.key === key)[0]
  }

  _toggleEditable = (e, key) => {
    e.preventDefault()
    const newData = this.state.dataSource.map(item => ({ ...item }))
    const target = this._getRowByKey(key, newData)
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this._cacheOriginData[key] = { ...target }
      }
      target.editable = !target.editable
      this.setState({ dataSource: newData })
    }
  }

  _remove(key) {
    const newData = this.state.dataSource.filter(item => item.key !== key)
    this.setState({ dataSource: newData })
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this._saveRow(e, key)
    }
  }

  _handleCellChange(value, fieldName, key) {
    const newData = this.state.dataSource.map(item => ({ ...item }))
    const target = this._getRowByKey(key, newData)
    if (target) {
      target[fieldName] = value
      if (fieldName === 'productionDate' || (fieldName === 'shelfLife' && target.productionDate)) {
        target['overdue'] = target['productionDate'] ? moment(target['productionDate']).add(target['shelfLife'], 'days').format('YYYY-MM-DD') : ''
      }
      this.setState({ dataSource: newData })
    }
  }

  total = 0
  getSum = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      this.total += parseFloat(arr[i].count)
    }
    return this.total
  }

  _saveRow(e, key) {
    e.persist()
    const { dataSource } = this.state
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false
        return
      }
      const target = this._getRowByKey(key) || {}
      if (!target.count || !target.productionDate || !target.shelfLife) {
        message.error('请填写完整保质期信息。')
        e.target.focus()
        return
      }
      const countTotal = this.getSum(dataSource)
      this.total = 0
      if (countTotal > this.props.count) {
        message.warning('各行数量之和请勿超过入库总数量！', 2)
        return
      }
      delete target.isNew
      this._toggleEditable(e, key)
    }, 500)
  }

  _cancel(e, key) {
    this.clickedCancel = true
    e.preventDefault()
    const newData = this.state.dataSource.map(item => ({ ...item }))
    const target = this._getRowByKey(key, newData)
    if (this._cacheOriginData[key]) {
      Object.assign(target, this._cacheOriginData[key])
      target.editable = false
      delete this._cacheOriginData[key]
    }
    this.setState({ dataSource: newData })
    this.clickedCancel = false
  }

  _handleOk = () => {
    const { skuNo, onOk } = this.props
    if (this.state.dataSource.some(item => item.editable)) {
      message.info('请先保存保质期信息！')
      return
    }
    onOk && onOk(skuNo, this.state.dataSource, this.props.count)
  }

  _handleCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  render() {
    const { title, visible, goodsName, count, readonly } = this.props
    console.log(this.state.dataSource)
    return visible && (
      <Modal
        title={title}
        visible={visible}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ minWidth: '60%' }}
        {...readonly ? { footer: (<Button onClick={this._handleCancel}>取消</Button>) } : { okText: '保存' }}
        destroyOnClose={true}
      >
        <div><span>SKU 名称： {goodsName} </span><span style={{ marginLeft: '10px' }}>入库总数量： {count}</span></div>
        <Table
          columns={this._columns}
          dataSource={this.state.dataSource}
          pagination={false}
          // rowClassName={(record) => {
          //   return record.editable ? styles.editable : ''
          // }}
        />
        {
          !this.props.readonly &&
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type='dashed'
              onClick={this._handleAdd}
              icon='plus'
            >新增</Button>
        }
      </Modal>
    )
  }
}

export default ShelfLife
