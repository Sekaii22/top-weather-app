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
            feelslike: Math.round(data.currentConditions.feelslike),
            humidity: Math.round(data.currentConditions.humidity),
            precipprob: data.currentConditions.precipprob,
            temp: Math.round(data.currentConditions.temp),
            uvindex: data.currentConditions.uvindex,
            windspeed: Math.round(data.currentConditions.windspeed)
        },
        days: data.days.map((day) => ({
            date: new Date(day.datetime),
            conditions: day.conditions,
            icon: day.icon,
            description: day.description,
            humidity: Math.round(day.humidity),
            precipprob: day.precipprob,
            temp: Math.round(day.temp),
            tempmax: Math.round(day.tempmax),
            tempmin: Math.round(day.tempmin),
            uvindex: day.uvindex,
            windspeed: Math.round(day.windspeed)
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

function createWeatherBanner(weatherData, curr=false) {
    const container = document.createElement("div");
    container.classList.add("weather-banner");
    if (!curr) {
        container.classList.add("highlight");
    }

    // weather's children
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

    top.classList.add("banner-top");
    topLeft.classList.add("banner-top-left");
    topRight.classList.add("banner-top-right");
    icon.classList.add("banner-icon");
    temp.classList.add("banner-temp");
    dateTime.classList.add("banner-datetime");
    desc.classList.add("banner-desc");

    import(`../assets/icons/weather/${weatherData.icon}.svg`).then((module) => {
        icon.src = module.default;
    });
    temp.innerHTML = `${weatherData.temp}<span class="temp-unit">&deg;C</span>`;
    if (curr) {
        temp.innerHTML = temp.innerHTML + ` <span>Feels like ${weatherData.feelslike}°C</span>`;
    }
    dateTime.textContent = weatherData.date.toLocaleDateString(undefined, {weekday: "long", year: "numeric", month: "short", day: "numeric"});
    desc.textContent = weatherData.conditions;

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

    bottom.classList.add("banner-bottom");
    statGroup.classList.add("banner-stat-group");
    precip.classList.add("banner-stat");
    humidity.classList.add("banner-stat");
    wind.classList.add("banner-stat");
    uvIndex.classList.add("banner-stat");

    precip.textContent = `Precipitation: ${weatherData.precipprob}%`;
    humidity.textContent = `Humidity: ${weatherData.humidity}`;
    wind.textContent = `Wind: ${weatherData.windspeed}`;
    uvIndex.textContent = `UV Index: ${weatherData.uvindex}`;
    if (!curr) {
        const desc = document.createElement("p");
        statGroup.appendChild(desc);
        desc.classList.add("banner-stat");
        desc.textContent = weatherData.description;
    }

    return container
}

function createForecasts(days) {
    const container = document.createElement("div");
    container.classList.add("weather-forecasts");

    // weather forecasts children
    days.forEach((day, index) => {
        const btn = document.createElement("button");
        const dayOfWeek = document.createElement("p");
        const icon = document.createElement("img");
        const temp = document.createElement("p");
        container.appendChild(btn);
        btn.appendChild(dayOfWeek);
        btn.appendChild(icon);
        btn.appendChild(temp);

        btn.classList.add("forecast");
        if (index === 0) {
            btn.classList.add("active");
        }
        dayOfWeek.classList.add("day-of-week");
        dayOfWeek.textContent = day.date.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric"});
        icon.classList.add("icon");
        import(`../assets/icons/weather/${day.icon}.svg`).then((module) => {
            icon.src = module.default;
        });
        temp.classList.add("temp");
        temp.innerHTML = `${day.tempmin}<span class="temp-unit">&deg;</span> | ${day.tempmax}<span class="temp-unit">&deg;</span>`;
    
        btn.addEventListener("click", () => {
            const btns = [...document.querySelectorAll(".forecast")];
            btns.forEach((b) => b.classList.remove("active"));

            const weather = document.querySelector("#weather");
            const oldHighlight = document.querySelector(".highlight");
            const newHighlight = createWeatherBanner(day);
            weather.replaceChild(newHighlight, oldHighlight);
            btn.classList.add("active");
        });
    });

    return container
}

function showWeather(weatherData) {
    removeWeather();

    const content = document.querySelector(".content");
    const weather = document.createElement("section");
    const currHeading = document.createElement("p");
    const forecastHeading = document.createElement("p");
    content.appendChild(weather);
    weather.appendChild(currHeading);
    weather.appendChild(createWeatherBanner(weatherData.currentConditions, true));

    weather.appendChild(forecastHeading);
    weather.appendChild(createForecasts(weatherData.days));
    weather.appendChild(createWeatherBanner(weatherData.days[0]));
    weather.id = "weather";
    currHeading.classList.add("heading");
    currHeading.textContent = "Current Weather";
    forecastHeading.classList.add("heading");
    forecastHeading.textContent = "Weather Forecast";
}

function showLoading() {
    removeWeather();
    const content = document.querySelector(".content");
    const weather = document.createElement("section");
    const loader = document.createElement("div");
    content.appendChild(weather);
    weather.appendChild(loader);

    weather.id = "weather";
    loader.classList.add("loader");
}

const form = document.querySelector("form");
const input = document.querySelector("#search-input");
// const btn = document.querySelector("#search-btn");

form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
        e.preventDefault();

        const location = input.value;
        getWeather(location).then(showWeather);
        showLoading();
    }
});