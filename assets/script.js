// Perform an AJAX GET request for coordinates
function getCoordinatesFromCityName(city, apiKey) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  return $.ajax({
    url: url,
    method: 'GET',
  });
}

// function that takes city string from search input and returns coordinates
// use this api endpoint https://openweathermap.org/forecast5#geocoding
async function getCoordinates(cityName) {
  var apiKey = 'a839e54577007a1d9684dcfefd5babc1';

  // make api call
  try {
    const response = await getCoordinatesFromCityName(
      cityName,
      apiKey
    );
    // Process the response
    console.log('Success:', response);
  } catch (error) {
    // Handle the error
    console.log('Error:', error.responseText);
  }

  // return cityCoordinates
}

getCoordinates('London');

// function that takes coordinates and returns weather json
// use this api endpoint https://openweathermap.org/forecast5
async function getWeather(cityCoordinates) {
  // make api call
  // return weatherData
}

// function that takes weather json and displays weather cards ui
