var token = ""
var p = 1

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

var areaSeries = chart.addAreaSeries({
    topColor: 'rgba(33, 150, 243, 0.56)',
    bottomColor: 'rgba(33, 150, 243, 0.04)',
    lineColor: 'rgba(33, 150, 243, 1)',
    lineWidth: 2,
})

function getFIs(url, token){
    $.ajax({
        method: "GET",
        url: url,
        headers: { "Authorization": "Bearer " + token },
        success: function (result) {
            p +=1
            for (let i = 0; i < result.itens.length; i++){
                var fi = result.itens[i].nome
                var cnpj = result.itens[i].cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
                var newOption = new Option(fi, cnpj)
                document.getElementById("fi").add(newOption, undefined)
            }
            if(result.proximaPagina){
                getFIs("https://api.financialdata.io/fundos?nome=BRASIL&p="+p, token)
            }
        }
    })
}

function getFI(cnpj, token){
    $.ajax({
        method: "GET",
        url: "https://api.financialdata.io/fundos/"+cnpj,
        headers: { "Authorization": "Bearer " + token },
        success: function (result) {
            console.log(result) 
            document.getElementById("cnpj-fi").innerText = "CNPJ: " + result.cnpj
            document.getElementById("class-fi").innerText = "Classe: " + result.classe
        }
    })
}

function getEstatisticas(cnpj, token){
    $.ajax({
        method: "GET",
        url: "https://api.financialdata.io/fundos/"+cnpj+"/estatisticas",
        headers: { "Authorization": "Bearer " + token },
        success: function (result) {
            console.log(result)

            document.getElementById("ytd-fi").innerText = parseFloat(result.retornoYTD).toLocaleString() + "%"
            if(isNaN(result.retornoYTD)){
                document.getElementById("ytd-fi").innerText = "Sem informações"
            }
            if(parseFloat(result.retornoYTD) < 0){
                document.getElementById("ytd-fi").style.color = "#E27256"
            }
            else if(parseFloat(result.retornoYTD) > 0){
                document.getElementById("ytd-fi").style.color = "#98E39E"
            }
            else{
                document.getElementById("ytd-fi").style.color = "#E6E8E9"
            }

            document.getElementById("mtd-fi").innerText = parseFloat(result.retornoMTD).toLocaleString() + "%"
            if(isNaN(result.retornoMTD)){
                document.getElementById("mtd-fi").innerText = "Sem informações"
            }
            if(parseFloat(result.retornoMTD) < 0){
                document.getElementById("mtd-fi").style.color = "#E27256"
            }
            else if(parseFloat(result.retornoMTD) > 0){
                document.getElementById("mtd-fi").style.color = "#98E39E"
            }
            else{
                document.getElementById("mtd-fi").style.color = "#E6E8E9"
            }

            document.getElementById("pm-fi").innerText = parseFloat(result.piorMes).toLocaleString() + "%"
            if(isNaN(result.piorMes)){
                document.getElementById("pm-fi").innerText = "Sem informações"
            }

            document.getElementById("mm-fi").innerText = parseFloat(result.melhorMes).toLocaleString() + "%"
            if(isNaN(result.piorMes)){
                document.getElementById("mm-fi").innerText = "Sem informações"
            }

            document.getElementById("mp-fi").innerText = parseFloat(result.quantidadeMesesPositivos)
            if(isNaN(result.quantidadeMesesPositivos)){
                document.getElementById("mp-fi").innerText = "Sem informações"
            }

            document.getElementById("mn-fi").innerText = parseFloat(result.quantidadeMesesNegativos)
            if(isNaN(result.quantidadeMesesNegativos)){
                document.getElementById("mn-fi").innerText = "Sem informações"
            }



            if(result.situacao === "CANCELADA"){
                document.getElementById("mtd-fi").innerText = "Fundo cancelado"
                document.getElementById("ytd-fi").innerText = "Fundo cancelado"
                document.getElementById("mm-fi").innerText = "Fundo cancelado"
                document.getElementById("pm-fi").innerText = "Fundo cancelado"
                document.getElementById("mn-fi").innerText = "Fundo cancelado"
                document.getElementById("mp-fi").innerText = "Fundo cancelado"
            }
        }
    })
}

function getCotas(cnpj, token){
    var date = new Date()
    $.ajax({
        method: "GET",
        url: `https://api.financialdata.io/fundos/${cnpj}/cotas?dataInicio=2000-1-1&dataFim=${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        headers: { "Authorization": "Bearer " + token },
        success: function (result) {
            console.log(result) 

            for (let i = 0; i < result.length; i++) {
                result[i].value = result[i].valor

                delete result[i].valor
            }

            for (let i = 0; i < result.length; i++) {
                result[i].time = result[i].data

                delete result[i].data
            }

            areaSeries.setData(result)
        }
    })
}

$.ajax({
    method: "POST",
    dataType: "text",
    contentType: "application/json; charset=utf-8",
    url: "https://api.financialdata.io/token",
    data: JSON.stringify({
        usuario: "uruser",
        senha: "urpassword"
    }),
    success: function (result) {
        token = result
        getFIs("https://api.financialdata.io/fundos?nome=BRASIL", token)
    }
})

function selectClicked(select){
    $.ajax({
        method: "POST",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        url: "https://api.financialdata.io/token",
        data: JSON.stringify({
            usuario: "uruser",
            senha: "urpassword"
        }),
        success: function (result) {
            token = result
            getFI(select.options[select.selectedIndex].value, token)
            getEstatisticas(select.options[select.selectedIndex].value, token)
            getCotas(select.options[select.selectedIndex].value, token)
        }
    })
}