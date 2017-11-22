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

  // main struct
  const dom = new jsdom.JSDOM('<!DOCTYPE html>');
  options.doc = dom.window.document;

  const format = new formats[options.type](options);
  format.import_style();
  format.import_scripts();

  fs.writeFileSync(`${options.dest}.html`, dom.serialize(), function() {
    console.log(`>> Exported '${options.dest}.html', open in a web browser`);
  });
}//}}}

// ========== enum all formats

const formats = {//{{{
  graph,
  line,
};//}}}

// ========== graph

function graph(options) { //{{{
  this.options = options;
} //}}}

graph.prototype.import_style = function() { //{{{
  const doc = this.options.doc;
  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.type = 'text/css';
  style.textContent = `
    .links line { stroke: #999; stroke-opacity: 0.6; }
    .nodes circle { stroke: #fff; stroke-width: 0.5px; }
  `;
  head.appendChild(style);
}; //}}}

graph.prototype.import_scripts = function() { //{{{
  const d3_script = this.options.doc.createElement('script');
  d3_script.src = 'https://d3js.org/d3.v4.min.js';
  this.options.doc.body.appendChild(d3_script);

  const format_script = this.options.doc.createElement('script');
  format_script.textContent = this.main_script();
  this.options.doc.body.appendChild(format_script);
}; //}}}

graph.prototype.main_script = function() { //{{{
  const data = this.options.data;
  console.log(data);
  var script = `
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;
    var graph = ${JSON.stringify(data)};
    var svg = d3.select('body').insert('svg')
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

function line(options) { //{{{
  this.options = options;
} //}}}

line.prototype.import_style = function() { //{{{
  const doc = this.options.doc;
  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.type = 'text/css';
  style.textContent = `
#main_wrapper {
  margin: 0;
  padding: 0;
  overflow: none;
}

.nvtooltip {
  position: absolute;
  background-color: rgba(255,255,255,1);
  padding: 10px;
  border: 1px solid #ddd;

  font-family: Arial;
  font-size: 13px;

  transition: opacity 500ms linear;
  -moz-transition: opacity 500ms linear;
  -webkit-transition: opacity 500ms linear;

  transition-delay: 500ms
  -moz-transition-delay: 500ms;
  -webkit-transition-delay: 500ms;

  -moz-box-shadow: 4px 4px 12px rgba(0,0,0,.5);
  -webkit-box-shadow: 4px 4px 12px rgba(0,0,0,.5);
  box-shadow: 4px 4px 12px rgba(0,0,0,.5);

  -moz-border-radius: 15px;
  border-radius: 15px;
}

.nvtooltip h3 {
  margin: 0;
  padding: 0;
  text-align: center;
}

.nvtooltip p {
  margin: 0;
  padding: 0;
  text-align: center;
}

.nvtooltip span {
  display: inline-block;
  margin: 2px 0;
}

text {
  font: 12px sans-serif;
}

.legend .series {
  cursor: pointer;
}

.legend circle {
  stroke-width: 2px;
}

.legend .disabled circle {
  fill-opacity: 0;
}

.axis path {
  fill: none;
  stroke: #000;
  stroke-opacity: .75;
  shape-rendering: crispEdges;
}

.axis path.domain {
  stroke-opacity: .75;
}

.axis line {
  fill: none;
  stroke: #000;
  stroke-opacity: .25;
  shape-rendering: crispEdges;
}

.axis line.zero {
  stroke-opacity: .75;
}

.point-paths path {
  stroke-opacity: 0;
  fill-opacity: 0;
}

.lines path {
  fill: none;
  stroke-width: 1.5px;
  stroke-linecap: round;

  transition: stroke-width 250ms linear;
  -moz-transition: stroke-width 250ms linear;
  -webkit-transition: stroke-width 250ms linear;

  transition-delay: 250ms
  -moz-transition-delay: 250ms;
  -webkit-transition-delay: 250ms;
}

.line.hover path {
  stroke-width: 6px;
}

.lines .point {
  transition: stroke-width 250ms linear;
  -moz-transition: stroke-width 250ms linear;
  -webkit-transition: stroke-width 250ms linear;
}

