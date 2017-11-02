### d3node-vilog

  Quick visualisation data(array of object) with use d3 and node.
  Primarily for visualizing data in tests.

### install
  * `npm install d3node-vilog`

### test
  * `cd node_modules d3node-vilog`
  * `npm test` or `mocha tests --compilers js:babel-core/register --require babel-polyfill`
  
### how to use
  * data format:
  ```
  [
    {key: 0, value: 0.1},
    {key: 1, value: 0.1},
    {key: 2, value: 0.2},
    {key: 3, value: 0.3},
    {key: 4, value: 0.3},
    ...
  ]
  ```
  * Example:

```javascript
  import { output, line } from 'd3node-vilog';
  
  const log = [];
  for (let t = 0; t < 100; ++t) {
    log.push({ key: t, value: t });
  }
  output('./tests/log', line({ data: log }));
```

### result

<img src="https://raw.githubusercontent.com/asm-jaime/d3node-vilog/master/docs/log.svg?sanitize=true">
