   // --- HELPERS ---

function getDescriptor(temp, conditions) {
    const c = conditions.toLowerCase();



    if (c.includes('thunderstorm')) return { text: '⛈️ Stay indoors today!',      cls: 'cold'  };
    if (c.includes('drizzle'))      return { text: '🌦️ Light drizzle out there.', cls: 'mild'  };
    if (c.includes('rain'))         return { text: '🌧️ Grab your umbrella!',       cls: 'cold'  };
    if (c.includes('snow'))         return { text: '❄️ It\'s a snow day!',         cls: 'cold'  };
    if (c.includes('mist') || c.includes('fog'))
                                    return { text: '🌫️ Misty and mysterious.',     cls: 'mild'  };

    if (temp >= 35) return { text: '🥵 Dangerously hot — stay hydrated!', cls: 'hot'   };
    if (temp >= 30) return { text: '☀️ Scorching! Sunscreen is a must.',  cls: 'hot'   };
    if (temp >= 25 && temp <= 28)
                    return { text: '🌟 The Best Day Ever!',                cls: 'great' };
    if (temp >= 20) return { text: '😎 Beautiful weather today!',         cls: 'great' };
    if (temp >= 15) return { text: '🍃 Nice and breezy out there.',       cls: 'mild'  };
    if (temp >= 10) return { text: '🧥 A little chilly — layer up.',      cls: 'cold'  };
    if (temp >= 0)  return { text: '🥶 It\'s freezing out there!',        cls: 'cold'  };

    return             { text: '🧊 Bitterly cold — stay warm!',           cls: 'cold'  };
}



function toFahrenheit(celsius) {
    return Math.round((celsius * 9 / 5) + 32);
}

function resetDescriptor() {
    const descriptor       = document.getElementById('descriptor');
    descriptor.textContent = '';
    descriptor.className   = 'descriptor';
}

function setLoadingState(isLoading) {
    const card = document.querySelector('.card');
    const btn  = document.querySelector('button');

    if (isLoading) {
        card.classList.add('loading');
        btn.innerHTML = '<span class="spinner"></span> Checking...';
    } else {
        card.classList.remove('loading');
        btn.innerHTML = 'Check Weather';
    }
}

function getIcon(temp, conditions) {
    const c = conditions.toLowerCase();



    if (c.includes('thunderstorm'))                  return { icon: '⛈️', cls: 'perfect-animation' };
    if (c.includes('rain') || c.includes('drizzle')) return { icon: '🌧️', cls: 'perfect-animation' };
    if (c.includes('snow'))                          return { icon: '❄️', cls: 'cold-animation'    };
    if (c.includes('mist') || c.includes('fog'))     return { icon: '🌫️', cls: 'perfect-animation' };
    if (c.includes('cloud'))                         return { icon: '☁️', cls: 'perfect-animation' };

    if (temp >= 30) return { icon: '🥵', cls: 'hot-animation'     };
    if (temp >= 20) return { icon: '☀️', cls: 'perfect-animation' };
    if (temp >= 10) return { icon: '🌤️', cls: 'perfect-animation' };

    return             { icon: '🥶', cls: 'cold-animation'    };
}


// --- TYPEWRITER CONTROLS ---

function showWeather() {
    clearTimeout(typeTimer);
    document.getElementById('idle-display').classList.add('hidden');
    document.getElementById('main-temp').classList.add('visible');
}

function showIdle() {
    document.getElementById('main-temp').classList.remove('visible');
    document.getElementById('idle-display').classList.remove('hidden');
    type();
}



// --- MAIN FUNCTION ---

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
        setLoadingState(true);
        resetDescriptor();

        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found. Try again.');
        const data = await response.json();

        const temp       = Math.round(data.main.temp);
        const feelsLike  = Math.round(data.main.feels_like);
        const conditions = data.weather[0].description;

  

      // 1. Greeting
        const greeting = name ? `Hey ${name}!` : `Hey there!`;
        cityDisplay.textContent = `${greeting} · ${data.name}`;

        // 2. Temperature — both units
        tempC.textContent = temp;
        tempF.textContent = `(${toFahrenheit(temp)}°F)`;

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

        // 5. Icon
        const { icon, cls: iconCls } = getIcon(temp, conditions);
        iconDiv.className   = '';
        iconDiv.textContent = icon;
        iconDiv.classList.add(iconCls);

        // 6. Swap typewriter out, temperature in
        showWeather();

    } catch (err) {
        descDisplay.innerHTML = `<span style="color:#fb7185;">${err.message}</span>`;
        resetDescriptor();
        bentoGrid.style.opacity   = '0';
        bentoGrid.style.transform = 'translateY(15px)';
        iconDiv.textContent = '⚠️';
        iconDiv.className   = '';

        // Restore typewriter on error
        showIdle();

    } finally {
        setLoadingState(false);
    }
}



// --- EVENT LISTENERS ---

document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('cityInput').focus();
});

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRealWeather();
});
