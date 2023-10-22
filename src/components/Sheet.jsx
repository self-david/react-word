import React, { useCallback } from 'react'
import { Editable } from 'slate-react'
import Elements from '../utils/Common/Elements'
import Leaf from '../utils/Common/Leaf'
import { sheetPropTypes, sheetDefaultProps } from './PropTypes'
import '../style.css'

const Sheet = ({ className, placeholder, spellCheck, autoFocus, initialValue, ...rest }) => {
  const renderElement = useCallback(props => <Elements {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <Editable
      className={className}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck={spellCheck}
      autoFocus
      {...rest}
    />
  )
}

Sheet.propTypes = sheetPropTypes
Sheet.defaultProps = sheetDefaultProps

export default Sheet