.lines .point.hover {
  stroke-width: 20px;
  stroke-opacity: .5;
}`;

  head.appendChild(style);
}; //}}}

line.prototype.import_scripts = function() { //{{{
  const d3 = this.options.doc.createElement('script');
  d3.src = 'https://d3js.org/d3.v2.min.js';
  this.options.doc.body.appendChild(d3);

  const jq = this.options.doc.createElement('script');
  jq.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  this.options.doc.body.appendChild(jq);

  const main = this.options.doc.createElement('script');
  main.textContent = this.main_script();
  this.options.doc.body.appendChild(main);
}; //}}}

line.prototype.main_script = function() { //{{{
  const res_data = this.options.data;
  const script =`
function log(text) {
  if (console && console.log) console.log(text);
  return text;
}

(function($) {
  var nvtooltip = window.nvtooltip = {};
  nvtooltip.show = function(pos, content, gravity, dist) {
    var container = $('<div class="nvtooltip">');

    gravity = gravity || 's';
    dist = dist || 20;

    container
      .html(content)
      .css({ left: -1000, top: -1000, opacity: 0 })
      .appendTo('body');

    var height = container.height() + parseInt(container.css('padding-top')) + parseInt(container.css('padding-bottom')),
      width = container.width() + parseInt(container.css('padding-left')) + parseInt(container.css('padding-right')),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      scrollTop = $('body').scrollTop(),
      left, top;

    switch (gravity) {
      case 'e':
      case 'w':
      case 'n':
        left = pos[0] - (width / 2);
        top = pos[1] + dist;
        if (left < 0) left = 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (scrollTop + windowHeight < top + height) top = pos[1] - height - dist;
        break;
      case 's':
        left = pos[0] - (width / 2);
        top = pos[1] - height - dist;
        if (left < 0) left = 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (scrollTop > top) top = pos[1] + dist;
        break;
    }

    container
      .css({
        left: left,
        top: top,
        opacity: 1
      });
  };

  nvtooltip.cleanup = function() {
    var tooltips = $('.nvtooltip');

    // remove right away, but delay the show with css
    tooltips.css({
      'transition-delay': '0 !important',
      '-moz-transition-delay': '0 !important',
      '-webkit-transition-delay': '0 !important'
    });

    tooltips.css('opacity', 0);

    setTimeout(function() {
      tooltips.remove()
    }, 500);
  };

})(jQuery);

var nv = { models: {} };

nv.models.legend = function() {
  var margin = { top: 5, right: 0, bottom: 5, left: 10 },
    width = 400,
    height = 20,
    color = d3.scale.category10().range(),
    dispatch = d3.dispatch('legendClick', 'legendMouseover', 'legendMouseout');


  function chart(selection) {
    selection.each(function(data) {
      var wrap = d3.select(this).selectAll('g.legend').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'legend').append('g');

      var g = wrap.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var series = g.selectAll('.series')
        .data(function(d) { return d });
      var seriesEnter = series.enter().append('g').attr('class', 'series')
        .on('click', function(d, i) {
          dispatch.legendClick(d, i);
        })
        .on('mouseover', function(d, i) {
          dispatch.legendMouseover(d, i);
        })
        .on('mouseout', function(d, i) {
          dispatch.legendMouseout(d, i);
        });
      seriesEnter.append('circle')
        .style('fill', function(d, i) { return d.color || color[i % 10] })
        .style('stroke', function(d, i) { return d.color || color[i % 10] })
        .attr('r', 5);
      seriesEnter.append('text')
        .text(function(d) { return d.label })
        .attr('text-anchor', 'start')
        .attr('dy', '.32em')
        .attr('dx', '8');
      series.classed('disabled', function(d) { return d.disabled });
      series.exit().remove();

      var ypos = 5,
        newxpos = 5,
        maxwidth = 0,
        xpos;
      series
        .attr('transform', function(d, i) {
          var length = d3.select(this).select('text').node().getComputedTextLength() + 28;
          xpos = newxpos;
          if (width < margin.left + margin.right + xpos + length) {
            newxpos = xpos = 5;
            ypos += 20;
          }

          newxpos += length;
          if (newxpos > maxwidth) maxwidth = newxpos;
          return 'translate(' + xpos + ',' + ypos + ')';
        });

      //position legend as far right as possible within the total width
      g.attr('transform', 'translate(' + (width - margin.right - maxwidth) + ',' + margin.top + ')');
      height = margin.top + margin.bottom + ypos + 15;
    });

    return chart;
  }

  chart.dispatch = dispatch;
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  return chart;
}

