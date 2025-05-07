// 1. ACCESS DATA *******************************

  //This loads the csv data file using the d3.csv() method. We have added error handling in case the file fails to load. 
  d3.csv("./sectors.csv", function(error, data) {
    if (error) {
      throw error;
    }
  
    
    data.forEach(d => {
      d.sector = d.sector.trim();
      d.pfas_sites = +d.pfas_sites;
    });

    console.log(data[0]);

  const Tooltip = d3.select("#chart1")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("pointer-events", "none");  



// 2. DRAW CANVAS  *******************************

//Select the SVG element from the HTML
// Define the width and margins

const container = d3.select("#chart1");
  const svg = container.append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "0 0 800 700")
    .classed("svg-content-responsive", true);

  const margin = { top: 100, right: 100, bottom: 150, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

// 3. CREATE SCALES   *******************************

//Define the scales for the x-axis and y-axis
  //Need to define domain (input) and range (output)
    //domain is empty, will define later based on data
    //range is the width (for x) or height (for y) of the svg
  //padding adds space between bars

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .padding(0.4),

  yScale = d3
    .scaleLinear()
    .range([height, 0]);

//Here we add a group element to our SVG. We will add our axes and bars to the group element. We add a transform attribute to position our graph with some margin. 

// Here we provide our domain values to the x and y scales. 
  //We use data.map() to map our discrete year values to the x scale. 
  xScale
    .domain(data.map(function(d) { return d.sector; }));
  
  //And we use d3.max() function to input our domain [0,max] value for y axis.
  yScale
    .domain([0, d3.max(data, function(d) { return +d.pfas_sites; })]);

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-30)");

  g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d3.format(",")))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("fill", "black")
    .attr("font-size", "1.25em")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Sites that potentially use PFAS");



 // 5. DRAW AXIS   *******************************

//This adds the axes to the SVG


const formatSites = d3.format(",");

  //We add another group element to have our x-axis grouped under one group element. We then use the transform attribute to shift our x-axis towards the bottom of the SVG. 
  
  // Define all three event handler functions
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
    
    // Debug info
    console.log("Mouseover data:", d);
  }
  //We add another group element to have our x-axis grouped under one group element. We then use the transform attribute to shift our x-axis towards the bottom of the SVG. 
  var mousemove = function(d) {
    // For older D3 versions (prior to v6)
    var mousePosition = d3.mouse ? d3.mouse(this) : [d3.event.offsetX, d3.event.offsetY];
    
    // Or for container-relative positioning
    const container = document.getElementById("chart1");
    const bounds = container.getBoundingClientRect();
    const x = d3.event ? (d3.event.clientX - bounds.left) : mousePosition[0];
    const y = d3.event ? (d3.event.clientY - bounds.top) : mousePosition[1];
    
    Tooltip
      .html(`<strong>${d.sector}</strong><br>Sites: ${formatSites(d.pfas_sites)}`)
      .style("left", (x + 10) + "px")
      .style("top", (y - 28) + "px");
  }

  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8);
  }

  // Add bars with event handlers
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.sector))
    .attr("y", d => yScale(d.pfas_sites))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.pfas_sites))
    .style("fill", "#e55d34")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);


// Source and labels
svg.append("text")
  .attr("x", 100)
  .attr("y", height + margin.top + 110)
  .attr("font-size", ".8em")
  .attr("font-style", "italic")
  .text("Source: U.S. Environmental Protection Agency | By Apurva Mahajan");

svg.append("text")
  .attr("x", 400)
  .attr("y", height + margin.top + 85)
  .attr("text-anchor", "middle")
  .attr("fill", "black")
  .attr("font-size", "1.25em")
  .attr("font-weight", "bold")
  .text("Sector");

const head = svg.append("text")
  .attr("x", 100)
  .attr("y", 10)
  .attr("font-size", "24px")
  .attr("font-weight", "bold");

head.append("tspan")
  .attr("x", 100)
  .attr("dy", "1em")
  .text("Oil and gas facilities are overwhelmingly likely to use");

head.append("tspan")
  .attr("x", 100)
  .attr("dy", "1em")
  .text("PFAS chemicals");

svg.append("text")
  .attr("x", 100)
  .attr("y", 80)
  .attr("font-size", "16px")
  .text("More than 36,000 sites that potentially handle PFAS are part of the oil and gas industry.");
});






  
   

 
  // Add annotation
    // Based on this custom annotations library: https://d3-graph-gallery.com/graph/custom_annotation.html#minimal

