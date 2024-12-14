import API_KEY from './config.js';

const responseMessage = document.getElementById("response-message");

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        getData(position.coords.latitude, position.coords.longitude);
    });
} else {
    console.log("Geolocation IS NOT available!");
}

const getData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=-${longitude}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        // const json = await response.json();
        console.log(response);
    } catch (error) {
        console.error(error.message);
    }
}