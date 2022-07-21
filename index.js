const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#graph").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const x = d3.scaleLinear()
    .range([0, WIDTH])
    .domain([0, 10])

const y = d3.scaleLinear()
    .range([HEIGHT, 0])
    .domain([0, 50])


// Labels
const xLabel = g.append("text")
	.attr("y", HEIGHT + 50)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("X Label")
const yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Y Label")

// X Axis
const xAxisCall = d3.axisBottom(x)
g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
	.call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall)

d3.json("data/sample.json").then(data => {
    // Normal datapoints
    const normalData = data.data.filter(dp => dp.label == "normal").map(dp => {
        dp.x = Number(dp.x)
		dp.y = Number(dp.y)
        return dp
    })
    // Uncertain data
    const uncertainData = data.data.filter(dp => dp.label == "uncertain").map(dp => {
        xError = false
        yError = false
        if (typeof(dp.x) === "object") {
            dp.xvalue = Number(dp.x.value)
            xError = true
        } else {
            dp.xvalue = Number(dp.x)
        }
        if (typeof(dp.y) === "object") {
            dp.yvalue = Number(dp.y.value)
            yError = true
        } else {
            dp.yvalue = Number(dp.y)
        }
        dp.errorBars = []
        if (xError == true) {
            xMin = dp.xvalue * ((100 - dp.x.error) / 100)
            xMax = dp.xvalue * ((100 + dp.x.error) / 100)
            dp.errorBars.push({x1: xMin, y1: dp.yvalue, x2: xMax, y2: dp.yvalue})
        }
        if (yError == true) {
            yMin = dp.yvalue * ((100 - dp.y.error) / 100)
            yMax = dp.yvalue * ((100 + dp.y.error) / 100)
            dp.errorBars.push({x1: dp.xvalue, y1: yMin, x2: dp.xvalue, y2: yMax})
        }
        console.log(dp)
        return dp
    })

    // Uncertain Data (errorbars)
    const errorData = uncertainData.map(dp => dp.errorBars).flat()

    const normalDatapoints = g.selectAll("normalCircle")
        .data(normalData)
        .enter().append("circle")
        .attr("cy", d => y(d.y))
        .attr("cx", d => x(d.x))
        .attr("r", 4)
        .attr("fill", "grey")

    // Uncertain datapoints
    const uncertainDatapoints = g.selectAll("uncertainCircle")
        .data(uncertainData)
        .enter().append("circle")
        .attr("cy", d => y(d.yvalue))
        .attr("cx", d => x(d.xvalue))
        .attr("r", 4)
        .attr("fill", "lightgrey")
    
    const errorBars = g.selectAll("errorBar")
        .data(errorData)
        .enter().append("line")
        .attr("x1", d => x(d.x1))
        .attr("x2", d => x(d.x2))
        .attr("y1", d => y(d.y1))
        .attr("y2", d => y(d.y2))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
})

