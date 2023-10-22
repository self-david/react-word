import React, { useRef } from 'react'
import { useSlate } from 'slate-react'
import { Transforms } from 'slate'
import { DownloadProps, DownloadDefaultProps } from './PropTypes'
import { toggleMark, isMarkActive, toggleBlock, isBlockActive, textAlignTypes } from '../utils/tools'
import saveAs from 'file-saver'
import { cx } from '@emotion/css'

const Element = ({ children, title, className, format, ...rest }) => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)

  return (
    <div
      title={title}
      onClick={() => toggleMark(editor, format)}
      className={cx(isActive ? 'tool-active' : 'tool-inactive', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

const Block = ({ children, title, className, format, ...rest }) => {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format, textAlignTypes.includes(format) ? 'alignment' : 'type')

  return (
    <div
      title={title}
      onClick={() => toggleBlock(editor, format, isActive)}
      className={cx(isActive ? 'tool-active' : 'tool-inactive', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export const Bold = props => <Element {...props} format='b' />
export const Italic = props => <Element {...props} format='i' />
export const Underline = props => <Element {...props} format='underline' />
export const Super = props => <Element {...props} format='superscript' />
export const Sub = props => <Element {...props} format='subscript' />
export const Code = props => <Element {...props} format='code' />
export const Strike = props => <Element {...props} format='strike' />

export const Ordered = props => <Block {...props} format='numbered-list' />
export const Unordered = props => <Block {...props} format='bulleted-list' />

export const Left = props => <Block {...props} format='left' />
export const Center = props => <Block {...props} format='center' />
export const Right = props => <Block {...props} format='right' />
export const Justify = props => <Block {...props} format='justify' />
export const BlockQuote = props => <Block {...props} format='block-quote' />

export const New = ({ ...rest }) => {}

export const Download = ({ fileName = 'demo', ...props }) => {
  const editor = useSlate()
  const onClick = () => {
    const buffer = editor.saveDocx()
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, `${fileName}.docx`)
  }

  return <div {...props} onClick={onClick} />
}

export const Upload = ({ children, ...rest }) => {
  const inputRef = useRef(null)
  const editor = useSlate()

  const onClick = () => inputRef.current.click()

  const handleFileChange = event => {
    const file = event.target.files && event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      Transforms.deselect(editor)
      editor.loadDocx(this.result)
    }

    event.target.value = null
  }

  return (
    <div {...rest} onClick={onClick}>
      <input style={{ display: 'none' }} ref={inputRef} type='file' accept='.docx' onChange={handleFileChange} />
      {children}
    </div>
  )
}

export const Print = ({ ...rest }) => {}

Download.propTypes = DownloadProps
Download.defaultProps = DownloadDefaultProps
