# postgres-range [![tests](https://github.com/martianboy/postgres-range/workflows/tests/badge.svg)](https://github.com/martianboy/postgres-range/actions?query=workflow%3Atests)

> Parse postgres range columns


## Install

```
npm install --save postgres-range
```


## Usage

```js
const range = require('postgres-range')

const rng = range.parse('[0,5)', (value) => parseInt(value, 10))
rng.isBounded()
// => true
rng.isLowerBoundClosed()
// => true
rng.isUpperBoundClosed()
// => false
rng.hasLowerBound()
// => true
rng.hasUpperBound()
// => true

range.parse('empty').isEmpty()
// => true

range.serialize(new range.Range(0, 5))
// => '(0,5)'
```

## API

#### `parse(input, [transform])` -> `Range`

##### input

*Required*  
Type: `string`

A Postgres range string.

##### transform

Type: `function`  
Default: `identity`

A function that transforms non-null bounds of the range.


#### `serialize(range, [format])` -> `string`

##### range

*Required*  
Type: `Range`

A `Range` object.

##### format

Type: `function`  
Default: `identity`

A function that formats non-null bounds of the range.


## License

MIT © [Abbas Mashayekh](http://github.com/martianboy)
