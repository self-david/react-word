import { text } from 'docxyz'
import { elementTypes } from './types'
import { FontConv, FormatConv } from './style/styleConv'

class RunTrans {
  static from(run, options) {
    const textConv = FontConv.runToText(run, options.parFontConv)
    const styleId = run._element.style
    if (styleId) {
      const { docxContext } = options
      textConv.style = docxContext.styleMap.idToFontName(styleId)
    }
    return textConv
  }

  static to(textConv, parent, options) {
    const run = parent.add_run()
    FontConv.runFromText(run, textConv)
    if (textConv.style) {
      run.style = textConv.style
    }
  }
}

class HyperlinkTrans {
  static from(hyperlink, options) {
    const children = []
    for (const run of hyperlink.runs) {
      const textConv = RunTrans.from(run, options)
      children.push(textConv)
    }
    return {
      type: elementTypes.HYPERLINK,
      url: hyperlink.target_ref,
      children,
    }
  }

  static to(element, paragraph, options) {
    const hyperlink = paragraph.add_hyperlink(element.url)
    for (const child of element.children) {
      RunTrans.to(child, hyperlink, options)
    }
  }
}

class ParagraphTrans {
  static from(paragraph, options) {
    const children = []
    const parFmt = paragraph.paragraph_format
    const parConv = FormatConv.fromStyle(parFmt)
    // save time
    const styleId = paragraph._element.style
    if (!styleId) {
      parConv.style = 'Normal'
    } else {
      const { docxContext } = options
      parConv.style = docxContext.styleMap.idToFormatName(styleId)
    }
    parConv.type = elementTypes.PARAGRAPH
    const parFont = parFmt.font
    const parFontConv = parFont ? FontConv.fromStyle(parFont) : null
    options.parFontConv = parFontConv
    for (const child of paragraph.content) {
      if (child instanceof text.Run) {
        const textConv = RunTrans.from(child, options)
        children.push(textConv)
      } else {
        const hyperlink = HyperlinkTrans.from(child, options)
        children.push(hyperlink)
      }
    }
    if (children.length === 0) {
      const textConv = { text: '', ...parFontConv }
      children.push(textConv)
    }
    parConv.children = children
    return parConv
  }

  static to(parConv, container, options) {
    const { docxContext } = options
    const paragraph = container.add_paragraph()
    const styleName = parConv.style ? parConv.style : 'Normal'
    docxContext.hasOrCloneStyle(styleName)
    paragraph.style = styleName
    FormatConv.toStyle(paragraph, parConv)
    for (const child of parConv.children) {
      if (child.type === elementTypes.HYPERLINK) {
        HyperlinkTrans.to(child, paragraph, options)
      } else {
        RunTrans.to(child, paragraph, options)
      }
    }
    return container
  }
}

export { ParagraphTrans }
