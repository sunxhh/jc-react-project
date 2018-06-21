import React, { Component } from 'react'
import { Form, Transfer, Button } from 'antd'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import Module from './module'

class StoreCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mockData: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false
    }
  }

  // 初始化数据
  componentDidMount() {
    this.getMock()
  }
  getMock = () => {
    const { noAddCategoryList } = this.props
    const { mockData } = this.state
    const targetKeys = []
    !isEmpty(noAddCategoryList) && noAddCategoryList.map(item => (
      mockData.push({
        key: item.categoryNo,
        title: item.categoryName,
        description: item.categoryName,
      })
    ))
    this.setState({ mockData, targetKeys })
  }

  _handleChange = (targetKeys, direction, moveKeys) => {
    // console.log(targetKeys, direction, moveKeys)
    this.setState({ targetKeys })
  }

  _renderItem = (item) => {
    const customLabel = (
      <span className='custom-item'>
        {item.title}
      </span>
    )
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    }
  }

  _handleAdd = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        dispatch(Module.actions.getStoreCategoryAdd({ categoryNos: this.state.targetKeys })).then(
          this.props.onCancel && this.props.onCancel()
        ).then(status => {
          if (status) {
            dispatch(Module.actions.getStoreCategoryList({
              currentPage: 1,
              pageSize: 20,
            }))
          }
        }
        )
      }
    })
  }

  render() {
    return (
      <div className={styles['categoryManger']}>
        <div className={styles['transfer-style']}>
          <Transfer
            dataSource={this.state.mockData}
            listStyle={{
              width: 200,
              height: 200,
            }}
            targetKeys={this.state.targetKeys}
            onChange={this._handleChange}
            render={this._renderItem}
          />
        </div>
        <div className={styles['btn-style']}>
          <Button
            onClick={this.props.onCancel}
          >取消
          </Button>
          <Button
            type='primary'
            disabled={this.state.disabled}
            onClick={(e) => {
              this._handleAdd(e)
            }}
          >保存
          </Button>
        </div>
      </div>
    )
  }
}

export default Form.create()(StoreCategory)
