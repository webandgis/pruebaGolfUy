async function initMap() {
    const map = L.map('map').setView([-34.905693, -56.184797], 10);
  
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {}).addTo(map);
  
    try {
      const responseData = await fetch('arb_mvd.geojson');
      const data = await responseData.json();
  
      let pointMarker = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          let pointStyle = {
            radius: 4,
            color: '#C7FDB9',
            fillColor: '#61B34B',
          };
          return L.circleMarker(latlng, pointStyle);
        },
      }).addTo(map);
  
      pointMarker.bindTooltip(function (layer) {
        return `<b>Nombre:</b>${layer.feature.properties.NOM_CIENTI}<br><b>Tipo:</b> ${layer.feature.properties.DESC_TIPO}`;
      });
  
      // Create the Chart.js chart
      const ctx = document.querySelector('#myChart');
      
      let initialChartData = {
        datasets: [{
          label: 'ÁRBOLES INTENDENCIA DE MONTEVIDEO',
          data: [],
          backgroundColor: 'rgb(97, 179, 75)',
          borderColor: 'rgb(40, 149, 10)',
          borderWidth: 3,
          hoverBackgroundColor: 'rgb(149, 10, 10)',
          hoverBorderColor: 'rgb(149, 10, 10)',
        }],
      };
  
      let chartOptions = {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Diametro',
            },
            ticks: {
              beginAtZero: true,
              max: 150,
              stepSize: 50,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Altura',
            },
            ticks: {
              beginAtZero: true,
              max: 250,
              stepSize: 50,
            },
          }],
        },
        maintainAspectRatio: false,
      };
  
      let chart = new Chart(ctx, {
        type: 'scatter',
        data: initialChartData,
        options: chartOptions
      });
  
      function renderAll() {
        let scatterPlotDataArray = [];
  
        // Loop through GeoJSON features and extract data
        data.features.forEach(function (feature) {
          scatterPlotDataArray.push({
            x: feature.properties.DISTANCIA,
            y: feature.properties.ALTURA,
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
          });
        });
  
        // Update chart data and redraw the chart
        chart.data.datasets[0].data = scatterPlotDataArray;
        chart.update();
      }
  
      // Call the renderAll function when the map is moved or zoomed
      map.on('moveend', renderAll);
      map.on('zoomend', renderAll);
  
      // Initial render
      renderAll();
    } catch (error) {
      throw new Error('Error al mostrar archivo geojson verifique');
    }
  }
  
  initMap();
  