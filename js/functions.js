import API_KEY from './config.js';

const responseMain = document.getElementById("response-main");
const responseTertiary = document.getElementById("response-tertiary");
const responseAdditional = document.getElementById("response-additional");
const weatherQuery = document.getElementById("weather-query");

weatherQuery.addEventListener("change", async () => {
    responseMain.innerHTML = /* HTML */ `
        <div id="loadingAnimation">
            <span class="wave-dot"></span>
            <span class="wave-dot"></span>
            <span class="wave-dot"></span>
        </div>
    `;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const weatherData = await getData(position.coords.latitude, position.coords.longitude);

            switch (weatherData.name) {
                case "Helsinki":
                    responseTertiary.innerHTML = `Teikäläine o vissii <span class="city-name">Helsingis</span>, isol kirkol.`;
                    break;
                case "Pori":
                    responseTertiary.innerHTML = `Ooks <span class="city-name">Poris</span>? Aiko hianoo.`;
                    break;
                case "Nakkila":
                    responseTertiary.innerHTML = `Ooks <span class="city-name">Nakkilas</span> vai, millai sää sin oot eksyny?`;
                    break;
                case "Rauma":
                    responseTertiary.innerHTML = `Ooks sää <span class="city-name">Raumal?!</span> Men ny menee siält!`;
                    break;
                case "Lahti":
                    responseTertiary.innerHTML = `Teikäläine o vissii <span class="city-name">Lahdes</span>, vai onks se <span class="city-name">Lahes</span>.`;
                    break;
                default:
                    responseTertiary.innerHTML = `Teikäläine o vissii paikas <span class="city-name">${weatherData.name}</span>.Teikäläine`;
                    break;
            }

            switch (weatherQuery.value) {
                case "is-raining":
                    const rainLastHour = weatherData.rain && weatherData.rain["1h"] ? weatherData.rain["1h"] : 0;

                    if (rainLastHour > 0) {
                        responseMain.innerHTML = "Kyl vaa tiäks";
                        responseAdditional.innerHTML = `Sademäärä o ny <strong>${rainLastHour} mm/h</strong>.`;
                    } else {
                        responseMain.innerHTML = "Ei taid";
                        responseAdditional.innerHTML = `Sademäärä o ny <strong>0 mm/h</strong>.`;
                    }
                    break;
                case "is-dark":
                    const unixUTC = Math.floor(Date.now() / 1000);

                    const sunriseDateObj = new Date(weatherData.sys.sunrise * 1000);
                    sunriseDateObj.setHours(sunriseDateObj.getHours() + 2);
                    const sunriseTime = sunriseDateObj.toISOString().slice(11, 16);

                    const sunsetDateObj = new Date(weatherData.sys.sunset * 1000);
                    sunsetDateObj.setHours(sunsetDateObj.getHours() + 2);
                    const sunsetTime = sunsetDateObj.toISOString().slice(11, 16);

                    if (unixUTC > weatherData.sys.sunrise && unixUTC < weatherData.sys.sunset) {
                        responseMain.innerHTML = "Ei ol";
                        responseAdditional.innerHTML = `Aurinko nous tänää klo <strong>${sunriseTime}</strong> ja laskee tosa klo <strong>${sunsetTime}</strong>.`;
                    } else if (unixUTC > weatherData.sys.sunrise && unixUTC > weatherData.sys.sunset) {
                        responseMain.innerHTML = "Juu o";
                        responseAdditional.innerHTML = `Aurinko nous tänää klo <strong>${sunriseTime}</strong> ja laski tosa klo <strong>${sunsetTime}</strong>.`;
                    } else {
                        responseMain.innerHTML = "Juu o";
                        responseAdditional.innerHTML = `Aurinko nousee tänää klo <strong>${sunriseTime}</strong> ja laskee tosa klo <strong>${sunsetTime}</strong>.`;
                    }
                    break;
                case "is-cold":
                    const temperatureCelsius = weatherData.main.temp - 273.15;

                    if (weatherData.main.temp < 283.15) {
                        responseMain.innerHTML = "Tarvii kyl";
                        responseAdditional.innerHTML = `Ulkon o hei sit <strong>${temperatureCelsius.toFixed(0)} °C</strong>.`;
                    } else {
                        responseMain.innerHTML = "Ei kyl";
                        responseAdditional.innerHTML = `Ulkon o hei <strong>${temperatureCelsius.toFixed(0)} °C</strong> lämmint.`;
                    }
                    break;
                default:
                    break;
            }
        });
    } else {
        console.log("Geolocation IS NOT available!");
    }
    
    const getData = async (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error.message);
        }
    }
});

const positiveFeedback = document.getElementById("positive-feedback");
positiveFeedback.addEventListener("click", () => {
    responseMain.innerHTML = "On kai!";
    responseAdditional.innerHTML = `On kai se ny hyvä ko mää ole se tehny.`;
    responseTertiary.innerHTML = `...`;
    weatherQuery.selectedIndex = 0;
});

const negativeFeedback = document.getElementById("negative-feedback");
negativeFeedback.addEventListener("click", () => {
    responseMain.innerHTML = "Men vattalles.";
    responseAdditional.innerHTML = `Eiko kaikki palaute o tärkeet hei!`;
    responseTertiary.innerHTML = `...`;
    weatherQuery.selectedIndex = 0;
});