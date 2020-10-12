//Get current date
var yesterday = new Date();
// var dd = String(yesterday.getDate() - 2).padStart(2, '0');
// var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = yesterday.getFullYear();

// yesterday = yyyy + '-' + mm + '-' + dd;

var monthDay = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var Dates = [];
for (var d = new Date(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate() - 2); d >= new Date(2020, 1, 22); d.setDate(d.getDate() - 1)) {
    month = '' + (d.getMonth());
    day = '' + d.getDate();
    year = d.getFullYear();

    if (d.getDate() > monthDay[d.getMonth()]) continue;

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    Dates.push([year, month, day].join('-'));
}

var max = Dates.length - 1;

document.getElementById('slider').setAttribute("max", "" + max);

function filterBy(Date) {
    console.log(Date);
    console.log(Dates[Date]);
    var Dateind = Dates[Date];
    document.getElementById('Date').innerText = Dates[Date];
    var filters = ['==', ['get', 'Date'], Dateind];
    map.setFilter('covid-heat', filters);
    // var filters2 = ['==', ['get', 'Date'], Dateind];
    // map.setFilter('stock-extrusion', filters2);
    // map.setFilter('px-last-labels', filters2);

    // Set the label to the Date
}

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
        url: "model/ajax_map.php",
        success: function(data) {
            covidData = data;
        },
        async: false,
    });

    if (covidData != []) {

        var heatmapData = {
            "type": "FeatureCollection",
            "name": 'covid',
            "features": [],
        };

        console.log(covidData);

        JSON.parse(covidData).forEach(element => {
            if (element.lon != 0 || element.lat != 0) {
                var description = '<strong>' + element.city + ' ' + element.province + ' ' + element.country + '</strong><br>' + 'Confirmed: ' + element.confirmed;
                heatmapData.features.push({
                    "type": "Feature",
                    "properties": {
                        "ConfirmedC": element.confirmed,
                        "Date": element.date.slice(0, 10),
                        "description": description,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [element.lon, element.lat],
                    }
                });
            }
        });

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
                            [0, 0],
                            [100000, 40000]
                        ]
                    },
                    // increase intensity as zoom level increases
                    'heatmap-intensity': {
                        'stops': [
                            [0, 1],
                            [40, 10]
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
            'id': 'places',
            'type': 'symbol',
            'source': 'covid',
            'layout': {
                'icon-image': 'music-15',
                'icon-allow-overlap': true,
                'icon-size': 1,
            },
            'paint': {
                'icon-opacity': 0,
            }
        });

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
        
        map.on('click', 'places', function (e) {
            
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
         
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });
    }

    filterBy(0);

    document.getElementById('slider').addEventListener('input', function(e) {
        var Dateind = parseInt(e.target.value, 10);
        filterBy(Dateind);
    });

    $('#status').fadeOut(); // will first fade out the loading animation 
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').delay(350).css({ 'overflow': 'visible' });

    map.rotateTo(10, { duration: 10000 });

});

//click on tree to view ConfirmedC in a popup

map.addControl(new mapboxgl.NavigationControl());