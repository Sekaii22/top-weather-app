import "./styles.css";

async function getWeather(location) {
    const key = "AC46DWSX8GQY73ENWGS8JY8DH";
    const weather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.trim()}/next6days?key=${key}&unitGroup=metric&iconSet=icons2`);
    const weatherData = await weather.json();
    const processedData = processWeatherData(weatherData);
    console.log(weatherData);
    console.log(processedData);

    return processedData;
}

function processWeatherData(data) {
    return {
        address: data.resolvedAddress,
        description: data.description,
        currentConditions: {
            date: new Date(data.days[0].datetime),
            conditions: data.currentConditions.conditions,
            icon: data.currentConditions.icon,
            description: data.days[0].description,
            feelslike: data.currentConditions.feelslike,
            humidity: data.currentConditions.humidity,
            precipprob: data.currentConditions.precipprob,
            temp: data.currentConditions.temp,
            uvindex: data.currentConditions.uvindex,
            windspeed: data.currentConditions.windspeed
        },
        days: data.days.map((day) => ({
            date: new Date(day.datetime),
            conditions: day.conditions,
            icon: day.icon,
            description: day.description,
            humidity: day.humidity,
            precipprob: day.precipprob,
            temp: day.temp,
            tempmax: day.tempmax,
            tempmin: day.tempmin,
            uvindex: day.uvindex,
            windspeed: day.windspeed
        })),
    }
}

// function isToday(date) {
//     const today = new Date();

//     return date.getFullYear() === today.getFullYear() &&
//          date.getMonth() === today.getMonth() &&
//          date.getDate() === today.getDate();
// }

function removeWeather() {
    const content = document.querySelector(".content");
    const weather = document.querySelector("#weather");

    if (weather) {
        content.removeChild(weather);
    }
}

function createHighlightWeather(highlight) {
    const container = document.createElement("div");
    container.classList.add("highlight-weather");

    // current highlighted weather's children
    const top = document.createElement("div");
    const topLeft = document.createElement("div");
    const topRight = document.createElement("div");
    const icon = document.createElement("img");
    const temp = document.createElement("p");
    const dateTime = document.createElement("p");
    const desc = document.createElement("p");
    container.appendChild(top);
    top.appendChild(topLeft);
    top.appendChild(topRight);
    topLeft.appendChild(icon);
    topLeft.appendChild(temp);
    topRight.appendChild(dateTime);
    topRight.appendChild(desc);

    top.classList.add("highlight-top");
    topLeft.classList.add("top-left");
    topRight.classList.add("top-right");
    icon.classList.add("highlight-icon");
    temp.classList.add("highlight-temp");
    dateTime.classList.add("highlight-datetime");
    desc.classList.add("highlight-desc");

    import(`../assets/icons/weather/${highlight.icon}.svg`).then((module) => {
        icon.src = module.default;
    });
    temp.innerHTML = `${highlight.temp}<span class="temp-unit">&deg;C</span>`;
    dateTime.textContent = highlight.date.toLocaleDateString(undefined, {weekday: "long", year: "numeric", month: "short", day: "numeric"});
    desc.textContent = highlight.conditions;

    const bottom = document.createElement("div");
    const statGroup = document.createElement("div");
    const precip = document.createElement("p");
    const humidity = document.createElement("p");
    const wind = document.createElement("p");
    const uvIndex = document.createElement("p");
    container.appendChild(bottom);
    bottom.appendChild(statGroup);
    statGroup.appendChild(precip);
    statGroup.appendChild(humidity);
    statGroup.appendChild(wind);
    statGroup.appendChild(uvIndex);

    bottom.classList.add("highlight-bottom");
    statGroup.classList.add("highlight-stat-group");
    precip.classList.add("highlight-stat");
    humidity.classList.add("highlight-stat");
    wind.classList.add("highlight-stat");
    uvIndex.classList.add("highlight-stat");

    precip.textContent = `Precipitation: ${highlight.precipprob}%`;
    humidity.textContent = `Humidity: ${highlight.humidity}`;
    wind.textContent = `Wind: ${highlight.windspeed}`;
    uvIndex.textContent = `UV Index: ${highlight.uvindex}`;

    return container
}

function createForecasts(days) {
    const container = document.createElement("div");
    container.classList.add("weather-forecasts");

    // weather forecasts children

    return container
}

function showWeather(weatherData) {
    removeWeather();

    const content = document.querySelector(".content");
    const weather = document.createElement("section");
    content.appendChild(weather);
    weather.appendChild(createHighlightWeather(weatherData.currentConditions));
    weather.appendChild(createForecasts(weatherData.days));
    weather.id = "weather";

}

const form = document.querySelector("form");
const input = document.querySelector("#search-input");
// const btn = document.querySelector("#search-btn");

form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
        e.preventDefault();

        const location = input.value;
        getWeather(location).then(showWeather);
    }
});