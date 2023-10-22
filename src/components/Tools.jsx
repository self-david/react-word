import React from 'react'
import {
  Bold,
  Italic,
  Underline,
  Super,
  Sub,
  Code,
  Strike,
  Ordered,
  Unordered,
  Left,
  Center,
  Right,
  Justify,
  BlockQuote,
  New,
  Download,
  Upload,
  Print,
} from './ElementTools.jsx'
import { cx } from '@emotion/css'

function Tools({ children, className, ...rest }) {
  return (
    <div className={cx(className, 'toolbar')} {...rest}>
      {children}
    </div>
  )
}

Tools.Bold = Bold
Tools.Italic = Italic
Tools.Underline = Underline
Tools.Super = Super
Tools.Sub = Sub
Tools.Code = Code
Tools.Strike = Strike

Tools.Ordered = Ordered
Tools.Unordered = Unordered

Tools.Left = Left
Tools.Center = Center
Tools.Right = Right
Tools.Justify = Justify
Tools.BlockQuote = BlockQuote

Tools.New = New
Tools.Download = Download
Tools.Upload = Upload
Tools.Print = Print

export default Tools
