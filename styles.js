let API_KEY = "008a89e1191347c78d265154242506";

const searchForm = document.querySelector(".header__search");
const searchInput = document.querySelector(".search__input");
const mainContainer = document.querySelector(".section-title");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearWeatherData();
  const location = searchInput.value;
  fetchWeatherData(location).then((data) => {
    if (data.error) {
      displayError(data.error.message);
    } else {
      displayWeatherData(data);
      //   console.log(data);
    }
  });
  searchInput.value = "";
});

const fetchWeatherData = async (location) => {
  const URL = `https://api.weatherapi.com/v1/forecast.json?q=${location}&days=6&key=008a89e1191347c78d265154242506`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    return { error };
  }
};

const displayError = (error) => {
  const errorElement = document.createElement("p");
  errorElement.textContent = error;
  mainContainer.appendChild(errorElement);
};

const displayWeatherData = (data) => {
  displayLocationAndDate(
    data.location.name,
    data.location.country,
    data.location.localtime
  );

  displayTemperature(data.current.temp_c, data.current.condition.icon);

  displayConditions(data.current.condition.text, data.current.feelslike_c);

  createWeatherDetails("Wind", Math.round(data.current.wind_kph), "km/h");
  createWeatherDetails("Humidity", data.current.humidity, "%");
  createWeatherDetails("UV Index", data.current.uv);
  createWeatherDetails("Visibility", data.current.vis_km, "km");
  createWeatherDetails("Cloudiness", data.current.cloud, "%");
  createWeatherDetails(
    "Chance if rain",
    data.forecast.forecastday[0].day.daily_chance_of_rain,
    "%"
  );
  createWeatherDetails("Sunrise", data.forecast.forecastday[0].astro.sunrise);
  createWeatherDetails("Sunset", data.forecast.forecastday[0].astro.sunset);
  createWeatherDetails("Wind Direction", data.current.wind_dir);

  displayDailyForecast(data.forecast.forecastday);
};

const displayLocationAndDate = (city, country, date) => {
  const headerElement = document.createElement("h1");
  const parElement = document.createElement("p");

  headerElement.textContent = `${city}, ${country}`;
  const formatedDate = formatDate(date);
  parElement.textContent = `${formatedDate.day} ${formatedDate.dayOfMonth} ${formatedDate.year}`;

  mainContainer.appendChild(headerElement);
  mainContainer.appendChild(parElement);
};

const displayTemperature = (temp, iconUrl) => {
  const weatherTemperatureElem = document.querySelector(".weather__temp");
  const img = document.createElement("img");
  const spanElem = document.createElement("span");
  const degElem = document.createElement("span");
  img.setAttribute("src", iconUrl);
  spanElem.textContent = Math.round(temp);
  degElem.textContent = "°C";
  weatherTemperatureElem.appendChild(img);
  weatherTemperatureElem.appendChild(spanElem);
  weatherTemperatureElem.appendChild(degElem);
};

const displayConditions = (condition, feelsLike) => {
  const weatherCondition = document.querySelector(".weather__conditions");
  const conditionText = document.createElement("p");
  conditionText.textContent = condition;
  const feelsLikeText = document.createElement("p");
  feelsLikeText.textContent = `Feels like ${Math.round(feelsLike)}°C`;
  weatherCondition.appendChild(conditionText);
  weatherCondition.appendChild(feelsLikeText);
};

const displayDailyForecast = (forecast) => {
  const dailyForecastSection = document.querySelector(
    ".section-daily-forecast"
  );
  const dailyForecastHeader = document.createElement("h2");
  dailyForecastHeader.textContent = " Weekly Forecast";
  dailyForecastSection.appendChild(dailyForecastHeader);

  const dailyForecastList = document.createElement("ul");
  dailyForecastList.classList.add("daily-forecast__list");
  dailyForecastSection.appendChild(dailyForecastList);

  forecast.forEach((day) => {
    const listElement = document.createElement("li");
    listElement.classList.add("daily-forecast__item");
    const daySpan = document.createElement("span");
    daySpan.textContent = formatDate(day.date).day;

    const tempSpan = document.createElement("span");
    tempSpan.textContent = `${day.day.avgtemp_c} °C`;

    const chanceOfRainSpan = document.createElement("span");
    chanceOfRainSpan.textContent = `${day.day.daily_chance_of_rain}%`;

    const windSpeedSpan = document.createElement("span");
    windSpeedSpan.textContent = `${day.day.maxwind_kph} km/h`;

    listElement.appendChild(daySpan);
    listElement.appendChild(tempSpan);
    listElement.appendChild(chanceOfRainSpan);
    listElement.appendChild(windSpeedSpan);

    dailyForecastList.appendChild(listElement);
  });
};

function clearWeatherData() {
  document.querySelector(".section-title").innerHTML = "";
  document.querySelector(".weather__temp").innerHTML = "";
  document.querySelector(".weather__conditions").innerHTML = "";
  document.querySelector(".section-details").innerHTML = "";
  document.querySelector(".section-daily-forecast").innerHTML = "";
}

function createWeatherDetails(name, data, measurements = "") {
  const weatherDetailsSection = document.querySelector(".section-details");
  const weatherDetailsContainer = document.createElement("div");
  weatherDetailsContainer.classList.add("weather__details");

  const nameElement = document.createElement("p");
  nameElement.textContent = name;
  const dataElement = document.createElement("p");
  dataElement.textContent = `${data}${measurements}`;
  weatherDetailsContainer.appendChild(nameElement);
  weatherDetailsContainer.appendChild(dataElement);
  weatherDetailsSection.appendChild(weatherDetailsContainer);
}

const formatDate = (dateToConvert) => {
  const date = new Date(dateToConvert);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return { day, dayOfMonth, year };
};
