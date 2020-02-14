function applyHistoryChartData(data) {
    const margin = { top: 50, right: 50, bottom: 90, left: 75 };
    const width = 500;
    const height = 200;

    // Create SVG element
    const svg = d3
        .select("#chart")
        .append("svg")
        .attr("viewBox", (-margin.left) + " " + (-margin.top) + " " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));

    // Set up scales
    const bisectDate = d3.bisector(function(d) {
        return +Date.parse(d.date);
    }).left;
    const maxY = Math.max(
        d3.max(data, function(d) {
            return d.items;
        }),
        d3.max(data, function(d) {
            return d.alerts;
        })
    );
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, function(d) {
            return +Date.parse(d.date);
        }))
        .range([0, width]);
    const yScale = d3
        .scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);

    // Append axis to the chart
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3
            .axisBottom(xScale)
            .tickFormat(function(d){
                return d3.timeFormat("%H:%M")(d)
            })
        );
    svg
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    // Create & append line chart
    const line = d3.line()
        .x(function(d) { return xScale(+Date.parse(d.date)); })
        .y(function(d) { return yScale(d.items);  });
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // Create & append area chart
    const area = d3.area()
        .x(function(d) { return xScale(new Date(d.date)); })
        .y0(yScale(0))
        .y1(function(d) { return yScale(d.alerts); });
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Create & append selector line
    const selector = svg
        .append("g")
        .attr("class", "selector");
    selector
        .append("path")
        .attr("d", "M-4," + (-0.3 * margin.top) + " h8 l-4,6 z");
    selector
        .append("path")
        .attr("d", "M0," + (-0.3 * margin.top) + " v" + (height + margin.top));

    // Create a transparent rect over the chart to handle mouse events
    svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", function () {
            const x = d3.mouse(this)[0];
            const date = +Date.parse(xScale.invert(x));
            const idx = bisectDate(data, date);

            selector
                .attr("transform", "translate(" + x + ")");

            console.log("items: ", data[idx].items);
            console.log("alerts: ", data[idx].alerts);
        });
}
