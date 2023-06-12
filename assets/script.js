// constants
const apiKey = 'a839e54577007a1d9684dcfefd5babc1';
let cityInfo = {
  name: null,
  lat: null,
  lon: null,
  state: null,
};
let weeklyWeather = []; // represents today and 5 days after
let isLoading = false;

function getWeatherIcon(iconCode) {
  const icons = [
    { iconName: 'fas fa-sun', codes: [800] },
    { iconName: 'fas fa-cloud-sun', codes: [801, 802] },
    { iconName: 'fas fa-cloud', codes: [803, 804] },
    {
      iconName: 'fas fa-cloud-showers-heavy',
      codes: [300, 301, 302, 310, 311, 312, 313, 314, 321],
    },
    {
      iconName: 'fas fa-cloud-rain',
      codes: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
    },
    {
      iconName: 'fas fa-bolt',
      codes: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
    },
    {
      iconName: 'fas fa-snowflake',
      codes: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621],
    },
    { iconName: 'fas fa-smog', codes: [701] },
    { iconName: 'fas fa-smoke', codes: [711] },
    { iconName: 'fas fa-smog', codes: [721] },
    { iconName: 'fas fa-fog', codes: [741] },
    { iconName: 'fas fa-dust', codes: [731, 761] },
    { iconName: 'fas fa-wind', codes: [751] },
    { iconName: 'fas fa-cloud-showers-heavy', codes: [762] },
    { iconName: 'fas fa-wind', codes: [771] },
    { iconName: 'fas fa-tornado', codes: [781] },
  ];

  const matchedIcon = icons.find((icon) =>
    icon.codes.includes(iconCode)
  );

  return matchedIcon ? matchedIcon.iconName : 'unknown';
}

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
    console.error('Error inside getCoords:', error.responseText);
  }
  // return cityCoordinates
}

async function getWeatherDataFromCityName(cityName) {
  isLoading = true;
  await getCoordinates(cityName);
  await getWeather(cityInfo.lat, cityInfo.lon);
  isLoading = false;
}

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
  try {
    const response = await getWeatherFromCoordinates(lat, lon);
    const filteredDays = getEverySixthItem(response.list);
    convertAllWeatherResponses(filteredDays); // Add this line to populate weeklyWeather
  } catch (error) {
    console.error('Error inside of getWeather:', error.responseText);
  }
}

// write a function that takes a day object and returns the useful values
// determine what values are useful using mockDay above
function convertWeatherResponse(dayObject) {
  let formattedData = {
    date: null,
    temp: null,
    wind: null,
    humidity: null,
    icon: null,
  };

  // assign values to formattedData object
  formattedData.date = dayObject.dt_txt;
  formattedData.temp = dayObject.main.temp;
  formattedData.wind = dayObject.wind.speed;
  formattedData.humidity = dayObject.main.humidity;
  formattedData.icon = dayObject.weather[0].id;

  return formattedData;
}

function convertAllWeatherResponses(daysArray) {
  // loop that runs for each item in the days array
  daysArray.forEach((day) => {
    weeklyWeather.push(convertWeatherResponse(day));
  });
}

function handleClick() {
  // Get the city name from the input field
  const cityName = document.querySelector('.form-control').value;

  // Clear the weeklyWeather array
  weeklyWeather = [];

  // Perform the API calls
  getWeatherDataFromCityName(cityName)
    .then(() => {
      // Display or process the weather data as needed
      updateWeatherCards(weeklyWeather);
    })
    .catch((error) => {
      // Handle any errors that occurred during the API calls
      console.error('Error:', error);
    });
}

$(document).ready(function () {
  $('#weatherButton').click(handleClick);
});

function updateWeatherCards() {
  const cards = document.querySelectorAll(
    '.weather0, .weather1, .weather2, .weather3, .weather4, .weather5'
  );

  for (let i = 0; i < weeklyWeather.length; i++) {
    const card = cards[i];
    const data = weeklyWeather[i];
    const matchedIcon = getWeatherIcon(data.icon);

    card.querySelector('.card-city').textContent = cityInfo.name;
    card.querySelector('.card-date').textContent = data.date;
    card.querySelector(
      '.card-temp'
    ).textContent = `Temperature: ${data.temp}`;
    card.querySelector(
      '.card-wind'
    ).textContent = `Wind: ${data.wind}`;
    card.querySelector(
      '.card-humidity'
    ).textContent = `Humidity: ${data.humidity}`;
    $('.card-icon')
      .removeClass()
      .addClass('.card-icon ' + matchedIcon);
  }
}
