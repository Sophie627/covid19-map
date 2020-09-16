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

// var covid;

// $.get(" https://corona-api.com/countries", function(data, status) {
//     if (status == 'success') console.log(data);
// });

function filterBy(Date) {

    var Dateind = Dates[Date];
    var filters = ['<', ['get', 'Date'], Dateind];
    map.setFilter('covid-heat', filters);
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


    filterBy(0);

    map.rotateTo(10, { duration: 10000 });

});

//click on tree to view ConfirmedC in a popup

map.addControl(new mapboxgl.NavigationControl());