import { text, table, enums } from 'docxyz'
import { elementTypes } from './types'
import { ParagraphTrans } from './textTrans'
import { TableTrans } from './tableTrans'

function isColBr(paragraph) {
  const type = 'column'
  const brs = paragraph._element.xpath(`.//w:br[@w:type="${type}"]`)
  if (brs.length > 0) {
    for (const br of brs) {
      paragraph._element.remove(br.getparent())
    }
    return true
  }
}
function isSection(paragraph) {
  const pPr = paragraph._element.pPr
  if (pPr && pPr.sectPr) return true
}
function addColBr(container) {
  const paragraph = container.add_paragraph()
  paragraph.add_run().add_break(enums.WD_BREAK.COLUMN)
}
function addSection(container, sectPr) {
  const paragraph = container.add_paragraph()
  const _paragraph = paragraph._element
  _paragraph.set_sectPr(sectPr)
}
class DocxTrans {
  static from(docx, options) {
    const { docxContext } = options
    const { sectionMap } = docxContext
    let columnChildren = []
    let sectionIndex = 0
    let slateSection = sectionMap.getSectionElement(sectionIndex)
    const slateSections = []
    for (const child of docx.content) {
      if (child instanceof text.Paragraph) {
        if (isColBr(child)) {
          const column = slateSection.children[slateSection.colIndex]
          column.children = columnChildren
          columnChildren = []
          slateSection.colIndex += 1
          if (child.text) {
            const paragraph = ParagraphTrans.from(child, options)
            columnChildren.push(paragraph)
          }
        } else if (isSection(child)) {
          const column = slateSection.children[slateSection.colIndex]
          column.children = columnChildren
          columnChildren = []
          slateSections.push(slateSection)
          sectionIndex += 1
          slateSection = sectionMap.getSectionElement(sectionIndex)
        } else {
          const paragraph = ParagraphTrans.from(child, options)
          columnChildren.push(paragraph)
        }
      } else if (child instanceof table.Table) {
        const table = TableTrans.from(child, options)
        columnChildren.push(table)
      }
    }
    const column = slateSection.children[slateSection.colIndex]
    column.children = columnChildren
    slateSections.push(slateSection)
    // console.log(sectionMap);
    return slateSections
  }

  static to(data, docx, options) {
    const { docxContext } = options
    const { sectionMap } = docxContext
    const container = docx
    for (const [sectionIndex, section] of data.entries()) {
      if (section.type === elementTypes.SECTION) {
        for (const [columnIndex, column] of section.children.entries()) {
          for (const child of column.children) {
            if (child.type === elementTypes.TABLE) {
              TableTrans.to(child, container, options)
            } else if (child.type === elementTypes.PARAGRAPH) {
              ParagraphTrans.to(child, container, options)
            }
          }
          if (columnIndex < section.children.length - 1) {
            addColBr(container)
          }
        }
      }
      if (sectionIndex < data.length - 1) {
        const sectPr = sectionMap.getSectPr(section.key)
        addSection(container, sectPr)
      }
    }
  }
}

function toEditorData(docxContext) {
  const { docx } = docxContext
  const options = { docxContext }
  const sections = DocxTrans.from(docx, options)
  return sections
}

function toDocx(docxContext, data) {
  const { docx } = docxContext
  const options = { docxContext }
  DocxTrans.to(data, docx, options)
}
function saveDocx(docxContext, data) {
  const { docx } = docxContext
  docx._body.clear_content()
  toDocx(docxContext, data)
  return docx.save()
}

export { toEditorData, saveDocx }
