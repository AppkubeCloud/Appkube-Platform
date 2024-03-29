import React, { Component, RefObject } from 'react';
import * as d3 from 'd3';
interface DataItem {
  date: Date;
  last_quarter: number;
  current_quarter: number;
  forecasted_spend: number;
}
interface Props {
  data: DataItem[];
}
class MultiLineChart extends Component<Props> {
  private svgRef: RefObject<SVGSVGElement>;
  constructor(props: Props) {
    super(props);
    this.svgRef = React.createRef();
  }
  componentDidMount() {
    this.renderChart();
  }
  componentDidUpdate() {
    this.renderChart();
  }
  renderChart = () => {
    const { data } = this.props;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 880 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(this.svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.last_quarter, d.current_quarter, d.forecasted_spend)) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);
    const line = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.last_quarter)!);
    const line2 = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.current_quarter)!);
    const line3 = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.forecasted_spend)!);
    const line4 = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.forecasted_spend)!);
    const line5 = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.forecasted_spend)!);
    const line6 = d3
      .line<DataItem>()
      .curve(d3.curveCardinal)
      .x((d) => xScale(d.date)!)
      .y((d) => yScale(d.forecasted_spend)!);
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 4)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('$')
      );
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#a145ff')
      .attr('stroke-width', 1.5)
      .attr('d', line);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f9629a')
      .attr('stroke-width', 1.5)
      .attr('d', line2);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f9a558')
      .attr('stroke-width', 1.5)
      .attr('d', line3);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f8d13f')
      .attr('stroke-width', 1.5)
      .attr('d', line4);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#89e044')
      .attr('stroke-width', 1.5)
      .attr('d', line5);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#78d36e')
      .attr('stroke-width', 1.5)
      .attr('d', line6);
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
    const bisectDate = d3.bisector<DataItem, Date>((d) => d.date).left;
    function mousemove(event: MouseEvent) {
      const x0 = xScale.invert(d3.pointer(event, svg.node())[0]);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          `<div>Date: 
          ${d.date.toDateString()}</div><div>Last Quarter: ${d.last_quarter}</div><div>Current Quarter: 
          ${d.current_quarter}</div><div>Forecasted Spend: ${d.forecasted_spend}</div>`
        )
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');
    }
    function mouseout() {
      tooltip.transition().duration(500).style('opacity', 0);
    }
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  };
  render() {
    return (
      <div className="multi-line-chart">
        <svg ref={this.svgRef} width="880" height="400"></svg>
      </div>
    );
  }
}
export default MultiLineChart;
