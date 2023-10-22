/* eslint-disable camelcase */
import { css, cx } from '@emotion/css'
import { shared } from 'docxyz'
import { StyleConv } from './styleConv'
import { TblBordersConv, TcBordersConv, ShdConv } from './prAttrConvs'
import { PrConv, RPrConv, PPrConv } from './prConv'

class TcWidthConv {
  static from(pr, conv) {
    const { width } = pr
    if (width) {
      conv.width = width.pt
    }
  }

  static to(pr, conv) {
    if (conv.width) pr.width = new shared.Pt(conv.width)
  }

  static toStyleObj(conv, styleObj) {
    if (conv.width) styleObj.width = `${conv.width}pt`
  }
}
class TblWidthConv {
  static from(pr, conv) {
    const { tblW } = pr
    if (tblW) {
      const { width } = tblW
      if (width) conv.width = width.pt
    }
  }

  static to(pr, conv) {
    if (conv.width) {
      const tblW = pr.get_or_add_tblW()
      tblW.width = new shared.Pt(conv.width)
    }
  }

  static toStyleObj(conv, styleObj) {
    if (conv.width) styleObj.width = `${conv.width}pt`
  }
}
class TblIndConv {
  static from(pr, conv) {
    const { tblInd } = pr
    if (tblInd) {
      const { w } = tblInd
      if (w) {
        conv.ind = w.pt
      }
    }
  }

  static to(pr, conv) {
    if (conv.ind) {
      const ind = pr.get_or_add_tblInd()
      ind.w = new shared.Pt(conv.ind)
      ind.type = 'dxa'
    }
  }

  static toStyleObj(conv, styleObj) {
    // console.log('tblInd to margin', conv);
    if (conv.ind) styleObj.marginLeft = `${conv.ind}pt`
  }
}
class TblGridConv {
  static from(table) {
    try {
      const { tblGrid } = table._element
      if (tblGrid) {
        const gridCols = []
        // conv.gridCols = gridCols;
        for (const gridCol of tblGrid.gridCol_lst) {
          const w = gridCol.w.pt
          gridCols.push(w)
        }
        return gridCols
      }
    } catch (e) {
      console.error(e)
    }
    return null
  }

  static toColGroup(gridCols) {
    if (gridCols)
      return (
        <colgroup>
          {gridCols.map((item, index) => (
            <col key={index.toString()} style={{ width: `${item}pt` }}></col>
          ))}
        </colgroup>
      )
  }
}
class SideMar {
  static from(prSideMar, convCellMar, side) {
    const { w } = prSideMar
    if (w) convCellMar[side] = w.pt
  }

  static to(prSideMar, convSideMar) {
    prSideMar.w = new shared.Pt(convSideMar)
    prSideMar.type = 'dxa'
  }

  static toStyleObj(prSideMar, styleObj, side) {
    const Side = side.slice(0, 1).toUpperCase() + side.slice(1)
    styleObj[`padding${Side}`] = `${prSideMar}pt`
  }
}
const sides = ['left', 'right', 'top', 'bottom']
class CellMar {
  static from(prCellMar, convCellMar) {
    for (const side of sides) {
      const sideMar = prCellMar[side]
      if (sideMar) {
        SideMar.from(sideMar, convCellMar, side)
      }
    }
  }

  static to(prCellMar, convCellMar) {
    for (const side of sides) {
      const convSideMar = convCellMar[side]
      if (convSideMar) {
        const prSideMar = prCellMar[`get_or_add_${side}`]()
        SideMar.to(prSideMar, convSideMar, side)
      }
    }
  }

  static toStyleObj(cellMar, styleObj) {
    const obj = {}
    styleObj['& td'] = obj
    for (const side of sides) {
      const sideMar = cellMar[side]
      if (sideMar) {
        SideMar.toStyleObj(sideMar, obj, side)
      }
    }
    return styleObj
  }
}
class TblCellMar {
  static getCellMar(pr) {
    return pr.tblCellMar
  }

  static getOrAddCellMar(pr) {
    return pr.get_or_add_tblCellMar()
  }

  static from(pr, conv) {
    const cellMar = this.getCellMar(pr)
    if (cellMar) {
      const convCellMar = {}
      conv.cellMar = convCellMar
      CellMar.from(cellMar, convCellMar)
    }
  }

  static to(pr, conv) {
    if (conv.cellMar) {
      const cellMar = this.getOrAddCellMar(pr)
      CellMar.to(cellMar, conv.cellMar)
    }
  }

