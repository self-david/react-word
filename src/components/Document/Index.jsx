import React, { useState, useMemo, useCallback } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import { Transforms, createEditor, Range } from 'slate'
import { withHistory, withDocx, withTables } from './with'
import Elements from './Common/Elements'
import Leaf from './Common/Leaf'
import './style.css'

// const initialValue = [
//   {
//     children: [{ text: 'This is editable plain text, just like a <textarea>!' }],
//   },
// ]

const paragraphs = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', b: true },
      { text: ' text, ' },
      { text: 'much', i: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', b: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'paragraph',
    style: 'Intense Quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'left',
    children: [{ text: 'Try it out for yourself!' }],
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

const Document = ({ ...rest }) => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withDocx(withTables(withHistory(withReact(createEditor())))), [])

  const renderElement = useCallback(props => <Elements {...props} />, [])

  // to handle rendering leaves
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <div>
      <Slate
        className=''
        editor={editor}
        initialValue={value}
        // value={value}
        onChange={value => setValue(value)}
      >
        <Editable
          className='page'
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder='Enter some rich text…'
          // spellCheck={false}
          // autoFocus
          // className='holi'
          // {...rest}
        />
      </Slate>
    </div>
  )
}

export default Document
