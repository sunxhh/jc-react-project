import React, { Component } from 'react'
import { message } from 'antd'
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

  componentWillReceiveProps(nextProps) {
    const { aliToken } = nextProps
    if (aliToken && !isEmpty(aliToken)) {
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
  }

  uploadPath = (file) => {
    return `${this.props.rootPath}/${file.uid}_${file.name}`
  }

  UploadToOss = (self, file) => {
    const url = this.uploadPath(file)
    return new Promise((resolve, reject) => {
      this.client(self).multipartUpload(url, file).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  beforeUpload = (file, files) => {
    const { onChange, fileList } = this.props
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.UploadToOss(this, file).then(data => {
        if (data.res.status === 200) {
          const url = data.res.requestUrls[0].split('?')[0]
          const newFileList = fileList.map((file, index) => {
            if (!file['uid']) {
              file['uid'] = index + new Date().getTime()
            }
            return file
          })
          const uid = newFileList.length + new Date().getTime()
          const resolveData = {
            fileList: newFileList.concat([{ uid, url }]),
            file: { uid, url }
          }
          onChange && onChange(resolveData)
        } else {
          onChange && onChange({ fileList })
          message.error('上传失败！')
        }
      })
    }
    return true
  }

  render() {
    return (
      <Upload
        {...this.props}
        beforeUpload={(file, fileList) => {
          if (this.props.beforeUpload) {
            return this.props.beforeUpload(file, fileList) && this.beforeUpload(file, fileList)
          } else {
            return this.beforeUpload(file, fileList)
          }
        }}
        customRequest={() => {}}
      >
        {this.props.children}
      </Upload>
    )
  }
}

export default AliUpload
