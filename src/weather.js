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
            date: new Date(data.currentConditions.datetimeEpoch * 1000),
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

export { getWeather, processWeatherData };