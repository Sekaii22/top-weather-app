function removeWeather() {
    const content = document.querySelector(".content");
    const weather = document.querySelector("#weather");

    if (weather) {
        content.removeChild(weather);
    }
}

function createWeatherBanner(dayData, curr=false) {
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

    import(`../assets/icons/weather/${dayData.icon}.svg`).then((module) => {
        icon.src = module.default;
    });
    temp.innerHTML = `${dayData.temp}<span class="temp-unit">&deg;C</span>`;
    if (curr) {
        temp.innerHTML = temp.innerHTML + ` <span>Feels like ${dayData.feelslike}°C</span>`;
        dateTime.textContent = dayData.date.toLocaleTimeString(undefined, {hour: "numeric"}) + ", ";
    }
    dateTime.textContent = dateTime.textContent + dayData.date.toLocaleDateString(undefined, {weekday: "long", year: "numeric", month: "short", day: "numeric"});
    desc.textContent = dayData.conditions;

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

    precip.textContent = `Precipitation: ${dayData.precipprob}%`;
    humidity.textContent = `Humidity: ${dayData.humidity}`;
    wind.textContent = `Wind: ${dayData.windspeed}`;
    uvIndex.textContent = `UV Index: ${dayData.uvindex}`;
    if (!curr) {
        const desc = document.createElement("p");
        statGroup.appendChild(desc);
        desc.classList.add("banner-stat");
        desc.textContent = dayData.description;
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
        temp.innerHTML = `${day.tempmin}<span class="temp-unit">&deg;</span> ~ ${day.tempmax}<span class="temp-unit">&deg;</span>`;
    
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
    currHeading.textContent = `Current Weather in ${weatherData.address}`;
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

function showError() {
    removeWeather();

    const content = document.querySelector(".content");
    const weather = document.createElement("section");
    const errorText = document.createElement("p");
    content.appendChild(weather);
    weather.appendChild(errorText);

    weather.id = "weather";
    errorText.classList.add("error-text");
    errorText.textContent = "Error encountered, make sure the location does exists."
}

export { removeWeather, showWeather, showLoading, showError }