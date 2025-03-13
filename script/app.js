const apiKey = "7f580d49eedea1b265d6819bc3765588";
const searchInput = document.getElementById("city-search");
const cityName = document.getElementById("city-name");
const cityTime = document.getElementById("city-time");
const cityDate = document.getElementById("city-date");

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const city = searchInput.value.trim();
        if (city !== "") {
            fetchWeatherData(city);
        }
    }
});

function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateCityCard(data);
            } else {
                alert("City not found. Please try again.");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}

function updateCityCard(data) {
    cityName.textContent = data.name;
  
    const timestamp = data.dt;
    const localTime = new Date(timestamp * 1000);
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(localTime);

    cityTime.textContent = formattedTime;

    
    const optionsDate = { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "short" };
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(localTime);

    cityDate.textContent = formattedDate;
}

document.getElementById("current-location").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "7f580d49eedea1b265d6819bc3765588";
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.cod === 200) {
                   
                    document.getElementById("current-location").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.name}`;
                    
                    
                    updateWeatherCard(data);
                    fetchFiveDayForecast(data.name);
                    fetchHourlyForecast(data.name); 

                    console.log("Weather data for current location:", data);
                } else {
                    alert("City not found!");
                }
            } catch (error) {
                console.error("Error fetching location data:", error);
                alert("Error fetching location data!");
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Location access denied. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});


document.getElementById("city-search").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const city = this.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});
const defaultCity = "Ahmednagar"; 
window.onload = () => {
    fetchWeather(defaultCity);
};


function fetchWeather(city) {
    const apiKey = "7f580d49eedea1b265d6819bc3765588";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherCard(data);
                fetchFiveDayForecast(city); 
                fetchHourlyForecast(city); 
            } else {
                alert("City not found!");
            }
        })
        //.catch(error => console.error("Error fetching weather:", error));
}

function updateWeatherCard(data) {
    document.querySelector(".city-card h2").textContent = data.name;
    document.querySelector(".weather-card h1").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".feels-like strong").textContent = `${Math.round(data.main.feels_like)}°C`;

    
    const weatherStats = document.querySelectorAll(".units");
    if (weatherStats.length >= 3) {
        weatherStats[0].textContent = `${data.main.humidity}%`;  // Humidity
        weatherStats[1].textContent = `${Math.round(data.wind.speed)} km/h`; // Wind Speed
        weatherStats[2].textContent = `${data.main.pressure} hPa`;  // Pressure
    }

    
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const sunInfo = document.querySelectorAll(".sun-info .pt");
    if (sunInfo.length >= 2) {
        sunInfo[0].textContent = sunriseTime;
        sunInfo[1].textContent = sunsetTime;
    }

    
    document.querySelector(".weather-name").textContent = data.weather[0].main;
    document.querySelector(".middle img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

   
    // fetchUVIndex(data.coord.lat, data.coord.lon);
}


// function fetchUVIndex(lat, lon) {
//     const apiKey = "7f580d49eedea1b265d6819bc3765588";
//     const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

//     fetch(uvUrl)
//         .then(response => response.json())
//         .then(data => {
//             const weatherStats = document.querySelectorAll(".units");
//             if (weatherStats.length >= 4 && data.current) {
//                 weatherStats[3].textContent = `${data.current.uvi}`;
//             }
//         })
//         .catch(error => console.error("Error fetching UV Index:", error));
// }



async function fetchFiveDayForecast(city) {
    const apiKey = "7f580d49eedea1b265d6819bc3765588";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "200") {
            updateFiveDayForecast(data);
        } else {
            alert("5-day forecast not found!");
        }
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
    }
}

function updateFiveDayForecast(data) {
    const forecastList = document.querySelector(".forecast-list");
    forecastList.innerHTML = "";

    const dailyForecasts = {};

    data.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                temp: Math.round(forecast.main.temp),
                icon: forecast.weather[0].icon,
                description: forecast.weather[0].main,
            };
        }
    });

    Object.keys(dailyForecasts).slice(0, 5).forEach((day) => {
        const forecast = dailyForecasts[day];

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");

        forecastItem.innerHTML = `
            <div class="col-md-2">
                <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
            </div>
            <div class="forecast-details">
                <div class="col-md-2"><span>${forecast.temp}°C</span></div>
                <div class="col-md-8"><span>${day}</span></div>
            </div>
        `;

        forecastList.appendChild(forecastItem);
    });
}

async function fetchHourlyForecast(city) {
    const apiKey = "7f580d49eedea1b265d6819bc3765588";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "200") {
            updateHourlyForecast(data);
        } else {
            alert("Hourly forecast not available!");
        }
    } catch (error) {
        console.error("Error fetching hourly forecast:", error);
    }
}

function updateHourlyForecast(data) {
    const hourlyContainer = document.querySelector(".hourly-container");
    hourlyContainer.innerHTML = ""; 
    const now = new Date(); 
    now.setMinutes(0, 0, 0); 

    const hourlyData = data.list.filter(forecast => {
        const forecastTime = new Date(forecast.dt * 1000);
        return forecastTime >= now; 
    });

    for (let i = 0; i < 5; i++) {
        if (!hourlyData[i]) break;

        const forecast = hourlyData[i];
        const forecastTime = new Date(forecast.dt * 1000);
        
        
        const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
        const formattedHour = new Intl.DateTimeFormat("en-US", options).format(forecastTime);

        const temp = Math.round(forecast.main.temp);
        const windSpeed = Math.round(forecast.wind.speed);
        const icon = forecast.weather[0].icon;
        const description = forecast.weather[0].main;

       
        const hour = forecastTime.getHours();
        const isDayTime = hour >= 4 && hour <= 18;
        const cardClass = isDayTime ? "hour-card1" : "hour-card2"; 

        
        const hourCard = document.createElement("div");
        hourCard.classList.add("col-6", "col-md-2", "hour-card", cardClass);

        hourCard.innerHTML = `
            <p>${formattedHour}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
            <p>${temp}°C</p>
            <img src="./assest/direction.png" alt="Wind">
            <p>${windSpeed} km/h</p>
        `;

        hourlyContainer.appendChild(hourCard);
    }
}

