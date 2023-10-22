import React, { useState, useMemo } from 'react'
import { withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import Sheet from './Sheet.jsx'
import Tools from './Tools.jsx'
import { withHistory, withDocx, withTables } from '../utils/with'
import { documentPropTypes, documentDefaultProps } from './PropTypes'
import '../style.css'

const Document = ({ children, initialValue, onCallback, ...rest }) => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withDocx(withTables(withHistory(withReact(createEditor())))), [])

  const onChange = value => {
    setValue(value)
    onCallback(value)
  }

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange} {...rest}>
      {children}
    </Slate>
  )
}

Document.Sheet = Sheet
Document.Tools = Tools

Document.propTypes = documentPropTypes
Document.defaultProps = documentDefaultProps

export default Document
