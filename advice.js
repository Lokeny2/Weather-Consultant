        async function getRealWeather() {
            const city = document.getElementById('cityInput').value;
            const cityDisplay = document.getElementById('cityNameDisplay');
            const tempDisplay = document.getElementById('main-temp');
            const descDisplay = document.getElementById('description');
            const iconDiv = document.getElementById('weather-icon');
            const bentoGrid = document.getElementById('details');

            // Replace with your actual OpenWeatherMap API Key
            const apiKey = 'a1b60601df153c437f15b93de795edc6';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

            if (!city) {
                descDisplay.innerText = "Please enter a city name.";
                return;
            }

            try {
                descDisplay.innerText = "Consulting the skies...";
                
                const response = await fetch(url);
                if (!response.ok) throw new Error("City not found");
                const data = await response.json();

                // 1. Update Core UI
                cityDisplay.innerText = data.name;
                tempDisplay.innerText = `${Math.round(data.main.temp)}°C`;
                descDisplay.innerText = data.weather[0].description;

                // 2. Animate Grid Visibility
                bentoGrid.style.opacity = "1";
                bentoGrid.style.transform = "translateY(0)";

                // 3. Populate Bento Grid
                document.getElementById('humidity').innerText = data.main.humidity;
                document.getElementById('wind').innerText = data.wind.speed;
                document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);

                // 4. State-Based Animations
                const temp = data.main.temp;
                iconDiv.className = ""; // Reset
                
                if (temp === 27) {
                    iconDiv.innerText = "🌟";
                    iconDiv.classList.add("perfect-animation");
                } else if (temp > 30) {
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
                descDisplay.innerHTML = `<span style="color: #fb7185;">${err.message}</span>`;
                bentoGrid.style.opacity = "0";
                bentoGrid.style.transform = "translateY(15px)";
                iconDiv.innerText = "⚠️";
                iconDiv.className = "";
            }
        }

        // Allow "Enter" key to trigger search
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') getRealWeather();
        });