  static toStyleObj(conv, styleObj) {
    if (!styleObj) styleObj = {}
    const { cellMar } = conv
    if (cellMar) {
      CellMar.toStyleObj(cellMar, styleObj)
    }
    return styleObj
  }
}
class TrHeightConv {
  static from(pr, conv) {
    const { trHeight_val } = pr
    if (trHeight_val) conv.height = trHeight_val.pt
  }

  static to(pr, conv) {
    if (conv.height) {
      pr.trHeight_val = new shared.Pt(conv.height)
    }
  }

  static toStyleObj(conv, styleObj) {
    if (conv.height) {
      styleObj.height = `${conv.height}pt`
    }
  }
}

class TrPrConv extends PrConv {
  static attrConvs = [TrHeightConv]
  static getStylePr(style) {
    return style._element.trPr
  }
}
class TrStyleConv extends StyleConv {
  static prConv = TrPrConv
  convToRow(row) {
    const trPr = row._element.get_or_add_trPr()
    TrPrConv.convToPr(trPr, this.conv)
  }
}

class TcPrConv extends PrConv {
  static attrConvs = [TcBordersConv, ShdConv, TcWidthConv]
  static getStylePr(style) {
    return style._element.tcPr
  }
}
class TcStyleConv extends StyleConv {
  static prConv = TcPrConv
  convToCell(cell) {
    const tcPr = cell._element.get_or_add_tcPr()
    // this.constructor.prConv.
    TcPrConv.convToPr(tcPr, this.conv)
  }
}

class TblPrConv extends PrConv {
  static attrConvs = [TblBordersConv, TblCellMar, ShdConv, TblWidthConv, TblIndConv]
  static getBandSize(style) {
    let rowBandSize = 1
    let colBandSize = 1
    const pr = this.getStylePr(style)
    if (pr) {
      const { tblStyleRowBandSize, tblStyleColBandSize } = pr
      if (tblStyleRowBandSize) {
        rowBandSize = tblStyleRowBandSize.val
      }
      if (tblStyleColBandSize) {
        colBandSize = tblStyleColBandSize.val
      }
    }
    return [rowBandSize, colBandSize]
  }

  static getTblLook(table) {
    const types = []
    // let pr = table._element.tblPr;
    const pr = this.getStylePr(table)
    if (pr) {
      const tblLook = pr.find('w:tblLook')
      if (tblLook) {
        let hex = 0
        const { val, firstRow, lastRow, firstColumn, lastColumn, noHBand, noVBand } = tblLook
        if (val) hex = parseInt(val, 16)
        if (!(noHBand || hex & 0x0200)) {
          types.push('band1Horz', 'band2Horz')
        }
        if (!(noVBand || hex & 0x0400)) {
          types.push('band1Vert', 'band2Vert')
        }
        if (firstRow || hex & 0x0020) types.push('firstRow')
        if (firstColumn || hex & 0x0080) types.push('firstCol')
        if (lastColumn || hex & 0x0100) types.push('lastCol')
        if (lastRow || hex & 0x0040) types.push('lastRow')
      }
    }
    // return types.join(';');
    return types
  }

  static getStylePr(style) {
    return style._element.tblPr
  }
}
class TblStyleConv extends StyleConv {
  static prConv = TblPrConv
  convToTable(table) {
    const { tblPr } = table._element // .get_or_add_tblPr();
    TblPrConv.convToPr(tblPr, this.conv)
  }
}

class TblStylePrConv {
  constructor(stylePr, rowBandSize, colBandSize) {
    this.stylePr = stylePr
    this.rowBandSize = rowBandSize
    this.colBandSize = colBandSize
    this.type = stylePr.type
  }

  get cssClass() {
    if (!this._css) this._css = css(this.styleObj)
    return this._css
  }

  get styleObj() {
    if (this._styleObj) return this._styleObj
    this._styleObj = this.toStyleObj()
    return this._styleObj
  }

