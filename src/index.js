// import "./styles.css";

async function getWeather(location) {
    const key = "AC46DWSX8GQY73ENWGS8JY8DH";
    const weather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.trim()}/next6days?key=${key}&unitGroup=metric&iconSet=icons2`);
    const weatherData = await weather.json();
    const processedData = processWeatherData(weatherData);
    console.log(weatherData);
    console.log(processedData);
}

function processWeatherData(data) {
    return {
        address: data.resolvedAddress,
        description: data.description,
        currentConditions: {
            conditions: data.currentConditions.conditions,
            icon: data.currentConditions.icon,
            feelslike: data.currentConditions.feelslike,
            humidity: data.currentConditions.humidity,
            precipprob: data.currentConditions.precipprob,
            temp: data.currentConditions.temp,
            uvindex: data.currentConditions.uvindex,
            windspeed: data.currentConditions.windspeed
        },
        days: data.days.map((day) => ({
            date: day.datetime,
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

const form = document.querySelector("form");
const input = document.querySelector("#search-input");
const btn = document.querySelector("button");

form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
        e.preventDefault();

        const location = input.value;
        getWeather(location);
    }
});