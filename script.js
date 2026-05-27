const background = document.getElementById("background");
const timeDisplay = document.getElementById("time");
const weatherDisplay = document.getElementById("weather");
const triviaDisplay = document.getElementById("trivia");

// 1. Simple, Clock
function updateClock() {
    const data = new Date();
    
    const hours = data.getHours();
    const minutes = data.getMinutes();
    const seconds = data.getSeconds();

    const pad = (num) => String(num).padStart(2, '0');
    timeDisplay.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// 2. NASA Background Fetcher
async function getBackground(){
    const url="https://api.nasa.gov/planetary/apod?api_key=qF2xtffJ6XiUgz0UcWsXzjLHo1UZQSK41EWMegeQ";
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        return result.media_type === "image" ? result.url : null;
    } catch(error) {
        console.error("APOD Error:", error.message);
        return null;
    }
}

// 3. Weather Fetcher
function initWeather(){
    if (!navigator.geolocation){
        weatherDisplay.innerText = "Geolocation not supported";
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const current = data.current;
            weatherDisplay.innerText = `${current.precipitation_probability}% 🌧️ | ${current.temperature_2m}°F`;
        } catch (err) {
            weatherDisplay.innerText = "Weather unavailable";
        }
    }, () => {
        weatherDisplay.innerText = "Location denied";
    }); 
} 

// 4. Custom Trivia Twist
async function getTrivia(){
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=1&type=boolean");
        const data = await response.json();
        if (data.results && data.results.length > 0){
            const parser = new DOMParser();
            const question = parser.parseFromString(data.results[0].question, 'text/html').body.textContent;
            triviaDisplay.innerText = `Trivia: ${question}`;
        }
    } catch(err) {
        triviaDisplay.innerText = "Stay curious!";
    }
}

// 5. Run everything
window.onload = function() {
       updateClock();
    setInterval(updateClock, 1000);
    
    initWeather();
    getTrivia();

    getBackground().then((imageUrl) => {
        if (imageUrl && background) {
            background.style.backgroundImage = `url('${imageUrl}')`;
        }
    });
};