nv.models.line = function() {
  var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = 960,
    height = 500,
    dotRadius = function() { return 2.5 },
    color = d3.scale.category10().range(),
    //Create semi-unique ID incase user doesn't select one
    id = Math.floor(Math.random() * 10000),
    x = d3.scale.linear(),
    y = d3.scale.linear(),
    dispatch = d3.dispatch("pointMouseover", "pointMouseout"),
    x0, y0;

  function chart(selection) {
    selection.each(function(data) {
      var seriesData = data.map(function(d) { return d.data });

      x0 = x0 || x;
      y0 = y0 || y;

      //add series data to each point for future ease of use
      data = data.map(function(series, i) {
        series.data = series.data.map(function(point) {
          point.series = i;
          return point;
        });
        return series;
      });

      x.domain(d3.extent(d3.merge(seriesData), function(d) { return d[0] }))
        .range([0, width - margin.left - margin.right]);
      y.domain(d3.extent(d3.merge(seriesData), function(d) { return d[1] }))
        .range([height - margin.top - margin.bottom, 0]);

      var vertices = d3.merge(data.map(function(line, lineIndex) {
        return line.data.map(function(point, pointIndex) {
          var pointKey = line.label + '-' + point[0];
          return [x(point[0]), y(point[1]), lineIndex, pointIndex]; //adding series index to point because data is being flattened
        })
      }));

      var wrap = d3.select(this).selectAll('g.d3line').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'd3line').append('g');

      gEnter.append('g').attr('class', 'lines');
      gEnter.append('g').attr('class', 'point-clips');
      gEnter.append('g').attr('class', 'point-paths');

      var g = wrap.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var voronoiClip = gEnter.append('g').attr('class', 'voronoi-clip')
        .append('clipPath')
        .attr('id', 'voronoi-clip-path-' + id)
        .append('rect');
      wrap.select('.voronoi-clip rect')
        .attr('x', -10)
        .attr('y', -10)
        .attr('width', width - margin.left - margin.right + 20)
        .attr('height', height - margin.top - margin.bottom + 20);
      wrap.select('.point-paths')
        .attr('clip-path', 'url(#voronoi-clip-path-' + id + ')');

      var pointClips = wrap.select('.point-clips').selectAll('.clip-path')
        .data(vertices);
      pointClips.enter().append('clipPath').attr('class', 'clip-path')
        .append('circle')
        .attr('r', 25);
      pointClips.exit().remove();
      pointClips
        .attr('id', function(d, i) { return 'clip-' + id + '-' + d[2] + '-' + d[3] })
        .attr('transform', function(d) { return 'translate(' + d[0] + ',' + d[1] + ')' });

      var voronoi = d3.geom.voronoi(vertices).map(function(d, i) {
        return { 'data': d, 'series': vertices[i][2], 'point': vertices[i][3] }
      });

      var pointPaths = wrap.select('.point-paths').selectAll('path')
        .data(voronoi);
      pointPaths.enter().append('path')
        .attr('class', function(d, i) { return 'path-' + i; });
      pointPaths.exit().remove();
      pointPaths
        .attr('clip-path', function(d) { return 'url(#clip-' + id + '-' + d.series + '-' + d.point + ')'; })
        .attr('d', function(d) { return 'M' + d.data.join(',') + 'Z'; })
        .on('mouseover', function(d) {
          dispatch.pointMouseover({
            point: data[d.series].data[d.point],
            series: data[d.series],
            pos: [x(data[d.series].data[d.point][0]) + margin.left, y(data[d.series].data[d.point][1]) + margin.top],
            pointIndex: d.point,
            seriesIndex: d.series
          });
        })
        .on('mouseout', function(d) {
          dispatch.pointMouseout({
            point: d,
            series: data[d.series],
            pointIndex: d.point,
            seriesIndex: d.series
          });
        });

      dispatch.on('pointMouseover.point', function(d) {
        wrap.select('.line-' + d.seriesIndex + ' .point-' + d.pointIndex)
          .classed('hover', true);
      });

      dispatch.on('pointMouseout.point', function(d) {
        wrap.select('.line-' + d.seriesIndex + ' .point-' + d.pointIndex)
          .classed('hover', false);
      });

      var lines = wrap.select('.lines').selectAll('.line')
        .data(function(d) { return d }, function(d) { return d.label });
      lines.enter().append('g')
        .style('stroke-opacity', 1e-6)
        .style('fill-opacity', 1e-6);
      d3.transition(lines.exit())
        .style('stroke-opacity', 1e-6)
        .style('fill-opacity', 1e-6)
        .remove();
      lines.attr('class', function(d, i) { return 'line line-' + i })
        .classed('hover', function(d) { return d.hover })
        .style('fill', function(d, i) { return color[i % 10] })
        .style('stroke', function(d, i) { return color[i % 10] })
      d3.transition(lines)
        .style('stroke-opacity', 1)
        .style('fill-opacity', .5);


      var paths = lines.selectAll('path')
        .data(function(d, i) { return [d.data] });
      paths.enter().append('path')
        .attr('d', d3.svg.line()
          .x(function(d) { return x0(d[0]) })
          .y(function(d) { return y0(d[1]) })
        );
      paths.exit().remove();
      d3.transition(paths)
        .attr('d', d3.svg.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
        );

      var points = lines.selectAll('circle.point')
        .data(function(d) { return d.data });
      points.enter().append('circle')
        .attr('cx', function(d) { return x0(d[0]) })
        .attr('cy', function(d) { return y0(d[1]) });
      points.exit().remove();
      points.attr('class', function(d, i) { return 'point point-' + i });
      d3.transition(points)
        .attr('cx', function(d) { return x(d[0]) })
        .attr('cy', function(d) { return y(d[1]) })
        .attr('r', dotRadius());

    });

    x0 = x;
    y0 = y;

    return chart;
  }

  nv.strip = function(s) {
    return s.replace(/(\\s|&)/g, '');
  }

  chart.dispatch = dispatch;
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  chart.dotRadius = function(_) {
    if (!arguments.length) return dotRadius;
    dotRadius = d3.functor(_);
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };

  return chart;
}

