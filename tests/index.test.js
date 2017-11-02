'use strict';

// import chai from 'chai';
// const expect = chai.expect;

import { output, line } from '../index.js';

describe('view: ', function() { //{{{
  it('output line', function() {
    const log = [];
    for (let dt = 0; dt < 100; ++dt) {
      log.push({ key: dt, value: dt });
    }
    output('./tests/log', line({ data: log }));
  });
}); //}}}
