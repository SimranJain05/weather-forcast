function capitalizeDescription(description) {
    return description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getWeather(){
    const apiKey = '7d435b6bf21823e072fb1c46bb99007c';
    const city = document.getElementById('city').value;

    if(!city){
        alert("Please enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
       })
       .catch(error => {
            console.error("Error in fetching current weather data : " , error);
            alert("Error fetching current weather data. Please try again.")
       });

    fetch(forecastUrl)
       .then(response => response.json())
       .then(data => {
          displayHourlyForecast(data.list);
       })

       .catch(error => {
            console.error("Error in fetching hourly forecast data : " , error);
            alert("Error fetching hourly forecast data. Please try again.") 
       })

}

function displayWeather(data){
    const tempDivInfo = document.getElementById('temp-div');
    const weatherDivInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const dateDiv = document.getElementById('date-div');
    
    // clear previous content

    weatherDivInfo.innerHTML = '';
    tempDivInfo.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    dateDiv.innerHTML = '';

    if(data.cod === '404'){
        weatherDivInfo.innerHTML = `<p>${data.message}</p>`;
    }
    else{
        const cityName = data.name;
        const date = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];
        const dayDate = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();

        const temperature = Math.round(data.main.temp - 273.15);
        const description = capitalizeDescription(data.weather[0].description);
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png` ;

        const dateHtml = `<p>${dayName}, ${dayDate}/${month}/${year}</p>`;

        const temperatureHTML = `<p>${temperature}°C </p>`;

        const weatherHTML = `<p><i class='bx bxs-map' style='color:#ffffff' ></i>  ${cityName}</p>
                             <p>${description}</p>
                             `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherDivInfo.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        dateDiv.innerHTML = dateHtml;

        showImage();
    }
}

function displayHourlyForecast(hourlyData){
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0,8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png` ;

        const hourlyItemHtml = `
                <div class = "hourly-item">
                    <span>${hour}:00</span>
                    <img src ="${iconUrl}" alt="Hourly Weather Icon">
                    <span>${temperature}°C </span>
                </div>
            `;

            hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() { 
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
 }