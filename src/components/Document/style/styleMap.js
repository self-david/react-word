import { css } from '@emotion/css'
import { FontConv, FormatConv } from './styleConv'
import { TableStyleConv } from './tblStyleConv'
import { FormatConvMap, FontConvMap, TableStyleConvMap } from './styleConvMap'

class StyleMap {
  constructor(styles, numberingMap) {
    this.styles = styles
    this.numberingMap = numberingMap

    this.nameToCss = new Map()

    this.formatConvMap = new FormatConvMap(this)
    this.fontConvMap = new FontConvMap(this)
    this.tableStyleConvMap = new TableStyleConvMap(this)

    this.loadStyles()
    this.loadDefaults()
  }

  loadStyles() {
    for (const style of this.styles) {
      const type = style.type
      if (type === 1) {
        const formatConv = new FormatConv(style, this)
        this.formatConvMap.addConv(formatConv)
      } else if (type === 2) {
        const fontConv = new FontConv(style, this)
        this.fontConvMap.addConv(fontConv, this.formatConvMap)
      } else if (type === 3) {
        const tableConv = new TableStyleConv(style, this)
        this.tableStyleConvMap.addConv(tableConv)
      }
    }
  }

  loadDefaults() {
    const format = this.styles.default_format()
    const conv = {
      ind_left: 0,
      ind_right: 0,
      spacing_before: 0,
      spacing_after: 0,
    }
    if (format) {
      const formatConv = FormatConv.fromStyle(format)
      Object.assign(conv, formatConv)
    }
    this.defaultFormat = conv
    const font = this.styles.default_font()
    const conv2 = {}
    if (font) {
      const fontConv = FontConv.fromStyle(font)
      Object.assign(conv2, fontConv)
    }
    this.defaultFont = conv2
  }

  getCssClass(name) {
    if (!this.formatConvMap.getConv(name)) return null
    let className = this.nameToCss.get(name)
    if (className) return className
    const styleObj = this.getFormatNumbering(name)
    className = css(styleObj)
    this.nameToCss.set(name, className)
    return className
  }

  getFont(name) {
    const font = this.fontConvMap.getConv(name)
    if (font) {
      return font.conv
    }
    return null
  }

  getFontStyle(name) {
    return this.fontConvMap.getStyleObj(name)
  }

  getFormat(name) {
    const format = this.formatConvMap.getConv(name)
    if (format) {
      return format.conv
    }
    return null
  }

  getFormatStyle(name) {
    return this.formatConvMap.getStyleObj(name)
  }

  getFormatNumbering(name) {
    const format = this.formatConvMap.getConv(name)
    if (format) return format.numberingObj
  }

  getTableFormat(name) {
    const format = this.tableStyleConvMap.getConv(name)
    if (format) {
      return format.conv
    }
    return null
  }

  getTableFormatStyle(name) {
    return this.tableStyleConvMap.getStyleObj(name)
  }

  getDefaultFormat(curStyleMap) {
    if (curStyleMap) return curStyleMap.defaultFormat
    return this.defaultFormat
  }

  getDefaultFont(curStyleMap) {
    if (curStyleMap) return curStyleMap.defaultFont
    return this.defaultFont
  }

  getParagraphStyles(curStyleMap) {
    return this.formatConvMap.mergeStyleNames(curStyleMap)
  }

  idToFont(id) {
    return this.fontConvMap.idTo.get(id)
  }

  idToFontName(id) {
    return this.fontConvMap.idToName.get(id)
  }

  idToFormat(id) {
    return this.formatConvMap.idTo.get(id)
  }

  idToFormatName(id) {
    return this.formatConvMap.idToName.get(id)
  }

  hasStyle(styleName) {
    return this.formatConvMap.nameTo.has(styleName)
  }

  styleAdded(styleName) {
    return this.formatConvMap.nameTo.set(styleName, true)
  }

  cloneStyle(styleName, curStyleMap) {
    const stylesElem = curStyleMap.styles._element
    const format = this.formatConvMap.getConv(styleName)
    const formatElem = format.formatElement
    const formatClone = formatElem.clone()
    stylesElem.append(formatClone)
    const font = this.fontConvMap.getConv(styleName)
    const fontElem = font.fontElement
    if (fontElem) {
      const fontClone = fontElem.clone()
      stylesElem.append(fontClone)
    }
    curStyleMap.styleAdded(styleName)
  }
}

function getStyleMap(docx, numberingMap) {
  return new StyleMap(docx.styles, numberingMap)
}

export { getStyleMap }
