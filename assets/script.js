// constants
const apiKey = 'a839e54577007a1d9684dcfefd5babc1';
let cityInfo = {
  name: null,
  lat: null,
  lon: null,
  state: null,
};

// Perform an AJAX GET request for coordinates
function getCoordinatesFromCityName(city) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  return $.ajax({
    url: url,
    method: 'GET',
  });
}

// function that takes city string from search input and returns coordinates
// use this api endpoint https://openweathermap.org/forecast5#geocoding
async function getCoordinates(cityName) {
  // make api call
  try {
    const response = await getCoordinatesFromCityName(cityName);
    // Process the response
    cityInfo.name = response[0].name;
    cityInfo.lat = response[0].lat;
    cityInfo.lon = response[0].lon;
    cityInfo.state = response[0].state;
  } catch (error) {
    // Handle the error
    console.log('Error inside getCoords:', error.responseText);
  }
  // return cityCoordinates
}

async function getWeatherDataFromCityName(cityName) {
  await getCoordinates(cityName);
  await getWeather(cityInfo.lat, cityInfo.lon);
}

getWeatherDataFromCityName('Austin');

function getWeatherFromCoordinates(lat, lon) {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  return $.ajax({
    url: url,
    method: 'GET',
  });
}

// limits the getWeather array to one entry per day for 5 days
function getEverySixthItem(array) {
  const result = [];

  for (let i = 5; i < array.length; i += 6) {
    result.push(array[i]);
  }

  return result;
}

// function that takes coordinates and returns weather json
// use this api endpoint https://openweathermap.org/forecast5
async function getWeather(lat, lon) {
  // make api call
  try {
    const response = await getWeatherFromCoordinates(lat, lon);
    // Process the response
    console.log(response);
    console.log('days', getEverySixthItem(response.list));
  } catch (error) {
    // Handle the error
    console.log('Error inside of getWeather:', error.responseText);
  } // return weatherData
}

// function that takes weather json and displays weather cards ui
