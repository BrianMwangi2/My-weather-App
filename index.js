
// functions for the navigation bar !
function setActive(pageName) {
    // Get all the <a> elements inside the navbar
    var navbarItems = document.querySelectorAll('#navbar a');

    // Loop through each <a> element
    navbarItems.forEach(function(item) {
        // Remove 'active' class from all elements
        item.classList.remove('active');

        // Add 'active' class to the clicked element
        if (item.innerHTML.toLowerCase() === pageName) {
            item.classList.add('active');
        }
    });
}
function extractContactInfo() {
    // Find the element containing contact information
    const contactDiv = document.getElementById('contact-info');

    if (contactDiv) {
        // Extract information from the child elements
        const name = contactDiv.querySelector('p:nth-child(2)').textContent.trim();
        const email = contactDiv.querySelector('p:nth-child(3)').textContent.trim();
        const phone = contactDiv.querySelector('p:nth-child(4)').textContent.trim();

        // Create an object to hold the extracted contact information
        const contact = {
            name: name.replace('Name: ', ''),
            email: email.replace('Email: ', ''),
            phone: phone.replace('Phone: ', '')
        };

        return contact;
    } else {
        console.error('Contact information container not found.');
        return null;
    }
}

// Call the function to extract and display contact information
const extractedContact = extractContactInfo();
if (extractedContact) {
    console.log('Extracted Contact Information:');
    console.log('Name:', extractedContact.name);
    console.log('Email:', extractedContact.email);
    console.log('Phone:', extractedContact.phone);
}

// creating variAables that will be used in running the code !
const weatherForm = document.querySelector(".weatherForm");// this is the form that will be used to get the city name

const cityInput = document.querySelector(".cityInput");//this
const card = document.querySelector(".card");
const apiKey = "c6ed23213fa21460db212c45244a7bfe";

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }
});


// adding fetch !!! function so as to fetch data from open weathermap and display it as a json file

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        throw new Error(`Error fetching weather data: ${error.message}`);
    }
}

// in this function we are desaling w the weather info that is mainly the city, temp, humidity, and description
function createWeatherElement(tag, textContent) {
    const element = document.createElement(tag);
    element.textContent = textContent;
    element.classList.add(`${tag.toLowerCase()}Display`); // Add class based on element type
    return element;
}

// Define a mapping object for weather IDs to emojis
const weatherEmojiMap = {
    '2xx': '⛈️', // Thunderstorm
    '3xx': '🌧️', // Drizzle
    '5xx': '🌧️', // Rain
    '6xx': '❄️', // Snow
    '7xx': '🌫️', // Atmosphere
    '800': '☀️', // Clear
    '80x': '☁️', // Clouds
    'default': '❓' // Default emoji
};

// Function to get weather emoji based on weather ID
function getWeatherEmoji(weatherId) {
    const category = Math.floor(weatherId / 100); // Get the category (2, 3, 5, 6, 7, 8)
    const key = (weatherId === 800) ? '800' : `${category}xx`; // Special case for clear weather
    return weatherEmojiMap[key] || weatherEmojiMap['default'];
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather } = data;

    card.innerHTML = ""; // Clear card content
    card.style.display = "flex";

    const elements = [
        createWeatherElement("h1", city),
        createWeatherElement("p", `${((temp - 273.15) * (9 / 5) + 32).toFixed(1)}°F`),
        createWeatherElement("p", `Humidity: ${humidity}%`),
        ...weather.map(w => createWeatherElement("p", w.description)),
        createWeatherElement("p", getWeatherEmoji(weather[0].id)) // Use the first weather condition ID for emoji
    ];

    elements.forEach(element => card.appendChild(element));
}
// adding classes to the elements


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

// this weather ids are derived from the site https://openweathermap.org/weather-conditions

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message){

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}
