export const RANGE_EMPTY = 1 << 1
export const RANGE_LB_INC = 1 << 2
export const RANGE_UB_INC = 1 << 3
export const RANGE_LB_INF = (1 << 4)
export const RANGE_UB_INF = (1 << 5)

export class Range<T> {
  constructor(lower: T | null, upper: T | null, mask: number);
  lower: T | null;
  upper: T | null;
  hasMask (flag): boolean;
  isEmpty (): boolean;
  isBounded (): boolean;
  isLowerBoundClosed (): boolean;
  isUpperBoundClosed (): boolean;
  hasLowerBound (): boolean;
  hasUpperBound (): boolean;

  containsPoint (point: T, transform: (value: string) => T): boolean;
  containsRange (range: Range<T>, transform: (value: string) => T): boolean;
}

export function parse(input: string): string;
export function parse<T>(source: string, transform: (value: string) => T): Range<T>;
export function serialize<T>(range: Range<T>): string;
export function serialize<T>(range: Range<T>, format: (value: T) => string): string;
