import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const showModalWrapper = (component, params = {}) => {
  const maskDiv = document.createElement('div')
  maskDiv.setAttribute('class', 'mask-div')
  document.body.appendChild(maskDiv)

  const _close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv)
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv)
    }
  }

  class ModalWrapper extends React.Component {
    render() {
      return (
        <LocaleProvider locale={zhCN}>
          <Modal
            visible={true}
            onCancel={_close}
            maskClosable={false}
            footer={null}
            {...params}
          >
            {React.cloneElement(component, {
              onCancel: _close,
            })}
          </Modal>
        </LocaleProvider>
      )
    }
  }

  ReactDOM.render(
    React.createElement(ModalWrapper),
    maskDiv
  )
}

export { showModalWrapper }
