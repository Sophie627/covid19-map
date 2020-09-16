var Dates = [
    '2020-04-14',
    '2020-04-13',
    '2020-04-10',
    '2020-04-09',
    '2020-04-08',
    '2020-04-07',
    '2020-04-03',
    '2020-04-02',
    '2020-04-01',
    '2020-03-31',
    '2020-03-30',
    '2020-03-27',
    '2020-03-26',
    '2020-03-25',
    '2020-03-24',
    '2020-03-23',
    '2020-03-20',
    '2020-03-19',
    '2020-03-18',
    '2020-03-17',
    '2020-03-16',
    '2020-03-13',
    '2020-03-12',
    '2020-03-11',
    '2020-03-10',
    '2020-03-09',
    '2020-03-06',
    '2020-03-05',
    '2020-03-04',
    '2020-03-03',
    '2020-03-02',
    '2020-02-28',
    '2020-02-27',
    '2020-02-26',
    '2020-02-25',
    '2020-02-24',
    '2020-02-21',
    '2020-02-20',
    '2020-02-19',
    '2020-02-18',
    '2020-02-17',
    '2020-02-14',
    '2020-02-13',
    '2020-02-12',
    '2020-02-11',
    '2020-02-10',
    '2020-02-07',
    '2020-02-06',
    '2020-02-05',
    '2020-02-04',
    '2020-02-03',
    '2020-01-30',
    '2020-01-29',
    '2020-01-28',
    '2020-01-27',
    '2020-01-26',
    '2020-01-25',
    '2020-01-24',
    '2020-01-23',
    '2020-01-22',
    '2020-01-21',
    '2020-01-20',

];

var covidData = {
    "type": "FeatureCollection",
    "name": "covid data",
    "features": [],
};

covidData.features.push("ok");

console.log(covidData);

function filterBy(Date) {

    var Dateind = Dates[Date];
    var filters = ['<', ['get', 'Date'], Dateind];
    map.setFilter('covid-heat', filters);
    var filters2 = ['==', ['get', 'Date'], Dateind];
    map.setFilter('stock-extrusion', filters2);
    map.setFilter('px-last-labels', filters2);

    // Set the label to the Date
    document.getElementById('Date').textContent = Dates[Date];
}

mapboxgl.accessToken =
    'pk.eyJ1IjoiZmFyaGFucm9jazMyIiwiYSI6ImNrYWp1bWtmNjBhZm4yeG82OGtkMnRrdG0ifQ.lOErOt3mxT1icl2_OP7FIg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    attributionControl: false,
    center: [0, 0],
    zoom: 1.5,
    pitch: 52, // pitch in degrees
    bearing: -60,
    antialias: true
});

