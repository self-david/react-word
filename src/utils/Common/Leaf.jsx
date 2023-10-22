import React from 'react'
import { Editor, Element as SlateElement } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { FontConv } from '../style/styleConv'

const Leaf = props => {
  let { attributes, children, leaf, text } = props
  let font = leaf
  const editor = useSlate()
  const path = ReactEditor.findPath(editor, text)
  const [matchParagraph] = Editor.nodes(editor, {
    at: path,
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'paragraph',
  })
  // console.log(matchParagraph, 'match');
  if (matchParagraph) {
    const parent = matchParagraph[0]
    const styleName = parent.style
    const parFont = editor.getFont(styleName)
    let runFont = {}
    if (text.style) {
      runFont = editor.getFont(text.style)
    }
    font = { ...parFont, ...runFont, ...leaf }
  }

  if (font.strike) {
    children = <s>{children}</s>
  }
  if (leaf.code) {
    children = <code>{children}</code>
  }
  if (font.superscript) {
    children = <sup>{children}</sup>
  }
  if (font.subscript) {
    children = <sub>{children}</sub>
  }
  const style = FontConv.toStyleObj(font)
  return (
    <span style={style} {...attributes}>
      {children}
    </span>
  )
}

export default Leaf
