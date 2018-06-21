import React, { Component } from 'react'
import { message, Upload as DefaultUpload } from 'antd'
import PropTypes from 'prop-types'
import { isEmpty } from 'Utils/lang'
import Upload from './index'

class AliUpload extends Component {
  static propTypes = {
    aliToken: PropTypes.object.isRequired,
    bucket: PropTypes.string,
    dealResult: PropTypes.func.isRequired,
    beforeUpload: PropTypes.func,
    rootPath: PropTypes.string,
  }

  static defaultProps = {
    aliToken: {},
    bucket: '',
    dealResult: () => {},
    rootPath: 'default'
  }

  constructor(props) {
    super(props)
    const { aliToken } = props
    if (aliToken && !isEmpty(aliToken)) {
      this._initOssWrapper(aliToken)
    }
  }

  _initOssWrapper = (aliToken) => {
    this.client = (self) => {
      const token = aliToken
      return new OSS.Wrapper({
        accessKeyId: token.accessKeyId,
        accessKeySecret: token.accessKeySecret,
        stsToken: token.securityToken,
        region: 'oss-cn-shanghai',
        bucket: this.props.bucket || 'supply-dev-bucket',
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { aliToken } = nextProps
    if (!this.client && aliToken && !isEmpty(aliToken)) {
      this._initOssWrapper(aliToken)
    }
  }

  uploadPath = (file) => {
    return `${this.props.rootPath}/${file.uid}_${file.name}`
  }

  UploadToOss = (self, file, onError) => {
    const url = this.uploadPath(file)
    return new Promise((resolve, reject) => {
      this.client(self).multipartUpload(url, file).then(data => {
        resolve(data)
      }).catch(error => {
        onError(error)
        reject(error)
      })
    })
  }

  beforeUpload = (file, fileList) => {
    const { aliToken } = this.props
    if (new Date().getTime() > aliToken.expirationTimeStamp) {
      message.error('上传凭据失效，2s后将刷新页面')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
    return true
  }

  render() {
    const ExUpload = this.props.defaultUpload ? DefaultUpload : Upload
    return (
      <ExUpload
        {...this.props}
        beforeUpload={(file, fileList) => {
          if (this.props.beforeUpload) {
            return this.props.beforeUpload(file, fileList) && this.beforeUpload(file, fileList)
          } else {
            return this.beforeUpload(file, fileList)
          }
        }}
        customRequest={({ file, onSuccess, onError }) => {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            this.UploadToOss(this, file, onError).then(data => {
              if (data.res.status === 200) {
                onSuccess({ ...data.res, url: data.res.requestUrls[0].split('?')[0] })
              } else {
                onError(data.error)
                message.error('上传失败！')
              }
            })
          }
        }}
      >
        {this.props.children}
      </ExUpload>
    )
  }
}

export default AliUpload
