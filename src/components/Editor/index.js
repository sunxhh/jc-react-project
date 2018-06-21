import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'react-redux'
// import Immutable from 'immutable'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import axios from 'axios'
import styles from './style.less'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
// import CustomMarginComp from './customMarginComp'

// function setCaretPosition(tObj, sPos) {
//   if (tObj.setSelectionRange) {
//     setTimeout(function() {
//       tObj.setSelectionRange(sPos, sPos)
//       tObj.focus()
//     }, 0)
//   } else if (tObj.createTextRange) {
//     const rng = tObj.createTextRange()
//     rng.move('character', sPos)
//     rng.select()
//   }
// }

// class CustomMarginBlock extends Component {
//   render() {
//     return [
//       React.Children.map(this.props.children, (option, index) => {
//         return React.cloneElement(
//           option, {
//             style: { marginBottom: this.props.size + 'em' }
//           }
//         )
//       })
//     ]
//   }
// }
//
// class CustomLineHeightBlock extends Component {
//   render() {
//     return [
//       React.Children.map(this.props.children, (option, index) => {
//         return React.cloneElement(
//           option, {
//             style: { lineHeight: this.props.size }
//           }
//         )
//       })
//     ]
//   }
// }

// const blockRenderMap = Immutable.Map({
//   'margin-bottom-0': {
//     element: 'div',
//     wrapper: <CustomMarginBlock size={0} />,
//   },
//   'margin-bottom-5': {
//     // element is used during paste or html conversion to auto match your component;
//     // it is also retained as part of this.props.children and not stripped out
//     element: 'div',
//     wrapper: <CustomMarginBlock size={1.2} />,
//   },
//   'margin-bottom-10': {
//     element: 'div',
//     wrapper: <CustomMarginBlock size={1.4} />,
//   },
//   'margin-bottom-15': {
//     element: 'div',
//     wrapper: <CustomMarginBlock size={1.6} />,
//   },
//   'margin-bottom-20': {
//     element: 'div',
//     wrapper: <CustomMarginBlock size={1.8} />,
//   },
//   'margin-bottom-25': {
//     element: 'div',
//     wrapper: <CustomMarginBlock size={2} />,
//   },
//   'line-height-1': {
//     element: 'div',
//     wrapper: <CustomLineHeightBlock size={1} />,
//   },
//   'line-height-1.5': {
//     element: 'div',
//     wrapper: <CustomLineHeightBlock size={1.5} />,
//   },
//   'line-height-2': {
//     element: 'div',
//     wrapper: <CustomLineHeightBlock size={2} />,
//   },
// })

class EditorDraft extends Component {
  constructor(props) {
    super(props)
    let editorState = EditorState.createEmpty()
    if (this.props.value) {
      const blocksFromHtml = htmlToDraft(this.props.value)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      editorState = EditorState.createWithContent(contentState)
    }
    this.state = {
      editorState
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.value && nextProps.value) {
      const blocksFromHtml = htmlToDraft(nextProps.value)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({
        editorState: EditorState.moveFocusToEnd(editorState)
      })
    }
  }

  // componentDidMount() {
  //   const { dispatch } = this.props
  //   dispatch(getQiniuToken())
  // }

  _uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('token', this.props.token)

      return axios({
        url: 'http://upload.qiniu.com',
        method: 'post',
        data: fd,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).then(({ data }) => {
        if (data) {
          resolve({
            data: {
              link: 'https://mallimg.easybao.com/' + data.key,
              title: '图片'
            }
          })
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState: editorState,
    })
    this.triggerChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    let finalChangedValue = changedValue
    finalChangedValue = finalChangedValue.replace(/\<p\>/g, '').replace(/\<\/\p\>/g, '').replace(/[\r\n]/g, '').trim()
    const onChange = this.props.onChange
    if (onChange) {
      onChange(finalChangedValue ? changedValue : null)
    }
  }

  render() {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          wrapperId='test'
          localization={{
            locale: 'zh',
          }}
          editorState={editorState}
          wrapperClassName={styles['wysiwyg-wrapper']}
          editorClassName={styles['wysiwyg-editor']}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: this._uploadCallback,
            },
            textAlign: {
              inDropdown: true
            }
          }}
          // toolbarCustomButtons={[<CustomMarginComp key='customOption' />]}
          // blockRenderMap={extendedBlockRenderMap}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorDraft)

