### d3-vilog: logger(data) ===build===> data.html
  
  Quick generate a \*.html file with visualization of a data.
  
  List of available type views:
  * line (check)
  * graph (check)
  * 2d points (in progress)
  * 3d points (in progress)

### install
  * `npm install d3-vilog`

#### options logger(options) function
  
  The argument of the logger function is an object like `{ data: some_data, dest: __dirname, type: 'line', import: 'local'}`. Here's the properties:
  
  * `data` {`[]`, `{}`, ...} : a data which you want to visualize
  * `dest` {`__dirname`, `/home/user/documents`, `./`} : path, where you want to allocate result
  * `type` {`graph`, `line`} : type or form of visualization
  * `import` {`local`, `extern` } : locally or from outside to take library files

#### data to line

  * data structure: 
  ```
  [
    { data: [[0, 0.1], [1, 0.2], [2, 0.5], ...], label: 'first' },
    { data: [[0, 0.1], [1, 0.5], [2, 0.7], ...], label: 'second' },
    { data: [[0, 0.1], [1, 0.4], [2, 0.1], ...], label: 'third' },
  ...
  ]
  ```
  * example:
  
  ```javascript
  import { logger } from 'd3-vilog';
  // const logger = require('d3-vilog').logger;
  
  function gen_data() {
    const fst = [],
      snd = [],
      trd = [],
      fth = [],
      ffth = [],
      r1 = Math.random(),
      r2 = Math.random(),
      r3 = Math.random(),
      r4 = Math.random(),
      r5 = Math.random();

    for (var i = 0; i < 100; i++) {
      fst.push([i, r1 * Math.sin(r2 + i / (10 * (r4 + .5)))]);
      snd.push([i, r2 * Math.cos(r3 + i / (10 * (r3 + .5)))]);
      trd.push([i, r3 * Math.sin(r1 + i / (10 * (r2 + .5)))]);
      fth.push([i, r4 * Math.cos(r4 + i / (10 * (r1 + .5)))]);
      ffth.push([i, (r1+r2+r3+r4+r5)/5]);
    }
    return [
      { data: fst, label: 'first sin1' },
      { data: snd, label: 'second cos1' },
      { data: trd, label: 'third sin2' },
      { data: fth, label: 'fourth cos2' },
      { data: ffth, label: 'fifth line' }
    ];
  }

  logger({ data: gen_data(), dest: './', type: 'line', import: 'extern' });
```

#### data to graph

  * data structure for circle as a vertex:
  ```
  {
    'nodes': [
      { 'id': '1', 'radius': 5, 'group': 2 },
      { 'id': '2', 'radius': 10, 'group': 2 },
      { 'id': '3', 'radius': 10, 'group': 4 },
      ...
    ],
    'links': [
      { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
      { 'source': '1', 'target': '3', 'width': 30, 'length': 300 },
      { 'source': '2', 'target': '3', 'width': 10, 'length': 150 },
      ...
    ]
  }

  ```
  * data structure for image as a vertex:
  ```
  {
    'nodes': [
      { 'id': '1', 'href': 'https://raw.com/some1.img', },
      { 'id': '2', 'href': 'https://raw.com/some2.img', },
      { 'id': '3', 'href': 'https://raw.com/some3.img', },
      ...
    ],
    'links': [
      { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
      ...
    ]
  }

  ```
  * example:

```javascript
  import { logger } from 'd3-vilog';
  // const logger = require('d3-vilog').logger;
  
  const data = {
    'nodes': [
      { 'id': '1' },
      { 'id': '2' },
      { 'id': '3' },
      { 'id': '4' },
    ],
    'links': [
      { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
      { 'source': '1', 'target': '3', 'width': 30, 'length': 50 },
      { 'source': '1', 'target': '4', 'width': 15, 'length': 150 },
    ]
  };
  logger({ data, dest: './', type: 'graph', import: 'local' });
```

### Result

  * https://asm-jaime.github.io/d3-vilog/