nv.models.lineWithLegend = function() {
  var margin = { top: 30, right: 10, bottom: 50, left: 60 },
    width = 960,
    height = 500,
    dotRadius = function() { return 2.5 },
    xAxisLabelText = false,
    yAxisLabelText = false,
    color = d3.scale.category10().range(),
    dispatch = d3.dispatch('showTooltip', 'hideTooltip');

  var x = d3.scale.linear(),
    y = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(x).orient('bottom'),
    yAxis = d3.svg.axis().scale(y).orient('left'),
    legend = nv.models.legend().height(30).color(color),
    lines = nv.models.line();

  function chart(selection) {
    selection.each(function(data) {
      var series = data.filter(function(d) { return !d.disabled })
        .map(function(d) { return d.data });

      x.domain(d3.extent(d3.merge(series), function(d) { return d[0] }))
        .range([0, width - margin.left - margin.right]);

      y.domain(d3.extent(d3.merge(series), function(d) { return d[1] }))
        .range([height - margin.top - margin.bottom, 0]);

      lines
        .width(width - margin.left - margin.right)
        .height(height - margin.top - margin.bottom)
        .color(data.map(function(d, i) {
          return d.color || color[i % 10];
        }).filter(function(d, i) { return !data[i].disabled }))

      xAxis
        .ticks(width / 100)
        .tickSize(-(height - margin.top - margin.bottom), 0);
      yAxis
        .ticks(height / 36)
        .tickSize(-(width - margin.right - margin.left), 0);

      var wrap = d3.select(this).selectAll('g.wrap').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'wrap d3lineWithLegend').append('g');

      gEnter.append('g').attr('class', 'legendWrap');
      gEnter.append('g').attr('class', 'x axis');
      gEnter.append('g').attr('class', 'y axis');
      gEnter.append('g').attr('class', 'linesWrap');


      legend.dispatch.on('legendClick', function(d, i) {
        d.disabled = !d.disabled;

        if (!data.filter(function(d) { return !d.disabled }).length) {
          data.forEach(function(d) {
            d.disabled = false;
          });
        }

        selection.transition().call(chart)
      });

      legend.dispatch.on('legendMouseover', function(d, i) {
        d.hover = true;
        selection.transition().call(chart)
      });

      legend.dispatch.on('legendMouseout', function(d, i) {
        d.hover = false;
        selection.transition().call(chart)
      });

      lines.dispatch.on('pointMouseover.tooltip', function(e) {
        dispatch.showTooltip({
          point: e.point,
          series: e.series,
          pos: [e.pos[0] + margin.left, e.pos[1] + margin.top],
          seriesIndex: e.seriesIndex,
          pointIndex: e.pointIndex
        });
      });

      lines.dispatch.on('pointMouseout.tooltip', function(e) {
        dispatch.hideTooltip(e);
      });

      legend
        .color(color)
        .width(width / 2 - margin.right);

      wrap.select('.legendWrap')
        .datum(data)
        .attr('transform', 'translate(' + (width / 2 - margin.left) + ',' + (-legend.height()) + ')')
        .call(legend);

      margin.top = legend.height(); //need to re-render to see update

      var g = wrap.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var linesWrap = wrap.select('.linesWrap')
        .datum(data.filter(function(d) { return !d.disabled }));

      d3.transition(linesWrap).call(lines);

      var xAxisLabel = g.select('.x.axis').selectAll('text.axislabel')
        .data([xAxisLabelText || null]);
      xAxisLabel.enter().append('text').attr('class', 'axislabel')
        .attr('text-anchor', 'middle')
        .attr('x', x.range()[1] / 2)
        .attr('y', margin.bottom - 20);
      xAxisLabel.exit().remove();
      xAxisLabel.text(function(d) { return d });

      g.select('.x.axis')
        .attr('transform', 'translate(0,' + y.range()[0] + ')')
        .call(xAxis)
        .selectAll('line.tick')
        .filter(function(d) { return !d })
        .classed('zero', true);

      var yAxisLabel = g.select('.y.axis').selectAll('text.axislabel')
        .data([yAxisLabelText || null]);
      yAxisLabel.enter().append('text').attr('class', 'axislabel')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('y', 20 - margin.left);
      yAxisLabel.exit().remove();
      yAxisLabel
        .attr('x', -y.range()[0] / 2)
        .text(function(d) { return d });

      g.select('.y.axis')
        .call(yAxis)
        .selectAll('line.tick')
        .filter(function(d) { return !d })
        .classed('zero', true);
    });
    return chart;
  }

  chart.dispatch = dispatch;
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  chart.dotRadius = function(_) {
    if (!arguments.length) return dotRadius;
    dotRadius = d3.functor(_);
    lines.dotRadius = d3.functor(_);
    return chart;
  };

  //Expose the x-axis' tickFormat method.
  chart.xAxis = {};
  d3.rebind(chart.xAxis, xAxis, 'tickFormat');

  chart.xAxis.label = function(_) {
    if (!arguments.length) return xAxisLabelText;
    xAxisLabelText = _;
    return chart;
  }

  // Expose the y-axis' tickFormat method.
  chart.yAxis = {};
  d3.rebind(chart.yAxis, yAxis, 'tickFormat');

  chart.yAxis.label = function(_) {
    if (!arguments.length) return yAxisLabelText;
    yAxisLabelText = _;
    return chart;
  }
  return chart;
}

