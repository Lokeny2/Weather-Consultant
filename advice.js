async function getRealWeather() {
            const city = document.getElementById('cityInput').value;
            const cityDisplay = document.getElementById('cityNameDisplay');
            const tempDisplay = document.getElementById('main-temp');
            const descDisplay = document.getElementById('description');
            const iconDiv = document.getElementById('weather-icon');
            const bentoGrid = document.getElementById('details');

            // --- CONFIG ---
            const apiKey = 'a1b60601df153c437f15b93de795edc6'; 
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

            if (!city) {
                descDisplay.innerText = "Please enter a city!";
                return;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("City not found");
                const data = await response.json();

                // 1. Update the Core UI
                cityDisplay.innerText = data.name;
                tempDisplay.innerText = `${Math.round(data.main.temp)}°C`;
                descDisplay.innerText = data.weather[0].description;
                bentoGrid.style.opacity = "1";

                // 2. Update Bento the Grid Values
                document.getElementById('humidity').innerText = data.main.humidity;
                document.getElementById('wind').innerText = data.wind.speed;
                document.getElementById('pressure').innerText = data.main.pressure;
                document.getElementById('visibility').innerText = (data.visibility / 1000).toFixed(1);
                document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);

                // 3. Handle State-Specific Animations
                const temp = data.main.temp;
                iconDiv.className = ""; // Reset
                
                if (temp > 30) {
                    iconDiv.innerText = "🥵";
                    iconDiv.classList.add("hot-animation");
                } else if (temp >= 15) {
                    iconDiv.innerText = "☀️";
                    iconDiv.classList.add("perfect-animation");
                } else {
                    iconDiv.innerText = "❄️";
                    iconDiv.classList.add("cold-animation");
                }

            } catch (err) {
                descDisplay.innerHTML = `<span style="color: #f87171;">${err.message}</span>`;
                bentoGrid.style.opacity = "0";
                iconDiv.innerText = "⚠️";
                iconDiv.className = "";
            }
        }