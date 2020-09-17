var covidSummary;
$.ajax({
    type: "GET",
    url: "https://api.covid19api.com/summary",
    success: function (data) {
        covidSummary = data;
    },
    async: false,
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".global-confirmed-number").html(numberWithCommas(covidSummary.Global.TotalConfirmed));
$(".global-death-recovered .death").html(numberWithCommas(covidSummary.Global.TotalDeaths));
$(".global-death-recovered .recovered").html(numberWithCommas(covidSummary.Global.TotalRecovered));

var countrySummary = covidSummary.Countries;

function compare(a, b) {

  let comparison = 0;
  if (a.TotalConfirmed > b.TotalConfirmed) {
    comparison = -1;
  } else if (a.TotalConfirmed < b.TotalConfirmed) {
    comparison = 1;
  }
  return comparison;
}

countrySummary.sort(compare);
console.log(countrySummary);

var countryConfirmedHtml ='';
var countryDeathRecoveryHtml = '';

countrySummary.forEach((element) => {
    countryConfirmedHtml += '<div><span>' + element.TotalConfirmed + '</span> ' + element.Country + '</div>';
    countryDeathRecoveryHtml += '<div><span class="death">' + element.TotalDeaths + '</span> deaths, <span class="recovered">' + element.TotalRecovered + ' recovered</span> ' + element.Country + '</div>';
});

$('.country-confirmed-number').html(countryConfirmedHtml);
$('.country-death-recovered').html(countryDeathRecoveryHtml);
