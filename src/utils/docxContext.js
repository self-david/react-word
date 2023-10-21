import { Document } from 'docxyz'
import { getStyleMap } from './style/styleMap'
import { loadNumbering } from './style/numbering'
import { getSectionMap } from './style/section.js'

class DocxStore {
  constructor() {
    this.docx = null
    this.numberingMap = null
    this.styleMap = null
    this.sectionMap = null
    this.loaded = false
  }

  loadDocx(docx) {
    this.docx = docx
    this.numberingMap = loadNumbering(docx)
    this.styleMap = getStyleMap(docx, this.numberingMap)
    this.sectionMap = getSectionMap(docx, this.styleMap)
    this.loaded = true
  }

  loadDefaultDocx() {
    const docx = new Document()
    this.loadDocx(docx)
  }

  getCssClass(name) {
    if (!this.loaded) return
    return this.styleMap.getCssClass(name)
  }

  getFont(name) {
    if (!this.loaded) return
    return this.styleMap.getFont(name)
  }

  getFontConv(name) {
    if (!this.loaded) return
    return this.styleMap.getFontConv(name)
  }

  getFormat(name) {
    if (!this.loaded) return
    return this.styleMap.getFormat(name)
  }

  getFormatStyle(name) {
    if (!this.loaded) return
    return this.styleMap.getFormatStyle(name)
  }

  getTableFormat(name) {
    if (!this.loaded) return
    return this.styleMap.getTableFormat(name)
  }

  getTableFormatStyle(name) {
    if (!this.loaded) return
    return this.styleMap.getTableFormatStyle(name)
  }
}

class DocxContext {
  constructor() {
    this.dftStore = new DocxStore()
    this.dftStore.loadDefaultDocx()
    this.curStore = new DocxStore()
  }

  get docx() {
    return this.curStore.docx || this.dftStore.docx
  }

  get paragraphStyles() {
    if (this._paragraphStyles) return this._paragraphStyles
    const dftStyleMap = this.dftStore.styleMap
    const curStyleMap = this.curStore.styleMap
    this._paragraphStyles = dftStyleMap.getParagraphStyles(curStyleMap)
    return this._paragraphStyles
  }

  get sectionMap() {
    return this.curStore.sectionMap || this.dftStore.sectionMap
  }

  get styleMap() {
    return this.curStore.styleMap || this.dftStore.styleMap
  }

  getCssClass(name) {
    return this.curStore.getCssClass(name) || this.dftStore.getCssClass(name)
  }

  getFont(name) {
    const parFont = this.curStore.getFont(name) || this.dftStore.getFont(name)
    return parFont || {}
  }

  getFontStyle(name) {
    const fontStyle = this.curStore.getFontStyle(name) || this.dftStore.getFontStyle(name)
    return fontStyle || {}
  }

  getFormat(name) {
    const parFormat = this.curStore.getFormat(name) || this.dftStore.getFormat(name)
    return parFormat || {}
  }

  getFormatStyle(name) {
    const formatStyle = this.curStore.getFormatStyle(name) || this.dftStore.getFormatStyle(name)
    return formatStyle || {}
  }

  getTableFormat(name) {
    const tableFormat = this.curStore.getTableFormat(name) || this.dftStore.getTableFormat(name)
    return tableFormat || {}
  }

  getTableFormatStyle(name) {
    const formatStyle = this.curStore.getTableFormatStyle(name) || this.dftStore.getTableFormatStyle(name)
    return formatStyle || {}
  }

  getGlobalStyleObj(className) {
    if (this._globalStyleObj) return this._globalStyleObj
    const dftNumbering = this.dftStore.numberingMap
    const curNumbering = this.curStore.numberingMap
    // let dftStyleMap = this.dftStore.styleMap;
    // let curStyleMap = this.curStore.styleMap;
    const counterReset = dftNumbering.getCounterReset(curNumbering)
    // let dftFormat = dftStyleMap.getDefaultFormat(curStyleMap);
    // let dftFont = dftStyleMap.getDefaultFont(curStyleMap);
    const selector = `.${className}`
    this._globalStyleObj = {
      [selector]: counterReset,
      // 'p[data-slate-node=element]': dftFormat,
      // 'span[data-slate-node=text]': dftFont
    }
    return this._globalStyleObj
  }

  hasOrCloneStyle(styleName) {
    if (!this.curStore.loaded) return
    const curStyleMap = this.curStore.styleMap
    if (curStyleMap.hasStyle(styleName)) return
    const dftStyleMap = this.dftStore.styleMap
    dftStyleMap.cloneStyle(styleName, curStyleMap)
  }

  loadDocx(docx) {
    this.curStore.loadDocx(docx)
    this._paragraphStyles = null
    this._globalStyleObj = null
  }
}

export const docxContext = new DocxContext()
