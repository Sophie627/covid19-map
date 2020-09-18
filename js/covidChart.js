var covidTimeline;
$.ajax({
    type: "GET",
    url: "https://corona-api.com/timeline",
    success: function(data) {
        covidTimeline = data;
    },
    async: false,
});

console.log(covidTimeline);

var covidDate = [];
var covidConfirmed = [];

covidTimeline.data.map(({ date, new_confirmed }) => {
    covidDate.push(date);
    covidConfirmed.push(new_confirmed);
});

var ctx = document.getElementById('covid-chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
        //Insert the divisions for the x-axis here
        labels: covidDate.reverse(),
        datasets: [{
            label: "Daily Cases",
            backgroundColor: 'rgb(255, 170, 0)',
            borderColor: 'rgb(255, 170, 0)',
            //Insert data points here (y-axis)
            data: covidConfirmed.reverse(),
        }]
    },
    // Configuration options go here
    options: {
        //causes chart to resize when its container resizes
        responsive: true,
        //setting to false will prevent the height of the chart from shrinking when resizing
        maintainAspectRatio: false
    }
});