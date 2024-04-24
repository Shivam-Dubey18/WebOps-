const log = console.log;

const { createChart } = LightweightCharts;

const chartProperties = {
  width:1500,
  height:600,
  timeScale:{
    timeVisible:true,
    secondsVisible:false,
  }
}

const domElement = document.getElementById('tvchart');

// if (domElement) {
const chart = LightweightCharts.createChart(domElement,chartProperties);
const candleSeries = chart.addCandlestickSeries();


fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo`)
  .then(res =>res.json())
  //   if(!res.ok){
  //       throw new Error('Failed to fetch data');
  //   }
  //   return 
    
  .then(data => {
    const timeSeriesData = data['Time Series (5min)'];
    const cdata = Object.keys(timeSeriesData).map(key => {
        const candleData = timeSeriesData[key];
        
        const [date, time] = key.split(' ');
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');

        const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      return {
        time: dateObj,
        open: parseFloat(candleData['1. open']),
        high: parseFloat(candleData['2. high']),
        low: parseFloat(candleData['3. low']),
        close: parseFloat(candleData['4. close']),
        volume: parseInt(candleData['5. volume'])
      };
    });
    candleSeries.setData(cdata);
  })
  .catch(err => log(err));
// }
// else{
//     log('Element with ID "tvchart" not found'); 
// }