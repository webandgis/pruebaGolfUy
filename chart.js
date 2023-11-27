/* const ctx = document.querySelector('#myChart')


const responseData = await fetch('arb_mvd.geojson')
const data2 = await responseData.json()

 //Rendericar Chart

 let initialChartData = {
    datasets: [{
        label: "Árboles registrados por la Intedencia",
        data: [],
        backgroundColor: 'rgb(97, 179, 75)',
        borderColor: 'rgb(40, 149, 10)',
        borderWidth: 3,
        hoverBackgroundColor: 'rgb(149, 10, 10)',
        hoverBorderColor: 'rgb(149, 10, 10)',
    }]
};


let chartOptioncs={
    scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Diametro',
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
            labelString: 'Altura',
          },
          ticks: {
            beginAtZero: true,
            max: 11,
            stepSize: 1,
          },
        }],
      },
      maintainAspectRatio: false,
}

let chart= new Chart(ctx,{
    type:'scatter',
    data:initialChartData,
    datasets:chartOptioncs
})

function renderAll(){
    let scatterPlotDataArray=[]
   data2.features.forEach(function(e){
    scatterPlotDataArray.push({
        x:e.properties.ALTURA,
        y:e.properties.DISTANCIA,
        lat:e.properties.y,
        long:e.properties.x
    })
   })

   chart.data.datasets[0].data=scatterPlotDataArray
   chart.update()
}

//renderizar al mover el mapa
map.on('moveend', renderAll);
map.on('zoomend', renderAll);

renderAll()
 */