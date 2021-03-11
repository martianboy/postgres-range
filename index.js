'use strict'

const RANGE_EMPTY = 1 << 1
const RANGE_LB_INC = 1 << 2
const RANGE_UB_INC = 1 << 3
const RANGE_LB_INF = (1 << 4)
const RANGE_UB_INF = (1 << 5)

const EMPTY = 'empty'
const INFINITY = 'infinity'

class Range {
  constructor (lower, upper, mask = 0) {
    this.lower = lower
    this.upper = upper
    this.mask = mask
  }

  /**
   * @param {number} flag
   */
  hasMask (flag) {
    return (this.mask & flag) === flag
  }

  isEmpty () {
    return this.hasMask(RANGE_EMPTY)
  }

  isBounded () {
    return !this.hasMask(RANGE_LB_INF) && !this.hasMask(RANGE_UB_INF)
  }

  isLowerBoundClosed () {
    return this.hasLowerBound() && this.hasMask(RANGE_LB_INC)
  }

  isUpperBoundClosed () {
    return this.hasUpperBound() && this.hasMask(RANGE_UB_INC)
  }

  hasLowerBound () {
    return !this.hasMask(RANGE_LB_INF)
  }

  hasUpperBound () {
    return !this.hasMask(RANGE_UB_INF)
  }

  containsPoint (point, transform = x => x) {
    const l = this.hasLowerBound()
    const u = this.hasUpperBound()

    const lower = l
      ? transform(this.lower)
      : null
    const upper = u
      ? transform(this.upper)
      : null

    if (l && u) {
      const inLower = this.hasMask(RANGE_LB_INC)
        ? lower.compareTo(point) <= 0
        : lower.compareTo(point) < 0
      const inUpper = this.hasMask(RANGE_UB_INC)
        ? upper.compareTo(point) >= 0
        : upper.compareTo(point) > 0

      return inLower && inUpper
    } else if (l) {
      return this.hasMask(RANGE_LB_INC)
        ? lower.compareTo(point) <= 0
        : lower.compareTo(point) < 0
    } else if (u) {
      return this.hasMask(RANGE_UB_INC)
        ? upper >= point
        : upper.compareTo(point) > 0
    }

    // INFINITY
    return true
  }

  /**
   * @param {Range} range
   */
  containsRange (range, transform = x => x) {
    return (
      (!range.hasLowerBound() || this.containsPoint(range.lower, transform)) &&
      (!range.hasUpperBound() || this.containsPoint(range.upper, transform))
    )
  }
}

function parse (input, transform = x => x) {
  if (input === EMPTY) {
    return new Range(null, null, RANGE_EMPTY)
  }

  let mask = input[0] === '[' ? RANGE_LB_INC : 0
  mask |= input[input.length - 1] === ']' ? RANGE_UB_INC : 0

  const delim = input.indexOf(',')
  if (delim === -1) {
    throw new Error('Cannot find comma character')
  }

  const lowerStr = input.substring(1, delim).trim()
  const upperStr = input.substring(delim + 1, input.length - 1).trim()

  if (lowerStr.length === 0 || lowerStr.endsWith(INFINITY)) {
    mask |= RANGE_LB_INF
  }

  if (upperStr.length === 0 || upperStr.endsWith(INFINITY)) {
    mask |= RANGE_UB_INF
  }

  let lower = null
  let upper = null

  if ((mask & RANGE_LB_INF) !== RANGE_LB_INF) {
    lower = transform(lowerStr)
  }

  if ((mask & RANGE_UB_INF) !== RANGE_UB_INF) {
    upper = transform(upperStr)
  }

  return new Range(lower, upper, mask)
}

/**
 * @param {Range} range
 */
function serialize (range, format = x => x) {
  if (range.hasMask(RANGE_EMPTY)) {
    return EMPTY
  }

  let s = ''

  s += range.hasMask(RANGE_LB_INC) ? '[' : '('
  s += range.hasLowerBound() ? format(range.lower) : ''
  s += ','
  s += range.hasUpperBound() ? format(range.upper) : ''
  s += range.hasMask(RANGE_UB_INC) ? ']' : ')'

  return s
}

module.exports = {
  Range,
  RANGE_EMPTY,
  RANGE_LB_INC,
  RANGE_UB_INC,
  RANGE_LB_INF,
  RANGE_UB_INF,

  parse,
  serialize
}
