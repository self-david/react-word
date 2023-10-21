/* eslint-disable camelcase */
import { enums, shared } from 'docxyz'

const indSpacingAttrs = ['first_line_indent', 'ind_left', 'ind_right', 'spacing_before', 'spacing_after']
class IndentSpacingConv {
  static from(pr, conv) {
    for (const attr of indSpacingAttrs) {
      const v = pr[attr]
      if (v) {
        conv[attr] = v.pt
      }
    }
  }

  static to(pr, conv) {
    for (const attr of indSpacingAttrs) {
      if (conv[attr]) pr[attr] = new shared.Pt(conv[attr])
    }
  }

  static indent(conv, styleObj) {
    if (conv.first_line_indent) styleObj.textIndent = `${conv.first_line_indent}pt`
    if (conv.ind_left || conv.ind_left === 0)
      //
      styleObj.marginLeft = `${conv.ind_left}pt`
    if (conv.ind_right || conv.ind_right === 0)
      //
      styleObj.marginRight = `${conv.ind_right}pt`
  }

  static spacing(conv, styleObj) {
    if (conv.spacing_before || conv.spacing_before === 0)
      //
      styleObj.marginTop = `${conv.spacing_before}pt`
    if (conv.spacing_after || conv.spacing_after === 0)
      //
      styleObj.marginBottom = `${conv.spacing_after}pt`
  }

  static toStyleObj(conv, styleObj) {
    this.indent(conv, styleObj)
    this.spacing(conv, styleObj)
  }
}
class LineSpacingConv {
  static from(pr, conv) {
    const { spacing_line, spacing_lineRule } = pr
    if (spacing_line === null) {
      return
    }
    if (spacing_lineRule === enums.WD_LINE_SPACING.MULTIPLE) {
      const spacing = spacing_line / new shared.Pt(12)
      conv.line_spacing = spacing
      conv.line_spacing_unit = ''
    } else {
      conv.line_spacing = spacing_line.pt
      conv.line_spacing_unit = 'pt'
    }
  }

  static to(pr, conv) {
    const spacing = conv.line_spacing
    const unit = conv.line_spacing_unit
    if (unit === 'pt') {
      pr.spacing_line = new shared.Pt(spacing)
      if (pr.spacing_lineRule !== enums.WD_LINE_SPACING.AT_LEAST) {
        pr.spacing_lineRule = enums.WD_LINE_SPACING.EXACTLY
      }
    } else if (unit === '') {
      pr.spacing_line = new shared.Pt(spacing * 12)
      pr.spacing_lineRule = enums.WD_LINE_SPACING.MULTIPLE
    }
  }

  static toStyleObj(conv, styleObj) {
    if (conv.line_spacing) {
      styleObj.lineHeight = `${conv.line_spacing}${conv.line_spacing_unit}`
    }
  }
}
class ShdConv {
  static from(pr, conv) {
    const { shd } = pr
    if (shd) {
      conv.shd = shd.fill
    }
  }

  static to(pr, conv) {
    if (conv.shd) {
      const shd = pr.get_or_add_shd()
      shd.fill = conv.shd
    }
  }

  static toStyleObj(conv, styleObj) {
    if (conv.shd) {
      styleObj.backgroundColor = `#${conv.shd}`
    }
  }
}
class AlignmentConv {
  static from(pr, conv) {
    const { jc_val } = pr
    if (jc_val) {
      let alignment = 'left'
      switch (jc_val) {
        case 0:
          alignment = 'left'
          break
        case 1:
          alignment = 'center'
          break
        case 2:
          alignment = 'right'
          break
        case 3:
          alignment = 'justify'
          break
      }
      conv.alignment = alignment
    }
  }

  static to(pr, conv) {
    if (conv.alignment) {
      let alignment = 0
      switch (conv.alignment) {
        case 'left':
          alignment = 0
          break
        case 'center':
          alignment = 1
          break
        case 'right':
          alignment = 2
          break
        case 'justify':
          alignment = 3
          break
      }
      pr.jc_val = alignment
    }
  }

  static toStyleObj(conv, styleObj) {
    if (conv.alignment) styleObj.textAlign = conv.alignment
  }
}

class LineConv {
  static from(val) {
    switch (val) {
      case 'dash':
      case 'dashDotDotHeavy':
      case 'dashDotHeavy':
      case 'dashedHeavy':
      case 'dashLong':
      case 'dashLongHeavy':
      case 'dotDash':
      case 'dotDotDash':
        return 'dashed'
      case 'dotted':
      case 'dottedHeavy':
        return 'dotted'
      case 'double':
        return 'double'
      case 'single':
      case 'thick':
      case 'words':
        return 'solid'
      case 'nil':
        return 'none'
    }
    return 'solid'
  }

