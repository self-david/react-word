class AbstractNum {
  _counterName(id, lvl) {
    return `num${id}_${lvl}`
  }

  get counterName() {
    return this._counterName(this.id, this.level)
  }

  get content() {
    const ret = this.lvlText.replace(/%\d*/g, s => {
      const lvl = parseInt(s.substring(1)) - 1
      return `"counter(${this._counterName(this.id, lvl)}, ${this.numFmt})"`
    })
    return `"${ret}\\9"`
  }

  get styleObj() {
    const counter = this.counterName
    const before = {
      content: this.content,
      counterIncrement: counter,
    }
    if (this.numFmt === 'bullet') before.fontFamily = 'Symbol'
    const obj = {
      display: 'list-item',
      listStylePosition: 'inside',
      listStyleType: 'none',
      '::before': before,
    }
    if (this.level > 0) {
      obj.counterReset = counter
    }
    return obj
  }
}
class NumberingMap {
  constructor() {
    this.map = new Map()
  }

  load(elem) {
    const abstractNums = elem?.findall('w:abstractNum') ?? []
    for (const abstractNumElem of abstractNums) {
      if (!abstractNumElem.lvl.pStyle) continue
      const abstractNum = new AbstractNum()
      abstractNum.id = abstractNumElem.abstractNumId
      abstractNum.level = abstractNumElem.lvl.ilvl
      abstractNum.start = abstractNumElem.lvl.start.val
      abstractNum.numFmt = abstractNumElem.lvl.numFmt.val
      abstractNum.lvlText = abstractNumElem.lvl.lvlText.val
      abstractNum.lvlJc = abstractNumElem.lvl.lvlJc.val
      const pStyle = abstractNumElem.lvl.pStyle.val
      this.map.set(pStyle, abstractNum)
    }
  }

  has(key) {
    return this.map.has(key)
  }

  get(key) {
    return this.map.get(key)
  }

  getCounterReset(curNumbering) {
    let keys = []
    let counters = []
    if (curNumbering) {
      keys = [...curNumbering.map.keys()]
      counters = [...curNumbering.map.values()]
    }
    for (const [key, counter] of this.map.entries()) {
      if (!keys.includes(key)) counters.push(counter)
    }
    const counterNames = []
    for (const value of counters) {
      if (value.level === 0) counterNames.push(value.counterName)
    }
    return { counterReset: counterNames.join(' ') }
  }
}
function loadNumbering(docx) {
  let numberingElem
  const numberingMap = new NumberingMap()
  try {
    numberingElem = docx.part.numbering_part._element
  } catch (e) {
    return numberingMap
  }
  numberingMap.load(numberingElem)
  return numberingMap
}
export { loadNumbering }
