var cCityEl = document.getElementById('city-name');
var submitBtn = document.getElementById('search-btn');
var recentCityBtn = document.querySelector('.recent-city')
var recentCities = document.querySelector('.recent-cities');
var searchHistory = [];

var getCurrentWeather = async (lat, lon) => {
    var apiCwUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=e84e3fc93397b11b8b9bcf4e0a959017";
    var response = await fetch(apiCwUrl);
    if (!response.ok) throw new Error('Some Error');
    return await response.json();
}

var getForecast = async (lat, lon) => {
    var testUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=e84e3fc93397b11b8b9bcf4e0a959017";
    
    var response = await fetch(testUrl);
    if (!response.ok) throw new Error('Some Error');
    return await response.json();
}

var getLatLon = async (cityName) => {
    var queryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=e84e3fc93397b11b8b9bcf4e0a959017";
    var response = await fetch(queryUrl);
    if (!response.ok) {
        throw new Error('Some Error');
    }
    // console.log(response);
    var latLonResponse = await response.json();
    // console.log(latLonResponse)
    if (latLonResponse.length === 0) return;
    var {lat, lon} = latLonResponse[0];
    var forecast = await getForecast(lat, lon);
    var forecastList = forecast.daily;
    if (forecastList.length === 0) return;
    var currentWeather = forecastList[0];
    forecastList = forecastList.slice(1, 6);
    // console.log(currentWeather)
    // console.log(forecastList)
    
    createMainCard(cityName, currentWeather);
    fillForecastContainer(forecastList);
    }

var fillForecastContainer = (forecastList) => {
    var forecastContainer = document.getElementById('forecast-container');
    while (forecastContainer.firstChild) {
        forecastContainer.removeChild(forecastContainer.firstChild);
    }
    forecastList.forEach((forecast) => {
        var card = createCardElement(forecast);
        // console.log(card);
        card.classList.add("forecast");
        forecastContainer.appendChild(card);
    })
}

var createMainCard = (cityName, forecast) => {
    var card = document.querySelector('.current-date-city');
    // console.log(card)
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }
    var heading = document.createElement('div')
    
    
    var temp = document.createElement('h4');
    var wind = document.createElement('h4');
    var humidity = document.createElement('h4');
    var uvIndex = document.createElement('h4');
    var timestamp = forecast.dt * 1000;
    var dateString = new Date(timestamp).toLocaleDateString();
    
    heading.innerHTML = `<h3>${cityName} (${dateString}) <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"/></h3>`
    
    temp.innerHTML = `Temp: ${forecast.temp.day} F`;
    wind.innerHTML = `Wind: ${forecast.wind_speed} MPH`;
    humidity.innerHTML = `Humidity: ${forecast.humidity} %`;
    uvIndex.innerHTML = `UV Index: <span class="uv-index">${forecast.uvi}</span>`;
    [heading, temp, wind, humidity, uvIndex].forEach(elem => {
        card.appendChild(elem);
    })
}

var createCardElement = (forecast) => {
    
    var card = document.createElement('div');
    var date = document.createElement('h3');
    var icon = document.createElement('img');
    var temp = document.createElement('h4');
    var wind = document.createElement('h4');
    var humidity = document.createElement('h4');
    var timestamp = forecast.dt * 1000;
    var dateString = new Date(timestamp).toLocaleDateString();
    icon.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
    date.innerHTML = `${dateString}`;
    temp.innerHTML = `Temp: ${forecast.temp.day} F`;
    wind.innerHTML = `Wind: ${forecast.wind_speed} MPH`;
    humidity.innerHTML = `Humidity: ${forecast.humidity} %`;
    [date, icon, temp, wind, humidity].forEach(elem => {
        card.appendChild(elem);
    })
    card.className = "forecast-card";

    return card;
}

var createRecentCityElement = () => {
    var recentCity = document.createElement('button');
    recentCity.classList.add('recent-city');
    recentCity.innerHTML = cCityEl.value;
    recentCities.appendChild(recentCity);
}

var getSearchHistory = function() {
    var history = localStorage.getItem("cityNames");
    
    if (!history) {
        searchHistory.push(cCityEl.value);
        localStorage.setItem("cityNames", searchHistory);
    } else {
        searchHistory = [history];
        // console.log(searchHistory);
        searchHistory.push(cCityEl.value);
        localStorage.setItem("cityNames", searchHistory);
    }
}

var displayCurrentWeather = function(e) {
    e.preventDefault();
    getSearchHistory();
    createRecentCityElement();

    getLatLon(cCityEl.value);

}

// var displayRecentCityWeather = function(e) {
//     e.preventDefault();
//     getLatLon();

// }

submitBtn.addEventListener('click', displayCurrentWeather);
// recentCityBtn.addEventListener('click', displayRecentCityWeather);