  toStyleObj() {
    const obj = {}
    const { pPr, rPr, tcPr } = this.stylePr
    const { selector } = this
    if (tcPr) {
      this.tcPrConv = TcPrConv.prToConv(tcPr)
      const tdObj = {}
      TcPrConv.toStyleObj(this.tcPrConv, tdObj)
      obj[selector] = tdObj
    }
    if (pPr) {
      this.pPrConv = PPrConv.prToConv(pPr)
      const pPrObj = PPrConv.toStyleObj(this.pPrConv)
      obj[selector + ' p[data-slate-node]'] = pPrObj
    }
    if (rPr) {
      this.rPrConv = RPrConv.prToConv(rPr)
      const rPrObj = RPrConv.toStyleObj(this.rPrConv)
      obj[selector + ' span[data-slate-leaf]'] = rPrObj
    }
    return obj
  }

  get selector() {
    const { rowBandSize, colBandSize, type } = this
    const a = 2 * rowBandSize
    const b = 2 * colBandSize
    const ss = []
    switch (type) {
      case 'band1Vert':
        for (let i = colBandSize; i < b; i++) {
          ss.push(`tr td:nth-child(${b}n+${i + 1})`)
        }
        break
      case 'band2Vert':
        for (let i = 0; i < colBandSize; i++) {
          ss.push(`tr td:nth-child(${b}n+${i + 1})`)
        }
        break
      case 'band1Horz':
        for (let i = rowBandSize; i < a; i++) {
          ss.push(`tr:nth-child(${a}n+${i + 1}) td`)
        }
        break
      case 'band2Horz':
        for (let i = 0; i < rowBandSize; i++) {
          ss.push(`tr:nth-child(${a}n+${i + 1}) td`)
        }
        break
      case 'firstRow':
        return '& tr:first-child td'
      case 'firstCol':
        return '& tr td:first-child'
      case 'lastCol':
        return '& tr td:last-child'
      case 'lastRow':
        return '& tr:last-child td'
    }
    return '& ' + ss.join(', ')
  }
}
class TableStyleConv extends StyleConv {
  constructor(style, styleMap) {
    super(style, styleMap)
    this.lookMap = new Map()
    this.stylePrConvMap = null
  }

  loadStylePrs() {
    if (this.stylePrConvMap) return
    this.stylePrConvMap = new Map()
    const [rowBandSize, colBandSize] = TblPrConv.getBandSize(this.style)
    for (const stylePr of this.style._element.tblStylePr_lst) {
      const stylePrConv = new TblStylePrConv(stylePr, rowBandSize, colBandSize)
      this.stylePrConvMap.set(stylePrConv.type, stylePrConv)
    }
  }

  getCssOfStylePrs(look) {
    const cssClasses = []
    for (const attr of look) {
      const stylePrConv = this.stylePrConvMap.get(attr)
      if (stylePrConv) {
        cssClasses.push(stylePrConv.cssClass)
      }
    }
    return cx(...cssClasses)
  }

  get cssClass() {
    if (!this._css) this._css = css(this.styleObj)
    return this._css
  }

  get styleObj() {
    if (this._styleObj) return this._styleObj
    this._styleObj = this.toStyleObj()
    return this._styleObj
  }

  toStyleObj() {
    const obj = { borderCollapse: 'collapse' }
    const { pPr, rPr, tcPr, tblPr } = this.style._element
    if (tblPr) {
      this.tblPrConv = TblPrConv.prToConv(tblPr)
      TblPrConv.toStyleObj(this.tblPrConv, obj)
    }
    if (tcPr) {
      this.tcPrConv = TcPrConv.prToConv(tcPr)
      const tdObj = obj['& td'] || {}
      TcPrConv.toStyleObj(this.tcPrConv, tdObj)
      obj['& td'] = tdObj
    }
    if (pPr) {
      this.pPrConv = PPrConv.prToConv(pPr)
      const pPrObj = PPrConv.toStyleObj(this.pPrConv)
      obj['& p[data-slate-node]'] = pPrObj
    }
    if (rPr) {
      this.rPrConv = RPrConv.prToConv(rPr)
      const rPrObj = RPrConv.toStyleObj(this.rPrConv)
      obj['& span[data-slate-leaf]'] = rPrObj
    }
    return obj
  }

  getCxClassWithLook(look) {
    const lookStr = look.join(';')
    const c = this.lookMap.get(lookStr)
    if (c) return c
    this.loadStylePrs()
    const cssOfStylePrs = this.getCssOfStylePrs(look)
    const cxClass = cx(this.cssClass, cssOfStylePrs)
    this.lookMap.set(lookStr, cxClass)
    return cxClass
  }
}

export { TableStyleConv, TblPrConv, TblGridConv, TcPrConv, TcStyleConv, TblStyleConv, TrPrConv, TrStyleConv }
