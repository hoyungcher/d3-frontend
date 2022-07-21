const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#graph-1").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// Scales
const x = d3.scaleLog()
    .base(5)
    .range([0, WIDTH])
    .domain([1000, 100000])

const y = d3.scaleLinear()
    .range([HEIGHT, 0])
    .domain([60, 90])



// Labels
const xLabel = g.append("text")
	.attr("y", HEIGHT + 50)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)")
const yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expectancy (Years)")

// X Axis
const xAxisCall = d3.axisBottom(x)
	.tickValues([2000, 10000, 50000])
	.tickFormat(d3.format("$"));
g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
	.call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall)

d3.json("data/scatterplot.json").then(data => {
    const formattedData = data.countries.map(country => {
        country.income = Number(country.income)
		country.life_exp = Number(country.life_exp)
        return country
    })
    console.log(formattedData)

    const datapoints = g.selectAll("circle")
        .data(formattedData)

    datapoints.enter().append("circle")
        .attr("cy", d => y(d.life_exp))
        .attr("cx", d => x(d.income))
        .attr("r", 5)
        .attr("fill", "grey")
})