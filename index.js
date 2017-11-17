'use strict';

const jsdom = require('jsdom');
const fs = require('fs');

export function logger(options = {}) {//{{{
  const options_def = {
    data: {},
    dest: './tests/some',
    type: 'graph',
    svg: { width: 900, height: 600 },
    margin: {top: 50, right: 50, bottom: 50, left: 50}
  };
  options = Object.assign({}, options_def, options);

  const format = new formats[options.type](options);
  const str_style = format.style();
  const str_script = format.script();

  // main struct
  const dom = new jsdom.JSDOM('<!DOCTYPE html>');
  const doc = dom.window.document;

  // set style
  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.type = 'text/css';
  style.textContent = str_style;
  head.appendChild(style);

  // set svg
  const svg = doc.createElement('svg');
  // svg.setAttribute('width', options.svg.width);
  // svg.setAttribute('height', options.svg.height);
  doc.body.appendChild(svg);

  // set d3 script
  const d3_script = doc.createElement('script');
  d3_script.src = 'https://d3js.org/d3.v4.min.js';
  doc.body.appendChild(d3_script);

  // set format data script
  const format_script = doc.createElement('script');
  format_script.textContent = str_script;
  doc.body.appendChild(format_script);

  fs.writeFileSync(`${options.dest}.html`, dom.serialize(), function() {
    console.log(`>> Exported '${options.dest}.html', open in a web browser`);
  });
}//}}}

// ========== enum all formats

const formats = {//{{{
  graph,
  chart_line,
};//}}}

// ========== graph

function graph(options) { //{{{
  this.options = options;
} //}}}

graph.prototype.style = function() { //{{{
  return `
    .links line { stroke: #999; stroke-opacity: 0.6; }
    .nodes circle { stroke: #fff; stroke-width: 0.5px; }
  `;
}; //}}}

graph.prototype.script = function() { //{{{
  const opt = this.options;
  const data = this.options.data;
  // var width = window.innerWidth - ${opt.margin.left} - ${opt.margin.right};
  // var height = window.innerHeight - ${opt.margin.top} - ${opt.margin.bottom};
  //
  // .append('g')
  //.attr("transform", "translate(" + ${opt.margin.left} + "," + ${opt.margin.top} + ")");
  var script = `
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;
    var graph = ${JSON.stringify(opt.data)};
    var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height);
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(function(d) { return d.id; })`;

  if(data['links'][0]['length']) {
    script += `
      .distance(function(d) {return d.length;}))`;
  } else {
    script += `
      .distance(100))`;
  }

  script +=`
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
    var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')`;

  if(data['links'][0]['width']) {
    script += `
    .attr('stroke-width', function(d) { return d.width; })`;
  } else {
    script += `
    .attr('stroke-width', 10)`;
  }


  script +=`
    var node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()`;

  if(data['nodes'][0]['href']) {
    script+=`
      .append('image')
      .attr('width', 32)
      .attr('height', 32)
      .attr('xlink:href', function(d) { return d.href})`;
  } else if (data['nodes'][0]['group']){
    script+= `
      .append('circle')`;
    if(data['nodes'][0]['radius']) {
      script+= `
      .attr('r', function(d) { return d.radius; })`;
    } else {
      script+= `
      .attr('r', 5)`;
    }
    script+= `
      .attr('fill', function(d) { return color(d.group); })`;
  } else {
    script+= `
      .append('circle')`;
    if(data['nodes'][0]['radius']) {
      script+= `
        .attr('r', function(d) { return d.radius; })`;
    } else {
      script+= `
        .attr('r', 5)`;
    }
    script+= `
      .attr('fill', 'black')`;
  }

  script+= `
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    node.append('title')
      .text(function(d) { return d.id; });
    simulation
      .nodes(graph.nodes)
      .on('tick', ticked);
    simulation.force('link')
      .links(graph.links);
    function ticked() {
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });`;

  if(data['nodes'][0]['href']) {
    script+= `
    node
      .attr('x', function(d) { return d.x - 16; })
      .attr('y', function(d) { return d.y - 16; });`;
  } else {
    script+= `
    node
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });`;
  }
  script+= `
    }
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }`;
  return script;
}; //}}}

// ========== line

function chart_line() { //{{{
} //}}}

// ========== formats
