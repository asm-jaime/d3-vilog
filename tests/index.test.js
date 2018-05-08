'use strict';

const path = require('path');
const logger = require('../index.js').logger;

describe('graph', function() {
  it.skip('clear grpaph: ', function() {
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
    logger({ data, dest: __dirname, type: 'graph' });
  });
  it.skip('full cirled grpaph: ', function() {
    const data = {
      'nodes': [
        { 'id': '1', 'radius': 5, 'group': 2 },
        { 'id': '2', 'radius': 10, 'group': 2 },
        { 'id': '3', 'radius': 10, 'group': 4 },
        { 'id': '4', 'radius': 10, 'group': 4 },
        { 'id': '5', 'radius': 15, 'group': 4 },
        { 'id': '6', 'radius': 15, 'group': 4 },
      ],
      'links': [
        { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
        { 'source': '1', 'target': '3', 'width': 30, 'length': 300 },
        { 'source': '1', 'target': '4', 'width': 10, 'length': 150 },
        { 'source': '4', 'target': '5', 'width': 10, 'length': 250 },
        { 'source': '4', 'target': '6', 'width': 10, 'length': 250 },
      ]
    };
    logger({ data, dest: __dirname, type: 'graph' });
  });
  it.skip('pictured graph: ', function() {
    const data = {
      'nodes': [
        { 'id': '1', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/zsb-g_story.png' },
        { 'id': '2', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/emo-time-good-story.png' },
        { 'id': '3', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-green.png' },
        { 'id': '4', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-look.png' },
        { 'id': '5', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-t-up.png' },
        { 'id': '6', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-soo.png' },
        { 'id': '7', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-pojar.png' },
        { 'id': '8', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/yoba-pekach.png' },
        { 'id': '9', 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/butth-l.png' },
      ],
      'links': [
        { 'source': '1', 'target': '2', 'width': 5, 'length': 60 },
        { 'source': '1', 'target': '9', 'width': 5, 'length': 140 },
        { 'source': '2', 'target': '9', 'width': 5, 'length': 140 },
        { 'source': '9', 'target': '3', 'width': 1, 'length': 300 },
        { 'source': '9', 'target': '4', 'width': 1, 'length': 300 },
        { 'source': '9', 'target': '5', 'width': 1, 'length': 300 },
        { 'source': '9', 'target': '6', 'width': 1, 'length': 300 },
        { 'source': '9', 'target': '7', 'width': 1, 'length': 300 },
        { 'source': '9', 'target': '8', 'width': 1, 'length': 300 },
      ]
    };
    logger({ data, dest: __dirname, type: 'graph' });
  });
  it.skip('big graph: ', function() {
    const nodes = [];
    const links = [];
    const node = { 'id': '0', 'radius': 5, 'group': 2 };
    nodes.push(node);
    for (let i = 1; i < 1000; ++i) {
      const node = { 'id': i.toString(), 'radius': 5, 'group': 2 };
      const link = { 'source': (i - 1).toString(), 'target': node.id, 'width': 10, 'length': 100 };
      nodes.push(node);
      links.push(link);
    }
    const data = { nodes, links };
    logger({ data, dest: __dirname, type: 'graph' });
  });
});

describe('line', function() {
  it('line: ', function() {
    function generateData() {
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

    logger({
      data: generateData(),
      dest: __dirname, name: 'periodic', type: 'line',
      import: 'extern'
    });
  });
});
