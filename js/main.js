//Get current date
var yesterday = new Date();
var dd = String(yesterday.getDate() - 1).padStart(2, '0');
var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = yesterday.getFullYear();

yesterday = yyyy + '-' + mm + '-' + dd;

// Fetch all countries
// var countries;
// $.ajax({
//     type: "GET",
//     url: "https://api.covid19api.com/countries",
//     success: function(data) {
//         countries = data;
//     },
//     async: false,
// });
// console.log(countries);

mapboxgl.accessToken =
    'pk.eyJ1IjoiZmFyaGFucm9jazMyIiwiYSI6ImNrYWp1bWtmNjBhZm4yeG82OGtkMnRrdG0ifQ.lOErOt3mxT1icl2_OP7FIg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    attributionControl: false,
    center: [130, 0],
    zoom: 1.5,
    pitch: 52, // pitch in degrees
    bearing: -60,
    antialias: true
});

map.on('load', function() {


    var covidData;
    $.ajax({
        type: "GET",
        url: "https://corona-api.com/countries",
        success: function(data) {
            covidData = data;
        },
        async: false,
    });

    console.log(covidData);
    if (covidData != []) {

        var heatmapData = {
            "type": "FeatureCollection",
            "name": 'covid',
            "features": [],
        };

        covidData.data.forEach(element => {
            if (element.coordinates.longitude != 0 || element.coordinates.latitude != 0) {
                heatmapData.features.push({
                    "type": "Feature",
                    "properties": {
                        "ConfirmedC": element.latest_data.confirmed,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [element.coordinates.longitude, element.coordinates.latitude],
                    }
                });
            }
        });

        console.log(heatmapData);

        map.addSource('covid', {
            'type': 'geojson',
            'data': heatmapData,
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
                            [1, 1],
                            [1000000, 40]
                        ]
                    },
                    // increase intensity as zoom level increases
                    'heatmap-intensity': {
                        'stops': [
                            [0, 1],
                            [22, 10]
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
                            [10, 25],
                            [22, 100]
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
                            [30, 'brown'],
                            [40, 'yellow'],
                            [50, 'orange'],
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
    }


    map.rotateTo(10, { duration: 10000 });

});

//click on tree to view ConfirmedC in a popup

map.addControl(new mapboxgl.NavigationControl());