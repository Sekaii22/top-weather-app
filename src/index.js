import "./styles.css";
import { getWeather } from "./weather";
import { removeWeather, showWeather, showLoading, showError } from "./weather-ui";

const form = document.querySelector("form");
const input = document.querySelector("#search-input");

form.addEventListener("submit", (e) => {
    if (form.checkValidity()) {
        e.preventDefault();
        input.classList.remove("error");

        const location = input.value;
        getWeather(location).then(showWeather).catch((err) => {
            showError();
            console.log(err.message);
            input.classList.add("error");
        });
        showLoading();
    }
});