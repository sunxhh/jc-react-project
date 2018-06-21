import React from 'react'
import PropTypes from 'prop-types'
import { Select, Row, Icon } from 'antd'
import { getSpecDetailList } from '../spec/reduck'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const Option = Select.Option

export default class SpecItem extends React.Component {
  static propTypes = {
    catgList: PropTypes.array,
    data: PropTypes.object,
    selected: PropTypes.array,
    dispatch: PropTypes.func,
    onCatgChange: PropTypes.func,
    onSpecChange: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    catgList: [],
    data: {}
  }

  state = {
    specList: [],
  }

  componentWillMount() {
    const { data } = this.props
    if (data && !isEmpty(data) && data.specCatgNo) {
      this.props.dispatch(getSpecDetailList({ specCatgNo: data.specCatgNo }))
        .then(res => {
          this.setState({
            specList: res
          })
        })
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.key !== this.props.key)
  // }

  _handleCatgChange = value => {
    const { data, dispatch, onCatgChange } = this.props
    if (data.specCatgNo === value || !value) {
      return
    }

    onCatgChange && onCatgChange(this.props.catgList.filter(item => value.includes(item.specCatgNo)))
    dispatch(getSpecDetailList({ specCatgNo: value }))
      .then(res => {
        this.setState({
          specList: res
        })
      })
  }

  _handleSpecChange = value => {
    const { onSpecChange } = this.props
    onSpecChange && onSpecChange(this.state.specList.filter(item => value.includes(item.specNo)))
  }

  // _handleSave = () => {
  //   const { onSave } = this.props
  //   onSave && onSave()
  // }

  _handleDelete = () => {
    const { data, onDelete } = this.props
    onDelete && onDelete(data.specCatgNo)
  }

  render() {
    const { catgList, data, selected } = this.props

    const finalCatgList = catgList.filter(catg => !selected.filter(s => s !== data.specCatgNo).includes(catg.specCatgNo)) // 删除已选中的类型
    const { specList } = this.state
    return (
      <Row>
        <div
          id='specCatgNo'
          style={{ position: 'relative' }}
        >
          <Select
            optionFilterProp='children'
            showSearch
            style={{ width: 220 }}
            placeholder='选择规格类别'
            onChange={this._handleCatgChange}
            data={data.specCatgNo}
            value={data.specCatgNo || undefined}
            getPopupContainer={() => document.getElementById('specCatgNo')}
          >
            {
              finalCatgList.map(item => {
                return (
                  <Option
                    key={item.specCatgNo}
                    value={item.specCatgNo}
                  >
                    { item.specCatgName }
                  </Option>
                )
              })
            }
          </Select>
        </div>
        <div className={styles['properties-wrapper']}>
          <div style={{ display: 'inline-block', width: '50%' }}>
            <Select
              showSearch={true}
              mode='multiple'
              placeholder='点此添加规格'
              allowClear={true}
              onChange={this._handleSpecChange}
              value={data.specList.map(item => item.specNo)}
              optionFilterProp='children'
              getPopupContainer={() => document.getElementById('specCatgNo')}
            >
              {
                specList.map(item => {
                  return (
                    <Option
                      key={item.specNo}
                      value={item.specNo}
                    >
                      { item.specName }
                    </Option>
                  )
                })
              }
            </Select>
          </div>
          <Icon
            type='close-circle-o'
            className={styles['properties-delete']}
            onClick={this._handleDelete}
          />
        </div>
      </Row>
    )
  }
}
