'use strict';

const jsdom = require('jsdom');
const fs = require('fs');

export function logger(dest, data) {
  const gp = new graph();

  const dom = new jsdom.JSDOM('<!DOCTYPE html><p>butth</p>');
  const doc = dom.window.document;

  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.type = 'text/css';
  style.textContent = gp.style();
  head.appendChild(style);

  const svg = doc.createElement('svg');
  svg.setAttribute('width', 900);
  svg.setAttribute('height', 600);
  doc.body.appendChild(svg);

  const script = doc.createElement('script');
  script.src = 'https://d3js.org/d3.v4.min.js';
  doc.body.appendChild(script);

  const script_gp = doc.createElement('script');
  script_gp.textContent = gp.script(data);
  doc.body.appendChild(script_gp);

  fs.writeFileSync(`${dest}.html`, dom.serialize(), function() {
    console.log(`>> Exported '${dest}.html', open in a web browser`);
  });
}

function graph() {
}

graph.prototype.style = function() { //{{{
  return '' +
    '.links line { stroke: #999; stroke-opacity: 0.6; stroke-width: 10px; } ' +
    '.nodes circle { stroke: #fff; stroke-width: 0.5px; }';
}; //}}}

graph.prototype.script = function(data) { //{{{
  return `
    var graph = ${JSON.stringify(data)};
    var svg = d3.select('svg'),
      width = +svg.attr('width'),
      height = +svg.attr('height');
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink().distance(120).id(function(d) { return d.id; }))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
    var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-width', function(d) { return Math.sqrt(d.value); });
    var node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('image')
      .attr('width', 64)
      .attr('height', 64)
      .attr("xlink:href", function(d) { return d.href})
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
      //.append('circle')
      //.attr('r', 5)
      //.attr('fill', function(d) { return color(d.group); })
    node.append('title')
      .text(function(d) { return d.id; });
    // node.append('svg:image')
      // .attr('x', -9)
      // .attr('y', -12)
      // .attr('width', 20)
      // .attr('height', 24)
      // .attr("xlink:href", function(d) { return d.href});
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
        .attr('y2', function(d) { return d.target.y; });
      node
        .attr('x', function(d) { return d.x - 32; })
        .attr('y', function(d) { return d.y - 32; });
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
}; //}}}