map.on('load', function() {
    map.addSource('covid', {
        'type': 'geojson',
        'data': 'https://hampan-da.github.io/visualization.github.io/train.geojson'
    });

    map.addLayer({
            'id': 'covid-heat',
            'type': 'heatmap',
            'source': 'covid',
            'maxzoom': 15,
            'paint': {
                // increase weight as diameter breast height increases
                'heatmap-weight': {
                    'property': 'ConfirmedC',
                    'type': 'exponential',
                    'stops': [
                        [1, 0],
                        [62, 1]
                    ]
                },
                // increase intensity as zoom level increases
                'heatmap-intensity': {
                    'stops': [
                        [11, 1],
                        [15, 2]
                    ]
                },
                // use sequential color palette to use exponentially as the weight increases
                'heatmap-color': [
                    'interpolate', ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(236,222,239,0)',
                    0.2,
                    'rgba(8, 245, 0, 1)',
                    0.4,
                    'yellow',
                    0.6,
                    'orange',
                    0.8,
                    'red'
                ],
                // increase radius as zoom increases
                'heatmap-radius': {
                    'stops': [
                        [11, 15]
                    ]
                },
                // decrease opacity to transition into the circle layer
                'heatmap-opacity': {
                    'default': 0.7,
                    'stops': [
                        [14, 0.7],
                        [15, 0.1]
                    ]
                }
            },

        },
        'waterway-label'
    );

    map.addLayer({
            'id': 'covid-point',
            'type': 'circle',
            'source': 'covid',
            'minzoom': 14,
            'paint': {
                // increase the radius of the circle as the zoom level and ConfirmedC value increases
                'circle-radius': {
                    'property': 'ConfirmedC',
                    'type': 'exponential',
                    'stops': [
                        [{ zoom: 15, value: 1 }, 5],
                        [{ zoom: 15, value: 62 }, 10],
                        [{ zoom: 22, value: 1 }, 20],
                        [{ zoom: 22, value: 62 }, 50]
                    ]
                },
                'circle-color': {
                    'property': 'ConfirmedC',
                    'type': 'exponential',
                    'stops': [
                        [0, 'rgba(236,222,239,0)'],
                        [10, 'rgb(236,222,239)'],
                        [20, 'green'],
                        [30, 'lightbrown'],
                        [40, 'yellow'],
                        [50, 'orange)'],
                        [60, 'red']
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                    'stops': [
                        [14, 0],
                        [15, 1]
                    ]
                }
            }
        },
        'waterway-label'
    );


    map.addSource('stockplan', {
        // GeoJSON Data source used in vector tiles, documented at
        // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        'type': 'geojson',
        'data': 'https://hampan-da.github.io/visualization.github.io/stocktimeseries.geojson'
    });
    map.addLayer({
        'id': 'stock-extrusion',
        'type': 'fill-extrusion',
        'source': 'stockplan',
        'paint': {
            // See the Mapbox Style Specification for details on data expressions.
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

            // Get the fill-extrusion-color from the source 'color' property.
            'fill-extrusion-color': ['get', 'color'],

            // Get fill-extrusion-height from the source 'height' property.

            'fill-extrusion-height': [
                'interpolate', ['linear'],
                ['zoom'],
                1.5, ['/', ['number', ['get', 'height']], 10],
                3, ['/', ['number', ['get', 'height']], 1.3],
            ],

            // Get fill-extrusion-base from the source 'base_height' property.
            'fill-extrusion-base': 0,

            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 0.9,

        }
    });
    map.addLayer({
        'id': 'px-last-labels',
        'type': 'symbol',
        'source': 'stockplan',
        'layout': {
            'text-field': [
                'concat',
                'PX_LAST : ', ['to-string', ['get', 'PX_LAST']],
                '     ',
                'PX_VOLUME : ', ['to-string', ['get', 'PX_VOLUME']]

            ],
            'text-font': [
                'Open Sans Bold',
                'Arial Unicode MS Bold'
            ],
            'text-size': 9,
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
        },
        'paint': {
            'text-color': 'white'
        }
    });
    filterBy(0);

    document.getElementById('slider').addEventListener('input', function(e) {
        var Dateind = parseInt(e.target.value, 10);
        filterBy(Dateind);
    });

    map.rotateTo(10, { duration: 10000 });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'stock-extrusion', function(e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.Security)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on('mouseenter', 'stock-extrusion', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'stock-extrusion', function() {
        map.getCanvas().style.cursor = '';
    });

    chartInit();

    map.on("render", chartSetData);


});

//click on tree to view ConfirmedC in a popup

map.addControl(new mapboxgl.NavigationControl());




function getData() {
    var vals = [];
    var layer = "stock-extrusion"
    if (!map.getLayer(layer)) return vals;

    var test = map.queryRenderedFeatures({
        layers: [layer]
    });

    test.forEach(function(f) {
        vals.push([f.properties.Date, f.properties.PX_LAST]);
    })

    vals = vals.sort(function(a, b) {

        return a[0] - b[0];
    })

    return (vals);
}




function chartSetData() {
    data = getData();

    if (!data || data.length == 0) return;

    chart.series[0].update({
        data: data
    })


}

function chartInit(data) {

    data = data || getData() || [];

    Highcharts.createElement('link', {
        href: 'https://fonts.googleapis.com/css?family=Unica+One',
        rel: 'stylesheet',
        type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
            '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
        ],
        chart: {
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2: 1
                },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);


    chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            events: {
                selection: function(event) {
                    var layer = "null";

                    if (event.resetSelection) {
                        map.setFilter(layer, [
                            'all'
                        ])

                    } else {
                        var ext = event.xAxis[0];

                        map.setFilter(layer, [
                            'all', ['<', ['get', 'Date'], ext.max],
                            ['>', ['get', 'Date'], ext.min]
                        ])
                    }
                }
            }
        },
        title: {
            text: 'Stock Market Data Chart'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'date'
        },
        yAxis: {
            title: {
                text: 'px-close'
            }
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'px_close',
            data: data
        }]
    });


}






