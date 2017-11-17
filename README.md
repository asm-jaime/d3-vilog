### d3-vilog

  Quick node-visualisation data with use d3.
  Primarily for visualizing data in tests.

### install
  * `npm install d3-vilog`

### test
  * `cd node_modules d3-vilog`
  * `npm test` or `mocha tests --compilers js:babel-core/register --require babel-polyfill`
  
### how to use

#### line

  * data format:
  ```
  [
    {y1: 0, y2: 0.1, ...},
    {y1: 1, y2: 0.1, ...},
    {y1: 2, y2: 0.2, ...},
    {y1: 3, y2: 0.3, ...},
    {y1: 4, y2: 0.3, ...},
    ...
  ]
  ```
  * Example:

```javascript
  import { output, line } from 'd3-vilog';
  
  const log = [];
  for (let t = 0; t < 100; ++t) {
    log.push({ key: t, value: t });
  }
  output('./tests/log', line({ data: log }));
```

### result

<img src="https://raw.githubusercontent.com/asm-jaime/d3-vilog/master/docs/examples.png?sanitize=true">
