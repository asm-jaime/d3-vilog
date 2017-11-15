'use strict';

// import chai from 'chai';
// const expect = chai.expect;

import { logger } from '../index.js';

describe('d3-log: ', function() {
  it('logger: ', function() {
    const data = {
      'nodes': [
        { 'id': 'butth1', 'group': 2, 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/butth-l.png'},
        { 'id': 'butth2', 'group': 2, 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/butth-l.png'},
        { 'id': 'butth3', 'group': 2, 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/butth-l.png'},
        { 'id': 'butth4', 'group': 2, 'href': 'https://raw.githubusercontent.com/asm-jaime/yoba-package/master/pic.size(128x128)/butth-l.png'},
      ],
      'links': [
        { 'source': 'butth1', 'target': 'butth2', 'value': 10 },
        { 'source': 'butth1', 'target': 'butth3', 'value': 30 },
        { 'source': 'butth1', 'target': 'butth4', 'value': 1500 },
      ]
    };
    logger('docs/index', data);
  });
  it.skip('graph: ', function() {
    const data = {
      'nodes': [
        { 'id': 'Myriel', 'group': 1 },
        { 'id': 'Napoleon', 'group': 1 },
      ],
      'links': [
        { 'source': 'Napoleon', 'target': 'Myriel', 'value': 1 },
        { 'source': 'Mlle.Baptistine', 'target': 'Myriel', 'value': 8 },
      ]
    };
    // console.log(graph(data));
  });
});
