// Return a string based on the temperature
const getWeatherAdvice = (temp) => {
    if (temp === 27) return "the Best Day Ever! 🌟";
    if (temp > 30)  return "Too Hot 🥵";
    if (temp >= 15) return "Perfect ☀️";
    return "Too Cold ❄️";
};

//Celsius to Fahrenheit conversion 
const convertToFahrenheit = (celsius) => (celsius * 9/5) + 32;


function updateUI() {
    // Getting elements from the HTML
    const nameInput = document.getElementById('userName');
    const tempInput = document.getElementById('userTemp');
    const display = document.getElementById('result');

    const name = nameInput.value;
    const tempC = parseFloat(tempInput.value);

    // Guard Clause: Check for empty name or invalid temperature
    if (!name || isNaN(tempC)) {
        display.innerText = "Please enter both a name and a temperature.";
        return;
    }

    // Calculating data
    const advice = getWeatherAdvice(tempC);
    const tempF = convertToFahrenheit(tempC);

    // Updating the Screen
    display.innerHTML = `Hey ${name}!<br>
                         It's ${tempC}°C (<strong>${tempF.toFixed(1)}°F</strong>) today.<br>
                         The weather is <strong>${advice}</strong>.`;
}
