'use strict';

// import chai from 'chai';
// const expect = chai.expect;

import { logger } from '../index.js';

describe('graph', function() {
  it.skip('clear grpaph: ', function() {//{{{
    const data = {
      'nodes': [
        { 'id': '1'},
        { 'id': '2'},
        { 'id': '3'},
        { 'id': '4'},
      ],
      'links': [
        { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
        { 'source': '1', 'target': '3', 'width': 30, 'length': 50 },
        { 'source': '1', 'target': '4', 'width': 15, 'length': 150 },
      ]
    };
    logger({data, dest: './tests/clear_graph', type: 'graph' });
  });//}}}
  it.skip('full cirled grpaph: ', function() {//{{{
    const data = {
      'nodes': [
        { 'id': '1','radius': 5, 'group': 2},
        { 'id': '2','radius': 10, 'group': 2},
        { 'id': '3','radius': 10, 'group': 4},
        { 'id': '4','radius': 10, 'group': 4},
        { 'id': '5','radius': 15, 'group': 4},
        { 'id': '6','radius': 15, 'group': 4},
      ],
      'links': [
        { 'source': '1', 'target': '2', 'width': 10, 'length': 100 },
        { 'source': '1', 'target': '3', 'width': 30, 'length': 300 },
        { 'source': '1', 'target': '4', 'width': 10, 'length': 150 },
        { 'source': '4', 'target': '5', 'width': 10, 'length': 250 },
        { 'source': '4', 'target': '6', 'width': 10, 'length': 250 },
      ]
    };
    logger({data, dest: './tests/full_circle_graph', type: 'graph' });
  });//}}}
  it.skip('pictured graph: ', function() {//{{{
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
    logger({data, dest: './tests/pictured_graph', type: 'graph' });
  });//}}}
  it('big graph: ', function() {//{{{
    const nodes = [];
    const links = [];
    const node = { 'id': '0','radius': 5, 'group': 2};
    nodes.push(node);
    for(let i = 1; i < 1000; ++i){
      const node = { 'id': i.toString(),'radius': 5, 'group': 2};
      const link = { 'source': (i-1).toString(), 'target': node.id, 'width': 10, 'length': 100 };
      nodes.push(node);
      links.push(link);
    }
    const data = {nodes, links};
    logger({data, dest: './tests/big_graph', type: 'graph' });
  });//}}}
});
