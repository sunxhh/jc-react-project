import React, { Component } from 'react'
import { Card, Button, Table, Upload, message } from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import { isEmpty } from '../../../utils/lang'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../config'
import { getImportList, getImportProcessList } from './reduck'
import { genPagination, unshiftIndexColumn } from 'Utils/helper'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import DetailModal from './detailModal'

class Operate extends Component {
  state = {
    GOODS: false,
    PURCHASE_PLAN: false,
  }

  componentWillMount() {
    this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 }))
    this.getImportProcess(true)
    !this.interval && this.setIntervalFunc(5000)
  }

  _showModal = (type, importNo) => {
    showModalWrapper((
      <DetailModal type={type} importNo={importNo} />
    ), {
      title: type === '1' ? '成功明细' : '失败明细',
      width: '60%'
    })
  }

  setIntervalFunc = (time) => {
    this.interval = setInterval(this.getImportProcess, time)
  }

  getImportProcess = (flag) => {
    if (flag || this.interval) {
      const { dispatch } = this.props
      dispatch(getImportProcessList()).then(res => {
        if (isEmpty(res)) {
          this.interval && clearInterval(this.interval)
          this.interval = null
          this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 }))
          this.setState({
            GOODS: false,
            PURCHASE_PLAN: false,
          })
        } else if (res.length === 1) {
          this.setState({
            [res[0].modelType]: true
          })
          this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 }))
        } else {
          this.setState({
            [res[0].modelType]: true,
            [res[1].modelType]: true
          })
          this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 }))
        }
      })
    }
  }

  _columns = [
    {
      title: '模板名称',
      dataIndex: 'modelName',
    },
    {
      title: '导入进度',
      dataIndex: 'importProgress',
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
    },
    {
      title: '成功明细',
      dataIndex: 'successDetail',
      render: (text, record) => {
        return (
          <a onClick={() => this._showModal('1', record.importNo)}>成功明细查看</a>
        )
      }
    },
    {
      title: '失败明细',
      dataIndex: 'failDetail',
      render: (text, record) => {
        return (
          <a onClick={() => this._showModal('0', record.importNo)}>失败明细查看</a>
        )
      }
    },
  ]

  _getUploadProps = (modelType) => {
    return {
      // data: { modelType },
      showUploadList: false,
      withCredentials: false,
      // name: 'fileUpload',
      customRequest: info => {
        if (info.file) {
          const { onSuccess, onError, file, ...rest } = info
          rest.onSuccess = function(ret) {
            onSuccess && onSuccess(ret)
            console.log('success', ret)
            if (ret === '') {
              location.reload()
            }
          }
          rest.onError = function(err, ret) {
            onError && onError(err, ret)
            console.log('error', err)
          }
          const param = new FormData()
          const ticket = storage.get('userInfo').ticket
          param.append('file', file, file.name)
          param.append('modelType', modelType)
          param.append('ticket', ticket)
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.setState({
            [modelType]: true,
          })
          const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
          axios.post(url + '/api/supplychain/import/addImport/v1', param, config).then(res => {
            const data = res.data
            if (data.code !== 0) {
              message.error(data.errmsg)
            }
            this.setState({
              [modelType]: false,
            })
            this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 }))
          })
          // window.setTimeout(this.props.dispatch(getImportList({ currentPage: 1, pageSize: 10 })), 2500)
          this.setIntervalFunc(2500)
          // axios({

          // })
        }
      }
    }
  }

  _downLoadTemplate = (modelType) => {
    const params = parmasUtil.json2url({ modelType })
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/import/modelExport/v1?ticket=${ticket}&${params}`
    location.href = href
  }

  _handleChange = (pagination, filters, sorter) => {
    const { dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getImportList(finalFilter))
  }

  render() {
    const { page, list, showListSpin } = this.props
    const { GOODS, PURCHASE_PLAN } = this.state
    const pagination = genPagination(page)
    let finalColumns = unshiftIndexColumn(this._columns, page)
    return (
      <div>
        <Card
          style={{ marginBottom: 10 }}
          title='导入模板下载'
        >
          <Button
            type='primary'
            onClick={() => this._downLoadTemplate('GOODS')}
          >
            货物导入模板下载
          </Button>
          <Button
            type='primary'
            onClick={() => this._downLoadTemplate('PURCHASE_PLAN')}
          >
            采购计划导入模板下载
          </Button>
        </Card>
        <Card
          style={{ marginBottom: 10 }}
          title='系统导入'
        >
          <Upload {...this._getUploadProps('GOODS')} style={{ marginRight: 10 }}>
            <Button type='primary' disabled={GOODS}>货物导入</Button>
          </Upload>
          <Upload {...this._getUploadProps('PURCHASE_PLAN')}>
            <Button type='primary' disabled={PURCHASE_PLAN}>采购计划导入</Button>
          </Upload>
        </Card>
        <Table
          pagination={pagination}
          columns={finalColumns}
          onChange={this._handleChange}
          rowKey='importNo'
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgId: state.common.orgId,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,

    list: state.supplyChain.importTep.importList,
    page: state.supplyChain.importTep.importPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Operate)
