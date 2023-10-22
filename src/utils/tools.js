import { Editor, Transforms, Element as SlateElement } from 'slate'

export const textAlignTypes = ['left', 'center', 'right', 'justify']
const listTypes = ['numbered-list', 'bulleted-list']

export const toggleMark = (editor, format) => {
  const runMarks = Editor.marks(editor)
  const parMarks = getParMarks(editor)
  const runMark = runMarks[format]
  const parMark = parMarks[format]
  if (runMark === true) {
    if (parMark) {
      Editor.addMark(editor, format, false)
    } else {
      Editor.removeMark(editor, format)
    }
  } else if (runMark === false) {
    if (parMark) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  } else {
    if (parMark) {
      Editor.addMark(editor, format, false)
    } else {
      Editor.addMark(editor, format, true)
    }
  }
}

export const toggleBlock = (editor, format, isActive) => {
  const isList = listTypes.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      listTypes.includes(n.type) &&
      !textAlignTypes.includes(format),
    split: true,
  })

  let newProperties
  // once toggled, add new style properties to selected block
  if (textAlignTypes.includes(format)) {
    newProperties = {
      alignment: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  // set node with updated properties
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

function getParMarks(editor) {
  let marks = {}
  const { selection } = editor
  if (selection) {
    const [matchParagraph] = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n) && n.type === 'paragraph',
    })
    if (matchParagraph) {
      const styleName = matchParagraph[0].style
      // console.log('match paragraph', matchParagraph[0])
      marks = editor.getFont(styleName)
    }
    const [matchText] = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && n.text && n.style,
    })
    if (matchText) {
      const styleName = matchText[0].style
      const runMarks = editor.getFont(styleName)
      marks = { ...marks, ...runMarks }
    }
  }
  return marks
}

export const isMarkActive = (editor, format) => {
  const runMarks = Editor.marks(editor)
  const parMarks = getParMarks(editor)
  const marks = { ...parMarks, ...runMarks }
  return marks ? marks[format] === true : false
}

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  // const [match] = Array.from(
  //   Editor.nodes(editor, {
  //     at: Editor.unhangRange(editor, selection),
  //     match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'paragraph' && n[blockType] === format,
  //   }),
  // )

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  )

  return !!match
}
