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
    console.log('Error inside getCoords:', error.responseText);
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
    console.log(response);
    console.log('days', filteredDays);
  } catch (error) {
    console.log('Error inside of getWeather:', error.responseText);
  }
}

const mockDays = [
  {
    dt: 1686236400,
    main: {
      temp: 301.36,
      feels_like: 302.46,
      temp_min: 301.36,
      temp_max: 301.36,
      pressure: 1011,
      sea_level: 1011,
      grnd_level: 993,
      humidity: 56,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: 'Clouds',
        description: 'broken clouds',
        icon: '04d',
      },
    ],
    clouds: {
      all: 84,
    },
    wind: {
      speed: 1.97,
      deg: 278,
      gust: 2.69,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'd',
    },
    dt_txt: '2023-06-08 15:00:00',
  },
  {
    dt: 1686301200,
    main: {
      temp: 294.61,
      feels_like: 295.06,
      temp_min: 294.61,
      temp_max: 294.61,
      pressure: 1009,
      sea_level: 1009,
      grnd_level: 991,
      humidity: 86,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01n',
      },
    ],
    clouds: {
      all: 3,
    },
    wind: {
      speed: 2.84,
      deg: 232,
      gust: 7.44,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'n',
    },
    dt_txt: '2023-06-09 09:00:00',
  },
  {
    dt: 1686366000,
    main: {
      temp: 302,
      feels_like: 304.23,
      temp_min: 302,
      temp_max: 302,
      pressure: 1008,
      sea_level: 1008,
      grnd_level: 990,
      humidity: 62,
      temp_kf: 0,
    },
    weather: [
      {
        id: 803,
        main: 'Clouds',
        description: 'broken clouds',
        icon: '04n',
      },
    ],
    clouds: {
      all: 71,
    },
    wind: {
      speed: 3.55,
      deg: 162,
      gust: 9.43,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'n',
    },
    dt_txt: '2023-06-10 03:00:00',
  },
  {
    dt: 1686430800,
    main: {
      temp: 309.18,
      feels_like: 310.15,
      temp_min: 309.18,
      temp_max: 309.18,
      pressure: 1006,
      sea_level: 1006,
      grnd_level: 989,
      humidity: 33,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 5.55,
      deg: 197,
      gust: 6.69,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'd',
    },
    dt_txt: '2023-06-10 21:00:00',
  },
  {
    dt: 1686495600,
    main: {
      temp: 301.99,
      feels_like: 303.77,
      temp_min: 301.99,
      temp_max: 301.99,
      pressure: 1009,
      sea_level: 1009,
      grnd_level: 992,
      humidity: 59,
      temp_kf: 0,
    },
    weather: [
      {
        id: 802,
        main: 'Clouds',
        description: 'scattered clouds',
        icon: '03d',
      },
    ],
    clouds: {
      all: 29,
    },
    wind: {
      speed: 6.12,
      deg: 205,
      gust: 9.2,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'd',
    },
    dt_txt: '2023-06-11 15:00:00',
  },
  {
    dt: 1686560400,
    main: {
      temp: 297.24,
      feels_like: 298.03,
      temp_min: 297.24,
      temp_max: 297.24,
      pressure: 1009,
      sea_level: 1009,
      grnd_level: 991,
      humidity: 89,
      temp_kf: 0,
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01n',
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 4.37,
      deg: 195,
      gust: 12.15,
    },
    visibility: 10000,
    pop: 0,
    sys: {
      pod: 'n',
    },
    dt_txt: '2023-06-12 09:00:00',
  },
];

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
  console.log(cityName);

  // Clear the weeklyWeather array
  weeklyWeather = [];

  // Perform the API calls
  getWeatherDataFromCityName(cityName)
    .then(() => {
      // Display or process the weather data as needed
      updateWeatherCards(weeklyWeather);
      console.log('weekly Weather', weeklyWeather);
    })
    .catch((error) => {
      // Handle any errors that occurred during the API calls
      console.log('Error:', error);
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

// function that takes weather json and displays weather cards ui
// this needs to go inside of an onClick function
// getWeatherDataFromCityName('Austin'); Pass this the value of the form (formname.value)

/*
1. clean up old comments
1.5. make it so if isLoading is true, you show a spinner or just hide the cards
2. connect api calls function to button onClick
3. pass the value from the input form to the button onClick
4. the cards can have classes like weather card 0-6 so you can identify them
5. use a for loop on the weeklyWeather array to put text on cards
6. on that loop -> if () it's the first index or first item array, map it to the big card
*/