function rCoord() {
    var coord = [
        (Math.random() * 360) - 180, (Math.random() * 180) - 90
    ]
    return coord
}

function rDate(base) {
    base = base || 0;
    mx = new Date();
    mn = new Date("2004/12/02");
    dd = Math.round(mx - (Math.random() * (mx - mn - base)));
    return (dd)
}

function rProp(base) {
    base = base || [0];
    var a = (base[0] + 180) / 360 || Math.random();

    var prop = {
        date: rDate(a * 1000),
        nHgKg: Math.round(a * 1000)
    }

    return prop;
}

function rPoint() {
    var coord = rCoord()
    var point = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: coord
        },
        properties: rProp(coord)
    }
    return point;
}

function rPoints(n) {
    var gJson = {
        type: "FeatureCollection",
        features: []
    };
    n = n || 100;
    for (var i = 0; i < n; i++) {
        gJson.features.push(rPoint());
    }
    return gJson;
}


function cloneArray(arr) {
    var i = arr.length;
    var clone = [];
    while (i--) {
        clone[i] = arr[i];
    }
    return (clone);
};

function getArrayStat(o) {

    if (
        o.arr === undefined ||
        o.arr.constructor != Array ||
        o.arr.length === 0
    ) return [];

    if (
        o.stat == "quantile" &&
        o.percentile &&
        o.percentile.constructor == Array
    ) o.stat = "quantiles";

    var arr = cloneArray(o.arr);
    var stat = o.stat ? o.stat : "max";
    var len_o = arr.length;
    var len = len_o;

    function sortNumber(a, b) {
        return a - b;
    }

    opt = {
        "max": function() {
            var max = -Infinity;
            var v = 0;
            while (len--) {
                v = arr.pop();
                if (v > max) {
                    max = v;
                }
            }
            return max;
        },
        "min": function() {
            var min = Infinity;
            while (len--) {
                v = arr.pop();
                if (v < min) {
                    min = v;
                }
            }
            return min;
        },
        "sum": function() {
            var sum = 0;
            while (len--) {
                sum += arr.pop();
            }
            return sum;
        },
        "mean": function() {
            var sum = getArrayStat({
                stat: "sum",
                arr: arr
            });
            return sum / len_o;
        },
        "median": function() {
            var median = getArrayStat({
                stat: "quantile",
                arr: arr,
                percentile: 50
            });
            return median;
        },
        "quantile": function() {
            arr.sort(sortNumber);
            o.percentile = o.percentile ? o.percentile : 50;
            index = o.percentile / 100 * (arr.length - 1);
            if (Math.floor(index) == index) {
                result = arr[index];
            } else {
                i = Math.floor(index);
                fraction = index - i;
                result = arr[i] + (arr[i + 1] - arr[i]) * fraction;
            }
            return result;
        },
        "quantiles": function() {
            var quantiles = {};
            o.percentile.forEach(function(x) {
                var res = getArrayStat({
                    stat: "quantile",
                    arr: arr,
                    percentile: x
                });
                quantiles[x] = res;
            });
            return quantiles;
        },
        "distinct": function() {
            var n = {},
                r = [];

            while (len--) {
                if (!n[arr[len]]) {
                    n[arr[len]] = true;
                    r.push(arr[len]);
                }
            }
            return r;
        }
    };

    return (opt[stat](o));

};




function printLayerStat() {

    var s = getLayerStat();

    var elN = document.getElementById("sN");
    var elMin = document.getElementById("sMin");
    var elMax = document.getElementById("sMax");
    var elPtil = document.getElementById("sPtil");

    elN.innerHTML = s.n;
    elMin.innerHTML = s.min;
    elMax.innerHTML = s.max;
    elPtil.innerHTML = JSON.stringify(s.ptil);

}


function getLayerStat() {
    var test = map.queryRenderedFeatures({
        layers: ['stock-extrusion']
    });
    var vals = [];
    test.forEach(function(f) {
        vals.push([
            f.properties.date,
            f.properties.nHgKg
        ]);
    })
    var out = {
        n: test.length,
        max: getArrayStat({
            arr: vals,
            stat: 'max'
        }),
        min: getArrayStat({
            arr: vals,
            stat: 'min'
        }),
        ptil: getArrayStat({
            arr: vals,
            stat: 'quantiles',
            percentile: [25, 50, 75]
        })
    }
    return (out)
}