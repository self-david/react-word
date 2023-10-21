import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Editable, withReact, Slate } from 'slate-react'
import { createEditor } from 'slate'
import { withHistory, withDocx, withTables } from './Document/with'
import Elements from './Document/Common/Elements'
import Leaf from './Document/Common/Leaf'
import '../style.css'

const paragraphs = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', b: true, i: true },
      { text: ' text, ' },
      { text: 'much', i: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
]

const initialValue = [
  {
    type: 'section',
    children: [
      {
        type: 'column',
        children: paragraphs,
      },
    ],
  },
]

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

Document.propTypes = {
  /**
   * string of classes
   */
  className: PropTypes.string,
  placeholder: PropTypes.string,
  spellCheck: PropTypes.bool,
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.array,
}

Document.defaultProps = {
  initialValue,
  placeholder: 'Enter some rich text…',
  spellCheck: false,
  autoFocus: true,
}

export default Document
