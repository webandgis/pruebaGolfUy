async function initMap() {
  // DOM
  const ctx = document.querySelector('#myChart');
  const searchInput = document.querySelector('#filter');
  const matchList = document.querySelector('.collection');
  const list = document.querySelector('#list');
 
  const pindicator1=document.querySelector('#pindicator')
  const pindicator=document.querySelector('#pindicator1')

  const map = await L.map('map').setView([-34.922784, -56.165629], 16);
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {}).addTo(map);

  // Points
  const responseData = await fetch('arb_mvd.geojson');
  const data = await responseData.json();
  let pointMarker = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      let pointStyle = {
        radius: 4,
        color: '#C7FDB9',
        fillColor: '#61B34B'
      };
      return L.circleMarker(latlng, pointStyle);
    }
  }).addTo(map);

  pointMarker.bindTooltip(function (layer) {
    return `<b>Nombre:</b>${layer.feature.properties.NOM_CIENTI}<br><b>Tipo:</b> ${layer.feature.properties.DESC_TIPO}`;
  });

  //update the indicators

  let dataArb=[]
  let dataId=[]

  //Desault values
  pindicator1.innerHTML = "</br> 1000";
  pindicator.innerHTML = "</br> 30%";

//Interactivity
pointMarker.on('mouseover',function(e){
  dataArb=[e.layer.feature.properties.DISTANCIA]
  dataId=[e.layer.feature.properties.ID_ESPECIE]

  pindicator1.innerHTML="</br>"+dataArb+" árboles"
  pindicator.innerHTML="</br>"+dataId+"%"
})

pointMarker.on('mouseout',function(e){
  if(pindicator1.innerHTML!==dataArb.toString){
    pindicator1.innerHTML = "</br> 1000";
    pindicator.innerHTML = "</br> 30"
  }
})

pointMarker.on('click', function(e) {
  const latlng = e.latlng;
  const currentZoom = map.getZoom();
  const newZoom = currentZoom + 2;

  map.setView(latlng, newZoom);
});
//Filter input
searchInput.addEventListener('input', function() {
  const searchText = this.value.trim();

  // Clear previous filters
  pointMarker.clearLayers();

  const filterData = data.features.filter(function(feature) {
    const id = feature.properties.ID_NEW.toString(); 
    return id.includes(searchText);
  });

  // Change the color of the point
  L.geoJson(filterData, {
    pointToLayer: function(feature, latlng) {
      let pointStyle = {
        radius: 4,
        color: '#C7FDB9',
        fillColor: '#61B34B'
      };
      return L.circleMarker(latlng, pointStyle);
    }
  }).addTo(pointMarker);

  if (filterData.length > 0) {
    const firstPoint = filterData[0];
    const latlng = L.latLng(firstPoint.properties.y, firstPoint.properties.x);
    map.panTo(latlng);
  }
});


  // Render Chart
  let initialChartData = {
    datasets: [{
      label: "Árboles registrados por la Intendencia",
      data: [],
      backgroundColor: 'rgb(201, 255, 205)',
      borderColor: 'rgb(201, 255, 205)',
      borderWidth: 3,
      color:'white',
      hoverBackgroundColor: 'rgb(149, 10, 10)',
      hoverBorderColor: 'rgb(149, 10, 10)',
    }],

    
  };
  
  
  let initialBarChartData = {
    labels: [],
    datasets: [{
      label: "Especies de Árboles ",
      data: [],
      backgroundColor: 'rgb(161, 207, 215)',
      borderColor: 'rgb(161, 207, 215)',
      borderWidth: 1,
    }],
    
  };
  
  
  let chartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Diameter',
        },
        ticks: {
          beginAtZero: true,
          max: 10,
          stepSize: 2,
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Height',
          
        },
        ticks: {
          beginAtZero: true,
          max: 10,
          stepSize: 1,
        },
        
      }],
    },
    maintainAspectRatio: false,
  };
  
  let barChartOptions = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Especie',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Cantidad de Árboles',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      }],
    },
    maintainAspectRatio: false,
  };
  
  let chart = new Chart(document.getElementById('myChart').getContext('2d'), {
    type: 'scatter',
    data: initialChartData,
    options: chartOptions
  });
  
  let barChart = new Chart(document.getElementById('myChartBar').getContext('2d'), {
    type: 'bar',
    data: initialBarChartData,
    options: barChartOptions
  });
  
  function renderAll() {
    let scatterPlotDataArray = [];
    let barChartDataArray = [];
    const bounds = map.getBounds();
  
    data.features.forEach(function (e) {
      const latlng = L.latLng(e.properties.y, e.properties.x);
  
      if (bounds.contains(latlng)) {
        scatterPlotDataArray.push({
          x: e.properties.DISTANCIA * 100,
          y: e.properties.DISTANCIA,
          COMMON: e.properties.ID_ESPECIE
        });
  
        barChartDataArray.push(e.properties.NOM_CIENTI);
      }
    });
  
    // Update scatter plot data
    chart.data.datasets[0].data = scatterPlotDataArray;
    chart.update();
  
    // Update bar chart data
    initialBarChartData.labels = Array.from(new Set(barChartDataArray));
    let speciesCount = {};
    barChartDataArray.forEach(function (especie) {
      speciesCount[especie] = (speciesCount[especie] || 0) + 1;
    });
    initialBarChartData.datasets[0].data = initialBarChartData.labels.map(label => speciesCount[label]);
    barChart.update();
  
 
    //Bar Chart

    // Update list
    list.innerHTML = "";
    scatterPlotDataArray.forEach(function (x) {
      let entry = '<li class="list-item">' + x.COMMON + "</li>";
      list.innerHTML += entry;
    });


    
  }

  renderAll();

  map.on('moveend', renderAll);
}

initMap();
