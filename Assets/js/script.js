// My API key for open weather
var key = '6ab359c87b61df5cbd8a7d7e8a717bc5';
var userFormEl = document.querySelector('#user-form');
var placeInputEl = document.querySelector('#place');
var specifyContainerEl = document.querySelector('#specify-container');
var specifySearchTerm = document.querySelector('#specify-search-term');

// Form for user to submit of which place name they would like to see the weather dashboard of.
var formSubmitHandler = function (event) {
    event.preventDefault();
    var placeName = placeInputEl.value.trim();
    if (placeName) {
      getLatLong(placeName);
      specifyContainerEl.textContent = '';
      placeInputEl.value = '';
    } else {
        // If the user does not submits a blank location the computer prompts them to submit a name of a location.
      alert('Please enter a place name');
    }
  };
  
  // Computer selects three possible places that correspond to the user's input.
  // Computer uses the GEO API from openweathermap
  var getLatLong = function (placeName) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+placeName+',*&limit=3&appid='+key;
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data+ " "+placeName);
            displayPlaces(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to openweather');
      });
  };
// pinLoc is an object that will hold my selected place and its latitude and longitude.
  var pinLoc =new Object()
// Computer creates a list of upto three possible places for the user to choose from.
  var displayPlaces = function (possPlaces) {
    if (possPlaces.length === 0) {
        // If computer can not find any places to match the user's input then the message below is displayed on the webpage.
      specifyContainerEl.textContent = 'No place matches found.';
      return;
    }
    // Computer generates the list to be visible to the user on the webpage.
    for (var i = 0; i < possPlaces.length; i++) {
      var placeName = possPlaces[i].name + '  ' + possPlaces[i].country;
      var placeEl = document.createElement('li');
      placeEl.classList = 'list-item flex-row justify-space-between align-center';
      // Computer creates the choices as buttons so that the user can select one.
      var titleEl = document.createElement('button');
      titleEl.textContent = placeName;
      titleEl.id='choice'+i;
      placeEl.appendChild(titleEl);
      specifyContainerEl.appendChild(placeEl);
    }

    // Computer finds all of the buttons when clicked on extracts the related id and puts the place and its latitude and longitude in pinLoc.
    $("button").click(function() {
      var t0 = $(this).attr('id');
      var j=parseInt(t0.substring(6));
      console.log("j"+possPlaces[j].lon);
    pinLoc.place=possPlaces[j].name; 
    pinLoc.lat=possPlaces[j].lat; 
    pinLoc.lon=possPlaces[j].lon;
     
    weatherBalloon(pinLoc );
    });   
  };

function weatherBalloon(pinLoc ) {
  console.log("pl "+pinLoc.lat+" "+pinLoc.lon);
fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+pinLoc.lat+'&lon='+pinLoc.lon+'&appid='+key)
 .then(function(resp) { return resp.json() }) // Convert data to json
 .then(function(data) {
  drawWeather(data);
   console.log("ds"+data);
 })
 /* .catch(function(e) {
   console.log(e)
   // catch any errors
 }
 ); */
}
now =moment().format('dddd, MMMM Do');

 function drawWeather( d ) {
  var latLocation=d[0]
  var lonLoncation=d[1]
  console.log(d)
var celcius = Math.round(parseFloat(d.current.temp)-273.15);
var icon = "https://openweathermap.org/img/wn/" + d.current.weather[0].icon + "@2x.png" 
console.log("weather"+d.current.weather[0].description);
document.getElementById('description').innerHTML = "weather description: "+d.current.weather[0].description;
document.getElementById('icon').src = icon
document.getElementById('temp').innerHTML = "temperature :"+celcius + '&deg;';
document.getElementById('location').innerHTML = pinLoc.place;
document.getElementById('wind').innerHTML = "wind speed :"+d.current.wind_speed
document.getElementById('humidity').innerHTML = "humidity: "+d.current.humidity
document.getElementById('uvi').innerHTML = "uv: "+d.current.uvi;

document.getElementById('today').innerHTML= now; 

} 
 userFormEl.addEventListener('submit', formSubmitHandler);
var nameEl=document.getElementById('#choice0');