  static to(val) {
    switch (val) {
      case 'dashed':
        return 'dash'
      case 'dotted':
        return 'dotted'
      case 'double':
        return 'double'
      case 'solid':
        return 'single'
      case 'none':
        return 'nil'
    }
    return 'single'
  }
}
const sides = ['left', 'right', 'top', 'bottom']
function borderToStyleObj(border, styleObj, Side) {
  const { style } = border
  if (!style) return
  const { width, color, padding } = border
  styleObj[`border${Side}Style`] = style
  if (width) {
    styleObj[`border${Side}Width`] = `${width}pt`
  }
  if (color) {
    if (color !== 'auto') styleObj[`border${Side}Color`] = `#${color}`
  }
  if (padding) {
    styleObj[`padding${Side}`] = `${padding}pt`
  }
}
class BorderConv {
  static from(prBorder, convBorder) {
    const { val } = prBorder
    convBorder.style = LineConv.from(val)
    if (val === 'nil') return
    const { sz, color, space } = prBorder
    if (sz) {
      convBorder.width = sz.twips * 0.125 // * 0.25;//0.5  ST_HpsMeasure-> ST_TwipsMeasure
    }
    if (color) {
      convBorder.color = color === 'auto' ? '000000' : `${color}`
    }
    if (space) {
      convBorder.padding = space
    }
  }

  static to(prBorder, convBorder) {
    const { style, width, color, padding } = convBorder
    if (style) {
      prBorder.val = LineConv.to(style)
    }
    if (width) {
      prBorder.sz = new shared.Twips(width * 8)
    }
    if (color) {
      prBorder.color = shared.RGBColor.from_string(color)
    }
    if (padding) {
      prBorder.space = padding
    }
  }
}
class BordersConv {
  static from(prBorders, conv) {
    const convBorders = {}
    conv.borders = convBorders
    for (const side of sides) {
      const border = prBorders[side]
      if (!border) continue
      const convBorder = {}
      BorderConv.from(border, convBorder)
      convBorders[side] = convBorder
    }
  }

  static to(borders, convBorders) {
    for (const side of sides) {
      const convBorder = convBorders[side]
      if (!convBorder) continue
      const border = borders[`get_or_add_${side}`]()
      BorderConv.to(border, convBorder)
    }
  }
}

class PBordersConv {
  static getPrBorders(pr) {
    return pr.pBdr
  }

  static getOrAddPrBorders(pr) {
    return pr.get_or_add_pBdr()
  }

  static from(pr, conv) {
    const borders = this.getPrBorders(pr)
    if (!borders) return
    BordersConv.from(borders, conv)
  }

  static to(pr, conv) {
    if (!conv.borders) return
    const prBorders = this.getOrAddPrBorders(pr)
    BordersConv.to(prBorders, conv.borders)
  }

  static toStyleObj(conv, styleObj) {
    if (!conv.borders) return
    for (const side of sides) {
      const convBorder = conv.borders[side]
      if (convBorder) {
        const Side = side.slice(0, 1).toUpperCase() + side.slice(1)
        borderToStyleObj(convBorder, styleObj, Side)
      }
    }
  }
}

class TblBordersConv extends PBordersConv {
  static getPrBorders(pr) {
    return pr.tblBorders
  }

  static getOrAddPrBorders(pr) {
    return pr.get_or_add_tblBorders()
  }
}
class TcBordersConv extends PBordersConv {
  static getPrBorders(pr) {
    return pr.tcBorders
  }

  static getOrAddPrBorders(pr) {
    return pr.get_or_add_tcBorders()
  }
}

class RunBorderConv {
  static from(pr, conv) {
    const prBorder = pr.bdr
    if (!prBorder) return
    const convBorder = {}
    conv.border = convBorder
    BorderConv.from(prBorder, convBorder)
  }

  static to(pr, conv) {
    if (!conv.border) return
    const prBorder = pr.get_or_add_bdr()
    BorderConv.to(prBorder, conv.border)
  }

  static toStyleObj(conv, styleObj) {
    if (!conv.border) return
    borderToStyleObj(conv.border, styleObj, '')
  }
}

export {
  IndentSpacingConv,
  LineSpacingConv,
  AlignmentConv,
  PBordersConv,
  TblBordersConv,
  TcBordersConv,
  ShdConv,
  RunBorderConv,
  LineConv,
}
