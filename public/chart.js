var chart = LightweightCharts.createChart(document.getElementById("chart"), {
    height: 279,
	layout: {
		backgroundColor: "#131517",
		textColor: "#E6E8E9",
        fontFamily: "system-ui"
	},
	grid: {
		vertLines: {
			color: "#5f62695e",
		},
		horzLines: {
			color: "#5f62695e",
		},
	},
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
	rightPriceScale: {
		borderColor: "rgba(197, 203, 206, 0.8)",
	},
	timeScale: {
		borderColor: "rgba(197, 203, 206, 0.8)",
	},
})

var candleSeries = chart.addCandlestickSeries({
    upColor: "#98E39E",
    downColor: "#E27256",
    borderDownColor: "#E27256",
    borderUpColor: "#98E39E",
    wickDownColor: "#E27256",
    wickUpColor: "#98E39E",
})

function updateChart(chart, cc, c, interval){
    var dates = []
    var opens = []
    var highs = []
    var lows = []
    var closes = []

    fetch(`https://api.binance.com/api/v1/klines?symbol=${cc.toUpperCase()}${c.toUpperCase()}&interval=${interval}`)
    .then(res => res.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            dates.push(new Date(data[i][0]).toISOString().split("T")[0])
            opens.push(data[i][1])
            highs.push(data[i][2])
            lows.push(data[i][3])
            closes.push(data[i][4])
        }

        var d = []
        for (let i = 0; i < dates.length; i++) {
            var dataObject = {}
            dataObject["time"] = dates[i]
            dataObject["open"] = opens[i]
            dataObject["high"] = highs[i]
            dataObject["low"] = lows[i]
            dataObject["close"] = closes[i]
    
            d.push(dataObject)
        }

        d = d.sort((a, b) => a.time - b.time)
        chart.setData(d)
    })
}

function selectChanged(){
    updateChart(candleSeries, document.getElementById("crypto").value, "brl", document.getElementById("interval").value)
}

updateChart(candleSeries, document.getElementById("crypto").value, "brl", document.getElementById("interval").value)