$(document).ready(function() {
  var margin = { top: 30, right: 10, bottom: 50, left: 60 },
    chart = nv.models.lineWithLegend()
    .xAxis.label('X->')
    .width(width(margin))
    .height(height(margin))
    .yAxis.label('Y->');

  var svg = d3.select('body')
    .append('div').attr('id', 'main_wrapper')
    .append('svg')
    .datum(${JSON.stringify(res_data)})

  svg.transition().duration(500)
    .attr('width', width(margin))
    .attr('height', height(margin))
    .call(chart);

  chart.dispatch.on('showTooltip', function(e) {
    var offset = $('#main_wrapper').offset(), // { left: 0, top: 0 }
      left = e.pos[0] + offset.left,
      top = e.pos[1] + offset.top,
      formatter = d3.format(".04f");

    var content = '<h3>' + e.series.label + '</h3>' +
      '<p>' +
      '<span class="value">[' + e.point[0] + ', ' + formatter(e.point[1]) + ']</span>' +
      '</p>';

    nvtooltip.show([left, top], content);
  });

  chart.dispatch.on('hideTooltip', function(e) {
    nvtooltip.cleanup();
  });

  $(window).resize(function() {
    var margin = chart.margin();

    chart
      .width(width(margin))
      .height(height(margin));

    d3.select('#main_wrapper svg')
      .attr('width', width(margin))
      .attr('height', height(margin))
      .call(chart);
  });

  function width(margin) {
    var w = $(window).width() - 40;
    return ((w - margin.left - margin.right - 20) < 0) ? margin.left + margin.right + 2 : w;
  }

  function height(margin) {
    var h = $(window).height() - 40;
    return (h - margin.top - margin.bottom - 20 < 0) ?
      margin.top + margin.bottom + 2 : h;
  }
});
`;
  return script;
}; //}}}
