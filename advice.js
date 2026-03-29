     // THE HELPER FUNCTIONS

function getDescriptor(temp, conditions) {
    const c = conditions.toLowerCase();

    // Conditions checked first — weather type
    if (c.includes('thunderstorm')) return { text: '⛈️ Stay indoors today!',        cls: 'cold'  };
    if (c.includes('drizzle'))      return { text: '🌦️ Light drizzle out there.',    cls: 'mild'  };
    if (c.includes('rain'))         return { text: '🌧️ Grab your umbrella!',         cls: 'cold'  };
    if (c.includes('snow'))         return { text: '❄️ It\'s a snow day!',           cls: 'cold'  };
    if (c.includes('mist') || c.includes('fog'))
                                    return { text: '🌫️ Misty and mysterious.',       cls: 'mild'  };

    // Temperature checked second
    if (temp >= 35) return { text: '🥵 Dangerously hot — stay hydrated!',           cls: 'hot'   };
    if (temp >= 30) return { text: '☀️ Scorching! Sunscreen is a must.',            cls: 'hot'   };
    if (temp >= 25 && temp <= 28)
                    return { text: '🌟 The Best Day Ever!',                          cls: 'great' };
    if (temp >= 20) return { text: '😎 Beautiful weather today!',                   cls: 'great' };
    if (temp >= 15) return { text: '🍃 Nice and breezy out there.',                 cls: 'mild'  };
    if (temp >= 10) return { text: '🧥 A little chilly — layer up.',                cls: 'cold'  };
    if (temp >= 0)  return { text: '🥶 It\'s freezing out there!',                  cls: 'cold'  };

    return             { text: '🧊 Bitterly cold — stay warm!',                     cls: 'cold'  };
}

function resetDescriptor() {
    const descriptor    = document.getElementById('descriptor');
    descriptor.textContent = '';
    descriptor.className   = 'descriptor';
}

// MY MAIN FUNCTION 
async function getRealWeather() {
    const nameInput  = document.getElementById('nameInput');
    const cityInput  = document.getElementById('cityInput');
    const city       = cityInput.value.trim();
    const name       = nameInput.value.trim();

    const cityDisplay = document.getElementById('cityNameDisplay');
    const tempC       = document.getElementById('temp-c');
    const tempF       = document.getElementById('temp-f');
    const descDisplay = document.getElementById('description');
    const descriptor  = document.getElementById('descriptor');
    const iconDiv     = document.getElementById('weather-icon');
    const bentoGrid   = document.getElementById('details');

    const apiKey = 'a1b60601df153c437f15b93de795edc6';
    const url    = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    if (!city) {
        descDisplay.textContent = 'Please enter a city name.';
        resetDescriptor();
        return;
    }

    try {
        descDisplay.textContent = 'Consulting the skies...';
        resetDescriptor();

        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found. Try again.');
        const data = await response.json();

        const temp       = Math.round(data.main.temp);
        const feelsLike  = Math.round(data.main.feels_like);
        const fahrenheit = Math.round((temp * 9 / 5) + 32);
        const conditions = data.weather[0].description;

        // 1. Greeting
        const greeting = name ? `Hey ${name}!` : `Hey there!`;
        cityDisplay.textContent = `${greeting} · ${data.name}`;

        // 2. Temperature — both units
        tempC.textContent = temp;
        tempF.textContent = `(${fahrenheit}°F)`;

        // 3. Description + descriptor
        descDisplay.textContent = conditions;
        const { text, cls }     = getDescriptor(temp, conditions);
        descriptor.textContent  = text;
        descriptor.className    = `descriptor ${cls}`;

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
        } else if (temp >= 25 && temp <= 28) {
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
        resetDescriptor();
        bentoGrid.style.opacity   = '0';
        bentoGrid.style.transform = 'translateY(15px)';
        iconDiv.textContent = '⚠️';
        iconDiv.className   = '';
    }
}

// EVENT LISTENERS
document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('cityInput').focus();
});

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRealWeather();
});
