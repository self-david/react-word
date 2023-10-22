/* eslint-disable camelcase */
import { text, table } from 'docxyz'
import { elementTypes } from './types'
import { ParagraphTrans } from './textTrans'
import { ST_Merge } from 'docxyz/src/oxml/simpletypes'
import { TblPrConv, TblGridConv, TrStyleConv, TcStyleConv, TblStyleConv } from './style/tblStyleConv.jsx'

class CellTrans {
  static from(cell, options) {
    if (cell.merged) return null
    const children = ContainerTrans.from(cell, options)
    const styleConv = new TcStyleConv(cell, null)
    return {
      type: elementTypes.CELL,
      colSpan: cell.colSpan,
      rowSpan: cell.rowSpan,
      styleConv,
      children,
    }
  }

  static to(element, cell, options) {
    cell.clear_content()
    ContainerTrans.to(element.children, cell, options)
    const { styleConv } = element
    styleConv.convToCell(cell)
  }
}

class RowTrans {
  static from(tr, options) {
    const children = []
    for (const cell of tr.row_cells) {
      const cellElement = CellTrans.from(cell, options)
      if (cellElement) children.push(cellElement)
    }
    const styleConv = new TrStyleConv(tr, null)
    return {
      type: elementTypes.ROW,
      styleConv,
      children,
    }
  }

  static to(element, table, options) {}
}

class Range {
  constructor(rowx, colx, height, width) {
    this.rowx = rowx
    this.colx = colx
    this.height = height
    this.width = width
  }

  in(rx, cx) {
    return this.rowx + this.height > rx && rx >= this.rowx && this.colx + this.width > cx && cx >= this.colx
  }
}
class Ranges {
  constructor() {
    this.ranges = []
  }

  push(range) {
    this.ranges.push(range)
  }

  in(rx, cx) {
    for (const range of this.ranges) {
      if (range.in(rx, cx)) return true
    }
    return false
  }
}
class MergedCell {
  constructor(master, merged) {
    this.master = master
    this.merged = merged
  }
}
class Cell extends table._Cell {
  constructor(tc, parent) {
    super(tc, parent)
    this.rowSpan = 1
    this.rows = []
  }

  get colSpan() {
    return this._tc.grid_span
  }

  inc_row_span(rowx) {
    if (this.rows.includes(rowx)) return
    this.rows.push(rowx)
    this.rowSpan += 1
  }
}
class Row extends table._Row {}
function rows_with_cells(table) {
  const rows = []
  let rowx = 0
  for (const tr of table._tbl.tr_lst) {
    const row_cells = []
    let colx = 0
    for (const tc of tr.tc_lst) {
      const { grid_span } = tc
      for (let grid_span_idx = 0; grid_span_idx < grid_span; grid_span_idx += 1) {
        if (tc.vMerge === ST_Merge.CONTINUE) {
          let master = rows[rowx - 1].row_cells[colx]
          if (master.merged) {
            master = master.master
          }
          master.inc_row_span(rowx)
          const merged = new MergedCell(master, 'v')
          row_cells.push(merged)
        } else {
          if (grid_span_idx > 0) {
            let master = row_cells[colx - 1]
            if (master.merged) {
              master = master.master
            }
            const merged = new MergedCell(master, 'h')
            row_cells.push(merged)
          } else {
            const master = new Cell(tc, table)
            row_cells.push(master)
          }
        }
        colx += 1
      }
    }
    rowx += 1
    const row = new Row(tr, this)
    row.row_cells = row_cells
    rows.push(row)
  }
  return rows
}

class TableTrans {
  static from(table, options) {
    const children = []
    // console.time('rows_with_cells');
    const rows = rows_with_cells(table)
    // console.timeEnd('rows_with_cells');
    let colCount = 0
    for (const row of rows) {
      const rowElement = RowTrans.from(row, options)
      children.push(rowElement)
      colCount = Math.max(colCount, row.row_cells.length)
    }
    const look = TblPrConv.getTblLook(table)
    // console.log('table look', look);
    const gridCols = TblGridConv.from(table)
    const colGroup = TblGridConv.toColGroup(gridCols)
    const styleConv = new TblStyleConv(table, null)

    return {
      type: elementTypes.TABLE,
      style: table.style?.name,
      look,
      styleConv,
      colGroup,
      colCount,
      children,
    }
  }

  static to(element, container, options) {
    const rowCount = element.children.length
    const colCount = element.colCount
    const table = container.add_table(rowCount, colCount)
    table.style = element.style
    const { styleConv } = element
    styleConv.convToTable(table)
    const cells = table._cells
    const ranges = new Ranges()
    let rowx = 0
    for (const rowElement of element.children) {
      let colx = 0
      for (const cellElement of rowElement.children) {
        const cell = cells[rowx * colCount + colx]
        if (cellElement.rowSpan > 1 || cellElement.colSpan > 1) {
          const range = new Range(rowx, colx, cellElement.rowSpan, cellElement.colSpan)
          ranges.push(range)
          const other_idx = (rowx + cellElement.rowSpan - 1) * colCount + colx + cellElement.colSpan - 1
          const other = cells[other_idx]
          cell.merge(other)
          CellTrans.to(cellElement, cell, options)
        } else if (!ranges.in(rowx, colx)) {
          CellTrans.to(cellElement, cell, options)
        }
        colx += 1
      }
      rowx += 1
    }
  }
}

class ContainerTrans {
  static from(container, options) {
    const children = []
    for (const child of container.content) {
      if (child instanceof text.Paragraph) {
        const paragraph = ParagraphTrans.from(child, options)
        children.push(paragraph)
      } else if (child instanceof table.Table) {
        const table = TableTrans.from(child, options)
        children.push(table)
      }
    }
    return children
  }

  static to(data, container, options) {
    for (const element of data) {
      if (element.type === elementTypes.TABLE) {
        TableTrans.to(element, container, options)
      } else if (element.type === elementTypes.PARAGRAPH) {
        ParagraphTrans.to(element, container, options)
      }
    }
  }
}

export { TableTrans, ContainerTrans }
