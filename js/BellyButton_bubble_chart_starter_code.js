// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot(); 

    // 1. Create the trace for the bubble chart.
    var bubbleChart = [
      {
        x: otu_Ids,
        y: sample_value,
        hover_text: otu_Labels,
        mode: "marker",
        marker: {
          size: sample_value,
          color: otu_Ids,
          colorscale: "Earth",
        },
        type: "bubble"
      }
  ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterica Chart Per Sample",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleChart, bubbleLayout);
  });
}
