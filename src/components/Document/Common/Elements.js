import { useSlate } from 'slate-react'
import { FormatConv } from '../style/styleConv'
import { Table, Row, Cell } from './Table'
import { Section, Column } from './Section'

const Elements = props => {
  const { attributes, children, element } = props
  if (element) {
    switch (element.type) {
      case 'section':
        return <Section {...props} />
      case 'column':
        return <Column {...props} />
      case 'table':
        return <Table {...props} />
      case 'row':
        return <Row {...props} />
      case 'cell':
        return <Cell {...props} />
      case 'paragraph': {
        const editor = useSlate()
        const styleName = element.style
        const formatStyle = editor.getFormatStyle(styleName)
        const cls = editor.getCssClass(styleName)
        const styleObj = FormatConv.toStyleObj(element)
        const style = { ...formatStyle, ...styleObj }
        return (
          <p className={cls} style={style} {...attributes}>
            {children}
          </p>
        )
      }
    }
  }
}

export default Elements