//////////////////// treemap 



var container = d3.select("#my_dataviz");
var boundingRect = container.node().getBoundingClientRect();
var width = boundingRect.width;
var height = width; 
var margin = { top: 105, right: 100, bottom: 30, left: 10 };

var customPalette = [
  "#058896",
  "#233d4d", 
  "#e55d34",
  "#fcca46",
  "#84005a",
  "#a1c181",
  

   
];


// Legend group



// Append the svg object to the div
var svg3 = container
  .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("width", "100%")
    .style("height", "auto")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load CSV 
d3.csv("./pfas_treemap.csv", function(error, data) {
  if (error) throw error;

  // Stratify data
  var root = d3.stratify()
    .id(function(d) { return d.site; })
    .parentId(function(d) { return d.industry; })
    (data);

  root.sum(function(d) { return +d.total_pfas_level; });

  // colors
  var industries = [...new Set(data.map(d => d.industry).filter(d => d && d !== "root"))];
  var colorScale = d3.scaleOrdinal()
    .domain(industries) 
    .range(customPalette);  

  
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root);

  // Add rectangles
  svg3.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", function(d) { 
        return colorScale(d.data.industry);
      });

  function wrapText(text, width) {
    var words = text.split(' ');
    var line = [];
    var lines = [];
    var lineWidth = 0;
    var maxWidth = width - 10;  

    words.forEach(function(word) {
      line.push(word);
      lineWidth = line.join(' ').length * 8; 

      if (lineWidth > maxWidth) {
        lines.push(line.join(' '));
        line = [word];
        lineWidth = word.length * 6;  
      }
    });

    lines.push(line.join(' ')); 
    return lines;
  }

  // Add labels
  svg3.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d) { return d.x0 + 5; }) 
      .attr("y", function(d) { return d.y0 + 15}) 
      .text(function(d) { return d.data.site + " | " + d.data.total_pfas_level; })
      .attr("font-size", "10px")
      .attr("fill", "white")
      .each(function(d) {
        var boxWidth = d.x1 - d.x0;
        var lines = wrapText(d.data.site, boxWidth);

        var lineHeight = 12;  
        var startY = d.y0 + 5;  

        d3.select(this)
          .text("")  
          .attr("dy", function(d) {
            return startY + lineHeight * lines.indexOf(d) + "px";
          })
          .each(function(d, i) {
            d3.select(this).append("tspan")
              .attr("x", d.x0 + 5)  
              .attr("dy", i ? lineHeight : 0)
              .text(lines[i]);
          });
      });

  
  // title
  var head = svg3.append("text")
  .attr("x", 0)
  .attr("y", -100)
  .attr("font-size", "24px")
  .attr("font-weight", "bold");

// First line: "Military facilities" in yellow, rest in white
head.append("tspan")
  .attr("x", 10)
  .attr("dy", "1em")
  .attr("fill", "#058896")
  .text("Military facilities");

head.append("tspan")
  .attr("fill", "black") // Rest of the text in white
  .text(" comprised 78% of the 50 sites with the highest total");

// Second line
head.append("tspan")
  .attr("x", 10)
  .attr("dy", "1.2em")
  .attr("fill", "black")
  .text("confirmed PFAS levels over the past two decades");

  // subtitle

  var sub = svg3.append("text")
    .attr("x", 10)
    .attr("dy", "1em")
    .attr("font-size", "16px")

  sub.append("tspan")
    .attr("x", 10)
    .attr("y", -40)
    .text("The former England Air Force Base in Rapides Parish, Louisiana, contributed 33 million parts per trillion of PFAS");

  sub.append("tspan")
    .attr("x", 10)
    .attr("dy", "1em")
    .text("to the environment, the highest level of PFAS contamination in the country — all from one sample.");

  // footer/source
  svg3.append("text")
    .attr("x", 10)  
    .attr("y", height + 20)  
    .attr("font-size", ".8em")
    .attr("font-style", "italic")
    .text("Source: U.S. Environmental Protection Agency | By Apurva Mahajan");


    var legend = svg3.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + 20}, 0)`);  // 20px to the right of the main chart
  
  // Legend items
  industries.forEach(function(industry, i) {
    var legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 22})`);  // vertical spacing between rows
  
    // Color box
    legendRow.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(industry));
  
    // Label
    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text(industry);
  });
  
});
