function setPrice(cc, c){
    var socket = new WebSocket(`wss://stream.binance.com:9443/ws/${cc}${c}@trade`)
    /*
    {
    "e": "aggTrade",  // Event type
    "E": 123456789,   // Event time
    "s": "BNBBTC",    // Symbol
    "a": 12345,       // Aggregate trade ID
    "p": "0.001",     // Price
    "q": "100",       // Quantity
    "f": 100,         // First trade ID
    "l": 105,         // Last trade ID
    "T": 123456785,   // Trade time
    "m": true,        // Is the buyer the market maker?
    "M": true         // Ignore
    }
    */
    var lastPrice = null

    socket.onmessage = (e) => {
        var data = JSON.parse(e.data)
        var price = parseFloat(data.p).toLocaleString()
        document.getElementById(`${cc}`).innerText = "R$" + price

        if(price > lastPrice){
            document.getElementById(`${cc}`).style.color = "#98E39E"
            document.getElementById(`${cc}-chart-icon`).setAttribute("name", "trending-up")
            document.getElementById(`${cc}-chart-icon`).setAttribute("color", "#98E39E")
        }
        else if(price < lastPrice){
            document.getElementById(`${cc}`).style.color = "#E27256"
            document.getElementById(`${cc}-chart-icon`).setAttribute("name", "trending-down")
            document.getElementById(`${cc}-chart-icon`).setAttribute("color", "#E27256")
        }
        else{
            document.getElementById(`${cc}`).style.color = "#E6E8E9"
            document.getElementById(`${cc}-chart-icon`).setAttribute("name", "")
            document.getElementById(`${cc}-chart-icon`).setAttribute("color", "#E6E8E9")
        }

        lastPrice = price
    }
}

setPrice("btc", "brl")
setPrice("eth", "brl")
setPrice("doge", "brl")
setPrice("xrp", "brl")
