import React from 'react'
import { Icon, Upload, Button, message } from 'antd'
import moment from 'moment'
import { isEmpty } from 'Utils/lang'
import PropTypes from 'prop-types'
import styles from './styles.less'
import { maternityUrl } from '../../../config'

export default class UploadList extends React.Component {
  static propTypes = {
    fileListDisplay: PropTypes.array,
    setFileList: PropTypes.func,
    isShow: PropTypes.bool
  }

  static defaultProps = {
    isShow: false
  }

  constructor(props) {
    super(props)
    this.state = {
      fileLoading: false,
      hasInit: false,
      fileListDisplay: [], // 后端接口返回的附件列表
      fileList: [], // 组件内部提交至后端的附件列表
      deleteFiles: []
    }
  }

  componentWillReceiveProps(nextProps) {
    let { hasInit } = this.state
    const { fileListDisplay } = nextProps
    let fileList = []
    let fileLength = fileListDisplay.length
    if (!hasInit && fileListDisplay && fileLength > 0) {
      if (moment(fileListDisplay[0].uploudTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) {
        fileList = fileListDisplay[0].fileDTO || []
        fileListDisplay.splice(0, 1)
      }
      this.setState({ hasInit: true, fileListDisplay, fileList })
    }
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const picTypeArr = ['application/pdf']
    const isPdf = picTypeArr.indexOf(file.type) !== -1
    const isLt10M = file.size / 1024 / 1024 < 10
    !isLt10M && message.error('请上传10M以下的合同!')
    !isPdf && message.error('请上传pdf文件!')
    return isLt10M && isPdf
  }

  // 合同上传loading效果
  _handleFileChange = (info) => {
    const { fileList } = this.state
    if (info.file.status === 'uploading') {
      this.setState({ fileLoading: true })
    } else if (info.file.status === 'done') {
      let data = info.file.response.data
      fileList.push({
        fileUrl: data.fileUrl,
        fileName: info.file.name,
        serverPath: data.serverPath
      })
      this.setState({ fileLoading: false, fileList }, this._syncState)
    }
  }

  // 同步状态至父级组件
  _syncState = () => {
    const { setFileList } = this.props
    let { deleteFiles, fileList } = this.state
    let filterFiles = fileList.filter((file) => {
      return file.fileId === undefined
    })
    setFileList([
      ...deleteFiles,
      ...filterFiles
    ])
  }

  // 删除附件
  _handleFileDelete = (file, fileIndex, dateIndex) => {
    let { deleteFiles, fileList, fileListDisplay } = this.state
    let isTodayFile = fileList.some((data) => {
      return data.fileId === file.fileId
    })
    let param = {}

    if (file.fileId && !isTodayFile) {
      fileListDisplay[dateIndex].fileDTO.splice(fileIndex, 1)
      // 删除已存在的
      this.setState({
        fileListDisplay,
        deleteFiles: [
          ...deleteFiles,
          { fileId: file.fileId }
        ]
      }, this._syncState)
    } else {
      fileList.splice(fileIndex, 1)
      param['fileList'] = fileList
      if (file.fileId && isTodayFile) {
        param['deleteFiles'] = [
          ...deleteFiles,
          { fileId: file.fileId }
        ]
      }
      this.setState(param, this._syncState)
    }
  }

  // 生成子附件
  _generateFileItem = (file, fileIndex, dateIndex) => {
    const { isShow } = this.props
    return (
      <div key={fileIndex} className='ant-upload-list-item'>
        <div className='ant-upload-list-item-info'>
          <a href={`${file.serverPath}${file.fileUrl}`} target='_blank'>
            <i className='anticon anticon-paper-clip' />
            <span
              className='ant-upload-list-item-name'
              title={file.fileName}
            >
              {file.fileName}
            </span>
          </a>
        </div>
        {
          !isShow &&
          <i
            title='删除文件'
            className='anticon anticon-cross'
            onClick={() => { this._handleFileDelete(file, fileIndex, dateIndex) }}
          />
        }
      </div>
    )
  }

  render() {
    const { isShow } = this.props
    const { fileLoading, fileList, fileListDisplay } = this.state
    return (
      <div className={styles['contract-upload-wrapper']}>
        {
          !isShow &&
          <Upload
            action={`${maternityUrl}/api/carecenter/web/contract/fileUpload`}
            beforeUpload={this._beforeUpload}
            onChange={this._handleFileChange}
            showUploadList={false}
            className='ant-col-offset-8'
          >
            <Button className={styles['contract-upload-btn']}>
              <Icon type={fileLoading ? 'loading' : 'plus'} />
              <p className={styles['ant-upload-text']} >上传合同</p>
            </Button>
          </Upload>
        }
        {
          !isEmpty(fileList) &&
          <div
            style={{ paddingTop: '30px' }}
          >
            <h4>当天上传纸质合同</h4>
            {
              fileList.map((file, fileIndex) => {
                return (
                  this._generateFileItem(file, fileIndex)
                )
              })
            }
          </div>
        }
        {
          !isEmpty(fileListDisplay) &&
          fileListDisplay.map((filesWrapper, dateIndex) => {
            return (
              <div
                style={{ paddingTop: '30px' }}
                key={dateIndex}
              >
                {
                  !isEmpty(filesWrapper.fileDTO) &&
                    <div>
                      <h4>{`${filesWrapper.uploudTime}上传纸质合同`}</h4>
                      {
                        filesWrapper.fileDTO.map((file, fileIndex) => {
                          return (
                            this._generateFileItem(file, fileIndex, dateIndex)
                          )
                        })
                      }
                    </div>
                }
                
              </div>
            )
          })
        }
      </div>
    )
  }
}
