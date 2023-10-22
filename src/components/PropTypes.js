import PropTypes from 'prop-types'

const paragraphs = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', b: true, i: true },
      { text: ' text, ' },
      { text: 'much', i: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
]

const initialValue = [
  {
    type: 'section',
    children: [{ type: 'column', children: paragraphs }],
  },
]

export const documentPropTypes = {
  children: PropTypes.node,
  initialValue: PropTypes.array,
  onCallback: PropTypes.func,
}

export const documentDefaultProps = {
  initialValue,
  onCallback: () => {},
}

export const sheetPropTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  spellCheck: PropTypes.bool,
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.array,
}

export const sheetDefaultProps = {
  placeholder: 'Enter some text…',
  spellCheck: false,
  autoFocus: true,
  initialValue,
}

export const DownloadProps = {
  fileName: PropTypes.string,
}

export const DownloadDefaultProps = {
  fileName: 'demo',
}
