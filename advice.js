/**
 * Return a specific advice string based on temperature
 */
const getWeatherAdvice = (temp) => {
    if (temp === 27) return "the Best Day Ever! 🌟";
    if (temp > 30)  return "Too Hot 🥵";
    if (temp >= 15) return "Perfect ☀️";
    return "Too Cold ❄️";
};

/**
 * Celsius to Fahrenheit conversion 
 */
const convertToFahrenheit = (celsius) => (celsius * 9/5) + 32;

/**
 * Connect HTML inputs to the logic and trigger animations
 */
function updateUI() {
    // 1. Getting elements from the HTML
    const nameInput = document.getElementById('userName');
    const tempInput = document.getElementById('userTemp');
    const display = document.getElementById('result');
    const iconDiv = document.getElementById('weather-icon'); // The animation target

    const name = nameInput.value;
    const tempC = parseFloat(tempInput.value);

    // 2. Guard Clause: Check for empty name or invalid temperature
    if (!name || isNaN(tempC)) {
        display.innerText = "Please enter both a name and a temperature.";
        iconDiv.innerText = "❓";
        iconDiv.className = ""; // Reset animation
        return;
    }

    // 3. Reset state: Clear old animations before starting new ones
    iconDiv.className = "";

    // 4. State Management: Trigger animations and set the emoji
    if (tempC === 27) {
        iconDiv.innerText = "🌟";
        iconDiv.classList.add("perfect-animation");
    } else if (tempC > 30) {
        iconDiv.innerText = "🥵";
        iconDiv.classList.add("hot-animation");
    } else if (tempC >= 15) {
        iconDiv.innerText = "☀️";
        iconDiv.classList.add("perfect-animation");
    } else {
        iconDiv.innerText = "❄️";
        iconDiv.classList.add("cold-animation");
    }

    // 5. Calculating data
    const advice = getWeatherAdvice(tempC);
    const tempF = convertToFahrenheit(tempC);

    // 6. Updating the Screen
    display.innerHTML = `Hey ${name}!<br>
                         It's ${tempC}°C (<strong>${tempF.toFixed(1)}°F</strong>) today.<br>
                         The weather is <strong>${advice}</strong>.`;
}
