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
    children: [
      {
        type: 'column',
        children: paragraphs,
      },
    ],
  },
]

export const documentPropTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  spellCheck: PropTypes.bool,
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.array,
}

export const documentDefaultProps = {
  initialValue,
  placeholder: 'Enter some rich text…',
  spellCheck: false,
  autoFocus: true,
}
