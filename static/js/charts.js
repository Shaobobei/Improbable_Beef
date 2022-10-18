function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(data => data.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var Result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = Result.otu_ids;
    var otu_labels = Result.otu_labels;
    var sample_value = Result.sample_values;

    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_value);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids && otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_value.slice(0,10).reverse(),
        y: yticks,
        hover_text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
      }
  ]

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Culture Found",
      margin: { t: 100, l: 100 }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_value,
        hover_text: otu_labels,
        type: "bubble",
        mode: "markers",
        marker:
         {
          size: sample_value,
          color: otu_ids,
          colorscale: "Earth",
         },
      }
  ];

    // 2. Create the layout for the bubble chart.
      var bubbleLayout = 
      {
        title: "Bacteria Chart Per Sample",
        margin: { t: 30},
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { l: 50}
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //var resultArray = samples.filter(data => data.id == sample);
    var metaAarry = data.metadata.filter(data => data.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    // 5. Create a variable that holds the first sample in the array.
    //var Result = resultArray[0];
    var metaResult = metaAarry[0];

    // 3. Create a variable that holds the washing frequency.
    var washing_frequency = parseFloat(metaResult.wfreq);

    console.log(washing_frequency);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washing_frequency,
        title: "Scrubs per Week",
        gauge: {
          axis: { range: [0,10] },
          bar: { color: "black"},
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0,2], color: "red" },
            { range: [2,4], color: "orange" },
            { range: [4,6], color: "yellow" },
            { range: [6,8], color: "lightgreen" },
            { range: [8,10], color: "green" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      margin: { t: 25, l: 25,},  
      };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
