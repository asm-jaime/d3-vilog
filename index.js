'use strict';

const D3Node = require('d3-node');
const fs = require('fs');

module.exports.output = function output( //{{{
  dest, d3n, options = { html: false, svg: true }
) {
  const d3 = d3n.d3;

  function eachGeoQuantize() {
    const coords = d3.select(this).attr('d') || '';
    const rounded = coords.replace(/[0-9]*\.[0-9]*/g, (x) => (+x).toFixed(4));
    d3.select(this).attr('d', rounded);
  }

  // reduce filesize of svg
  d3n.d3Element.selectAll('path').each(eachGeoQuantize);

  if (options.html) {
    const html = d3n.html();
    fs.writeFile(`${dest}.html`, html, function() {
      console.log(`>> Exported "${dest}.html", open in a web browser`);
    });
  }

  if (options.svg) {
    const svgString = d3n.svgString();
    fs.writeFile(`${dest}.svg`, svgString, function() {
      console.log(`>> Exported "${dest}.svg"`);
    });
  }
}; //}}}

module.exports.line = function line({ //{{{
  data,
  selector: _selector = '#chart',
  container: _container = '<div id="ct"><h2>ch</h2><div id="chart"></div></div>',
  style: _style = '',
  width: _width = 960,
  height: _height = 500,
  margin: _margin = { top: 20, right: 20, bottom: 60, left: 30 },
  lineWidth: _lineWidth = 1.5,
  lineColor: _lineColor = 'steelblue',
  isCurve: _isCurve = true,
  tickSize: _tickSize = 5,
  tickPadding: _tickPadding = 5,
} = {}) {
  const d3n = new D3Node({
    selector: _selector,
    svgStyles: _style,
    container: _container,
  });
  const d3 = d3n.d3;

  const width = _width - _margin.left - _margin.right;
  const height = _height - _margin.top - _margin.bottom;

  const svg = d3n.createSVG(_width, _height)
    .append('g')
    .attr('transform', `translate(${_margin.left}, ${_margin.top})`);

  const g = svg.append('g');

  const xScale = d3.scaleLinear()
    .rangeRound([0, width]);
  const yScale = d3.scaleLinear()
    .rangeRound([height, 0]);
  const xAxis = d3.axisBottom(xScale)
    .tickSize(_tickSize)
    .tickPadding(_tickPadding);
  const yAxis = d3.axisLeft(yScale)
    .tickSize(_tickSize)
    .tickPadding(_tickPadding);

  const lineChart = d3.line()
    .x(d => xScale(d.key))
    .y(d => yScale(d.value));

  if (_isCurve) lineChart.curve(d3.curveBasis);

  xScale.domain(d3.extent(data, d => d.key));
  yScale.domain(d3.extent(data, d => d.value));

  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  g.append('g').call(yAxis);

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', _lineColor)
    .attr('stroke-width', _lineWidth)
    .attr('d', lineChart);

  return d3n;
} //}}}
