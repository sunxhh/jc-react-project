import React from 'react'
import PropTypes from 'prop-types'
import { Table, InputNumber, Input, Icon } from 'antd'
import { genPlanColumn } from 'Utils/helper'
import { isEmpty } from 'Utils/lang'

const NumberInitialValue = null

export default class SpecTable extends React.Component {
  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: []
  }

  state = {
    specList: [],
  }

  render() {
    const { data, handleCellChange, tableData, getFinalData } = this.props
    const finalColumns = [
      {
        title: '序号',
        dataIndex: 'rowNo',
        key: 'rowNo',
        render: (text, record, index) => index + 1
      }
    ]
    let finalDataSource = []
    if (isEmpty(data)) {
      finalDataSource = [
        {
          barNo: '',
          weight: NumberInitialValue,
          volume: NumberInitialValue,
          skuNo: '',
        }
      ]
    } else {
      finalDataSource = data.reduce((a, c) => {
        if (!c.specCatgNo) {
          return a
        }
        finalColumns.push(genPlanColumn(c.specCatgNo, c.specCatgName))
        const finalA = []
        if (isEmpty(a)) {
          c.specList.forEach(spec => {
            finalA.push({
              [c.specCatgNo]: spec.specName,
              specNo: spec.specNo,
              barNo: '',
              weight: NumberInitialValue,
              volume: NumberInitialValue,
              skuNo: '',
              skuSpecList: [
                {
                  specNo: spec.specNo,
                  specCatgNo: c.specCatgNo,
                }
              ]
            })
          })
        } else if (isEmpty(c.specList)) {
          finalA.push(...a)
        } else {
          a.forEach(item => {
            c.specList.forEach(spec => {
              finalA.push({
                ...item,
                [c.specCatgNo]: spec.specName,
                specNo: item.specNo + spec.specNo,
                barNo: '',
                weight: NumberInitialValue,
                volume: NumberInitialValue,
                skuNo: '',
                skuSpecList: [...item.skuSpecList, {
                  specNo: spec.specNo,
                  specCatgNo: c.specCatgNo,
                }]
              })
            })
          })
        }
        return finalA
      }, [])
    }

    finalDataSource = finalDataSource.map(item => {
      return {
        ...item,
        ...(tableData[item.specNo])
      }
    })

    getFinalData(finalDataSource)

    finalColumns.push(
      {
        key: 'skuNo',
        title: 'SKU 编码',
        dataIndex: 'skuNo',
        render: (text, record, index) => {
          return (
            <Input
              disabled={true}
              addonAfter={<Icon type='delete' onClick={() => handleCellChange(record.specNo, 'skuNo', '')} />}
              value={text}
              onChange={e => handleCellChange(record.specNo, 'skuNo', e.target.value)}
            />
          )
        }
      },
      {
        key: 'barNo',
        title: '条形码',
        dataIndex: 'barNo',
        render: (text, record, index) => {
          return (
            <Input
              value={text}
              maxLength='20'
              onChange={e => handleCellChange(record.specNo, ['barNo', 'skuNo'], e.target.value)}
            />
          )
        }
      },
      {
        key: 'weight',
        title: '重量（g）',
        dataIndex: 'weight',
        render: (text, record, index) => {
          return (
            <InputNumber
              min={0.001}
              precision={3}
              value={text}
              onChange={value => handleCellChange(record.specNo, 'weight', value)}
            />
          )
        }
      },
      {
        key: 'volume',
        title: '体积（cm³）',
        dataIndex: 'volume',
        render: (text, record, index) => {
          return (
            <InputNumber
              min={0.001}
              precision={3}
              value={text === 0 ? null : text}
              onChange={value => handleCellChange(record.specNo, 'volume', value)}
            />
          )
        }
      },
    )

    return (
      <Table
        // style={{ width: '75%' }}
        pagination={false}
        columns={finalColumns}
        // rowKey='skuNo'
        dataSource={finalDataSource}
      />
    )
  }
}
