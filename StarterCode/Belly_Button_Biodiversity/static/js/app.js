function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then((data)=>{
    var panel = d3.select("#sample-metadata")
    panel.html("")
    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  })
   
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ); 
 
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
   d3.json(`/samples/${sample}`).then((topTen) => {
      var sample_values = topTen.sample_values;
      var otu_ids = topTen.otu_ids;
      var otuLabels = topTen.otu_labels;
      var bubbleObject = {
        margin: {t:0},
        hovermode: 'closest',
        xaxis: {title: 'OTU IDs'
      }
      };
      var bubbleList = [{
        x: otu_ids,
        y: sample_values,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }]
      Plotly.plot("bubble", bubbleList, bubbleObject);
      
      var pieData = [
        {
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otuLabels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
        var pieLayout = {
          margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("pie", pieData, pieLayout);

      });

  }



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
