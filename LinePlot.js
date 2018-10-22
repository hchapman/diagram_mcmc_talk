     const LinePlot = (() => {
         const xScale = d3.scaleLinear();
         const yScale = d3.scaleLinear();

         const xAxis = d3.axisBottom(xScale).tickArguments([5]);
         const yAxis = d3.axisLeft(yScale).tickArguments([5]);

         let margin = {top: 20, right: 40, bottom: 120, left: 120};

         let data;
         let width;
         let height;

         let xLabel;
         let yLabel;

         let xAxisLabelOffset = 100;
         let yAxisLabelOffset = -90;

         let xRawDomain;
         let yRawDomain;

         let lines = [];
         let g;

         let xAxisG;
         let yAxisG;

         let hasLegend = true;

         function to_filtered_linedata(l, data) {
             return d3.line()
                      .x(d => xScale(l.x(d)))
                      .y(d => yScale(l.y(d)))(data.filter(d => !isNaN(l.y(d))))
         };

         function to_filtered_areaerror(l, data) {
             return d3.area()
                      .x(d => xScale(l.x(d)))
                      .y0(d => yScale(l.y(d) - l.yerr(d)))
                      .y1(d => yScale(l.y(d) + l.yerr(d)))(data.filter(d => !isNaN(l.y(d))));
         };

         const my = selection => {
             const innerWidth = width - margin.left - margin.right;
             const innerHeight = height - margin.top - margin.bottom;

             g = selection.selectAll('.container').data([null]);
             const gEnter = g.enter().append('g').attr('class', 'container');

             g = gEnter
                 .merge(g)
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);

             const xAxisGEnter = gEnter.append('g').attr('class', 'x-axis');
             xAxisG = xAxisGEnter
                 .merge(g.select('.x-axis'))
                 .attr('transform', `translate(0, ${innerHeight})`);
             xAxisGEnter
                 .append('text')
                 .attr('class', 'axis-label')
                 .attr('y', xAxisLabelOffset)
                 .style('text-anchor', 'middle')
                 .merge(xAxisG.select('.axis-label'))
                 .attr('x', innerWidth / 2)
                 .text(xLabel);

             const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
             yAxisG = yAxisGEnter
                 .merge(g.select('.y-axis'));
             yAxisGEnter
                 .append('text')
                 .attr('class', 'axis-label')
                 .attr('y', yAxisLabelOffset)
                 .style('text-anchor', 'middle')
                 .merge(yAxisG.select('.axis-label'))
                 .attr('x', -innerHeight / 2)
                 .attr('transform', `rotate(-90)`)
                 .text(yLabel);

             xScale
                 .domain(xRawDomain)
                 .range([0, innerWidth])
                 .nice();

             yScale
                 .domain(yRawDomain)
                 .range([innerHeight, 0])
                 .nice();

             xAxisG.call(xAxis);
             yAxisG.call(yAxis);

             g.append("clipPath")
                 .attr("id", "clip")
                 .append("rect")
                 .attr("width", innerWidth)
                 .attr("height", innerHeight);

             const errors = g.selectAll('.path-error').data(lines);
             errors
                 .enter()
                 .append("path")
                 .attr("class", l => l.cls)
                 .classed("area", true)
                 .classed("path-error", true)
                 .attr("clip-path", "url(#clip)");

             g.selectAll('.path-error')
              .attr("d", l => to_filtered_areaerror(l, data));

             const paths = g.selectAll('.path-data').data(lines);
             paths
                 .enter()
                 .append('path')
                 .attr('fill', 'none')
                 .attr('class', l => l.cls)
                 .classed('path-data', true)
                 .classed('chart-zoom', true)
                 .attr("clip-path", "url(#clip)");
             g.selectAll('.path-data')
              .attr('d', l => to_filtered_linedata(l, data));

             var ordinal = d3.scaleOrdinal()
                             .domain(lines.map(l => l.title))
                             .range(lines.map(l => l.cls));

             if(hasLegend) {
                 let legend = d3.legendColor()
                     .useClass(true)
                     .scale(ordinal);
                 
                 g.append("g")
                     .attr("class", "legend")
                     .attr("transform", "translate(20,20)");

                 g.select('.legend')
                     .call(legend);
             }
         };

         my.addLine = function(line) {
             lines.push(line);
             return my;
         };

         my.margin = function(_) {
             return arguments.length ? (margin = _, my) : margin;
         };

         my.data = function(_) {
             return arguments.length ? (data = _, my) : data;
         };

         my.width = function(_) {
             return arguments.length ? (width = _, my) : width;
         };

         my.height = function(_) {
             return arguments.length ? (height = _, my) : height;
         };

         my.xValue = function(_) {
             return arguments.length ? (xValue = _, my) : xValue;
         };

         my.xLabel = function(_) {
             return arguments.length ? (xLabel = _, my) : xLabel;
         };

         my.yValue = function(_) {
             return arguments.length ? (yValue = _, my) : yValue;
         };

         my.yLabel = function(_) {
             return arguments.length ? (yLabel = _, my) : yLabel;
         };

         my.colorValue = function(_) {
             return arguments.length ? (colorValue = _, my) : colorValue;
         };

         my.colorLabel = function(_) {
             return arguments.length ? (colorLabel = _, my) : colorLabel;
         };

         my.colorLegendX = function(_) {
             return arguments.length ? (colorLegendX = _, my) : colorLegendX;
         };

         my.colorLegendY = function(_) {
             return arguments.length ? (colorLegendY = _, my) : colorLegendY;
         };

         my.colorLegendLabelX = function(_) {
             return arguments.length ? (colorLegendLabelX = _, my) : colorLegendLabelX;
         };

         my.colorLegendLabelY = function(_) {
             return arguments.length ? (colorLegendY = _, my) : colorLegendY;
         };

         my.xAxisLabelOffset = function(_) {
             return arguments.length ? (xAxisLabelOffset = _, my) : xAxisLabelOffset;
         };

         my.yAxisLabelOffset = function(_) {
             return arguments.length ? (yAxisLabelOffset = _, my) : yAxisLabelOffset;
         };

         my.xRawDomain = function(_) {
             return arguments.length ? (xRawDomain = _, my) : xRawDomain;
         };

         my.yRawDomain = function(_) {
             return arguments.length ? (yRawDomain = _, my) : yRawDomain;
         };

         my.viewPort = function(v) {
             xRawDomain = [v[0],v[2]];
             yRawDomain = [v[1],v[3]];
             return my;
         };

         my.hasLegend = function(_) {
             return arguments.length ? (hasLegend = _, my) : hasLegend;
         };

         my.circleOpacity = function(_) {
             return arguments.length ? (circleOpacity = _, my) : circleOpacity;
         };

         my.circleRadius = function(_) {
             return arguments.length ? (circleRadius = _, my) : circleRadius;
         };

         my.zoomTo = function(rect) {
             x0 = rect[0];
             y0 = rect[1];
             x1 = rect[2];
             y1 = rect[3];

             xRawDomain = [x0, x1];
             yRawDomain = [y0, y1];

             xScale.domain(xRawDomain);
             yScale.domain(yRawDomain);
             var t = g.transition().duration(750);
             xAxisG.transition(t).call(xAxis);
             yAxisG.transition(t).call(yAxis);

             g.selectAll('.path-error').transition(t)
              .attr("d", l => to_filtered_areaerror(l, data));

             d3.selectAll(".path-data").transition(t)
               .attr('d', l => to_filtered_linedata(l, data));

         };

         return my;
     });
