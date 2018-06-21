import React from 'react'
import {
  RichUtils,
  EditorState,
  // convertToRaw,
  // convertFromRaw
} from 'draft-js'
// import { setBlockData } from 'draftjs-utils'
import PropTypes from 'prop-types'
import Dropdown from './dropdown'
import DropdownOption from './dropdownOption'
import marginDropIcon from '../../assets/images/margin.png'

class CustomMarginComp extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  _onChange = (size) => {
    const { editorState, onChange } = this.props
    const myEditorState = RichUtils.toggleBlockType(editorState, 'margin-bottom-' + size)
    onChange(EditorState.push(editorState, myEditorState.getCurrentContent(), 'change-block-margin' + size))
  }

  render() {
    return (
      <Dropdown
        expanded={this.state.expanded}
        onExpandEvent={() => {
          this.setState({
            expanded: !this.state.expanded
          })
        }}
        onblur={() => {
          if (this.state.expanded) {
            this.setState({
              expanded: false
            })
          }
        }}
        onChange={(value) => this._onChange(value)}
        doCollapse={() => this.setState({ expanded: false })}
      >
        <div>
          <img
            style={{ width: 16, marginRight: 20 }}
            key='custom'
            src={marginDropIcon}
            title='行间距'
          />
        </div>
        <DropdownOption value={0}>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
        <DropdownOption value={5}>5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
        <DropdownOption value={10}>10&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
        <DropdownOption value={15}>15&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
        <DropdownOption value={20}>20&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
        <DropdownOption value={25}>25&nbsp;&nbsp;&nbsp;&nbsp;</DropdownOption>
      </Dropdown>
    )
  }
}

export default CustomMarginComp
