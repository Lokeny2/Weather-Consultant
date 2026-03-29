      async function getRealWeather() {
    const nameInput  = document.getElementById('nameInput');
    const cityInput  = document.getElementById('cityInput');
    const city       = cityInput.value.trim();
    const name       = nameInput.value.trim();

    const cityDisplay = document.getElementById('cityNameDisplay');
    const tempC       = document.getElementById('temp-c');
    const tempF       = document.getElementById('temp-f');
    const descDisplay = document.getElementById('description');
    const iconDiv     = document.getElementById('weather-icon');
    const bentoGrid   = document.getElementById('details');

    const apiKey = 'a1b60601df153c437f15b93de795edc6';
    const url    = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    if (!city) {
        descDisplay.textContent = 'Please enter a city name.';
        return;
    }

    try {
        descDisplay.textContent = 'Consulting the skies...';

        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found. Try again.');
        const data = await response.json();

        const temp      = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const fahrenheit = Math.round((temp * 9 / 5) + 32);

        // 1. Greeting — name if provided, else it falls back to generic
        const greeting = name ? `Hey ${name}!` : `Hey there!`;
        cityDisplay.textContent = `${greeting} · ${data.name}`;

        // 2. Temperature — both units 
        tempC.textContent = temp;
        tempF.textContent = `(${fahrenheit}°F)`;

        // 3. Description
        descDisplay.textContent = data.weather[0].description;

        // 4. Bento grid
        bentoGrid.style.opacity   = '1';
        bentoGrid.style.transform = 'translateY(0)';
        document.getElementById('humidity').textContent  = data.main.humidity;
        document.getElementById('wind').textContent      = data.wind.speed;
        document.getElementById('feelsLike').textContent = feelsLike;

        // 5. Icon + animation
        iconDiv.className = '';
        if (temp >= 30) {
            iconDiv.textContent = '🥵';
            iconDiv.classList.add('hot-animation');
        } else if (temp === 27 || (temp >= 25 && temp <= 28)) {
            iconDiv.textContent = '🌟';
            iconDiv.classList.add('perfect-animation');
        } else if (temp >= 15) {
            iconDiv.textContent = '☀️';
            iconDiv.classList.add('perfect-animation');
        } else {
            iconDiv.textContent = '❄️';
            iconDiv.classList.add('cold-animation');
        }

    } catch (err) {
        descDisplay.innerHTML = `<span style="color:#fb7185;">${err.message}</span>`;
        bentoGrid.style.opacity   = '0';
        bentoGrid.style.transform = 'translateY(15px)';
        iconDiv.textContent = '⚠️';
        iconDiv.className   = '';
    }
}

// Enter on name field jumps to city field
document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('cityInput').focus();
});

// Enter on city field triggers a fetch
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRealWeather();
});
