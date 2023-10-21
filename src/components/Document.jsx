import React, { useState, useMemo, useCallback } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory, withDocx, withTables } from '../utils/with'
import Elements from '../utils/Common/Elements'
import Leaf from '../utils/Common/Leaf'
import { documentPropTypes, documentDefaultProps } from './PropTypes'
import '../style.css'

const Document = ({ className, placeholder, spellCheck, autoFocus, initialValue, ...rest }) => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withDocx(withTables(withHistory(withReact(createEditor())))), [])

  const renderElement = useCallback(props => <Elements {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <Slate editor={editor} initialValue={value} onChange={value => setValue(value)}>
      <Editable
        className={className}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck={spellCheck}
        autoFocus
        {...rest}
      />
    </Slate>
  )
}

Document.propTypes = documentPropTypes
Document.defaultProps = documentDefaultProps

export default Document
