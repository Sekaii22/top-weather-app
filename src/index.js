import "./styles.css";
import { getWeather } from "./weather";
import { showWeather, showLoading } from "./weather-ui";

const form = document.querySelector("form");
const input = document.querySelector("#search-input");

form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
        e.preventDefault();

        const location = input.value;
        getWeather(location).then(showWeather);
        showLoading();
    }
});