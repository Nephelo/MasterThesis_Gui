/**
 * Created by Philipp on 31.12.2016.
 */
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChartInitially);

var data;
var maxValue = 0;
var startDate = new Date(0);
var dataDate = new Date(0);


function drawChartInitially() {
    $.ajax({
        url: "/data",
        dataType: "json",
        success: initChart
    });
}

function updateChart() {
    var transformations = transformationHandler.transformations;
    var set0 =[];
    var set1 = [];
    transformations.forEach(function (transform) {
        if(transform.transformationSet === 0) {
            set0.push(transform);
        } else {
            set1.push(transform);
        }
    });
    var transformationsString = JSON.stringify({
        0: set0,
        1: set1
    });

    console.log("Requesting data for transformation: " + transformationsString);
    $.ajax({
        type: "POST",
        url: "/data",
        data:  transformationsString,
        contentType: "application/json",
        dataType: "json",
        success: updateChartAfterData
    });

}

function initChart(jsonData) {
    data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Transformed Energy usage 1');
    data.addColumn('number', 'Transformed Energy usage 2');

    var date = 0;
    jsonData.forEach(function (value) {
        dataDate = new Date(startDate.getTime() + date * 1000 * 60);
        data.addRows([[dataDate, value, value]]);
        maxValue = Math.max(maxValue, value);
        date++;
    });

    var date_formatter = new google.visualization.DateFormat({
        pattern: "dd.MM.yyyy HH:mm:ss"
    });
    date_formatter.format(data, 0);

    drawChart();
}

function updateChartAfterData(jsonData) {
    for(var i = 0; i < jsonData[0].length; i++) {
        data.setValue(i, 1, jsonData[0][i]);
        data.setValue(i, 2, jsonData[1][i]);
        maxValue = Math.max(maxValue, Math.max(jsonData[0][i], jsonData[1][i]));
    }

    var date_formatter = new google.visualization.DateFormat({
        pattern: "dd.MM.yyyy HH:mm:ss"
    });
    date_formatter.format(data, 0);

    drawChart();
}

function drawChart() {
    var options = {
        chart: {
            title: 'Energy Usage'
        },
        width: 1800,
        height: 900,
        legend: {
            position: 'bottom'
        },
        explorer: {
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 0.01,
            maxZoomOut: 1
        },
        vAxis: {
            maxValue: maxValue,
            minValue: 0
        },
        hAxis: {
            viewWindow: {
                min: startDate,
                max: dataDate
            },
            gridlines: {
                count: -1,
                units: {
                    days: {format: ['MMM dd']},
                    hours: {format: ['HH:mm']}
                }
            },
            minorGridlines: {
                units: {
                    hours: {format: ['HH:mm:ss', 'ha']},
                    minutes: {format: ['HH:mm', ':mm']}
                }
            }
        }

    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}