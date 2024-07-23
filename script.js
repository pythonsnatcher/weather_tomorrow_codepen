// Function to fetch weather data from CSV URL
async function fetchWeatherData() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1Kc82bLJaPwsLR55owMorJKZDjD-PFBOdsqS4lylfTs4/export?format=csv';

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    return parseCSV(data); // Parse CSV data into JavaScript objects
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    return null; // Return null to handle the error case
  }
}

// Function to parse CSV data into an array of objects
function parseCSV(data) {
  const rows = data.trim().split('\n').map(row => row.split(','));
  const headers = rows[0];
  const records = rows.slice(1).map(row => {
    let record = {};
    row.forEach((value, index) => {
      // Clean up extra whitespace and handle special characters in keys
      const key = headers[index].trim();
      record[key] = value.trim();
    });
    return record;
  });
  return records;
}

// Function to display weather data on the webpage
function displayWeatherData(data) {
  const noDataMsg = document.getElementById('no-data');

  // Hide no data message
  noDataMsg.style.display = 'none';

  // Display weather data
  if (data && data.length > 0) {
    const weather = data[0]; // Assuming only one record is fetched
    document.getElementById('location').textContent = weather['Location'];
    document.getElementById('date').textContent = weather['Date'];
    document.getElementById('high_temp').textContent = weather['High Temperature(C)'];
    document.getElementById('low_temp').textContent = weather['Low Temperature(C)'];
    document.getElementById('wind_speed').textContent = weather['Wind Speed(mph)'];
    document.getElementById('humidity').textContent = weather['Humidity(%)'];
    document.getElementById('rain_total').textContent = weather['Rain Total (mm)'];
    document.getElementById('wind_gust').textContent = weather['Wind Gust(mph)'];
    document.getElementById('weather_description').textContent = weather['Weather Description'];
    document.getElementById('sunrise').textContent = weather['Sunrise'];
    document.getElementById('sunset').textContent = weather['Sunset'];
    document.getElementById('chance_of_rain').textContent = weather['Chance of Rain(%)'];

    // Handle Pollen
    const pollenValue = weather['Pollen'];
    const pollenImg = document.getElementById('pollen');
    switch (pollenValue) {
      case 'L':
        pollenImg.src = 'images/images_weather_tomorrow/icons/green_for_L.png';
        break;
      case 'M':
        pollenImg.src = 'images/images_weather_tomorrow/icons/yellow_for_M.png';
        break;
      case 'H':
        pollenImg.src = 'images/images_weather_tomorrow/icons/red_for_h.png';
        break;
      default:
        // Handle unknown value if needed
        pollenImg.src = ''; // Set to an empty image or default image URL
    }

    // Handle UV
    const uvValue = weather['UV'];
    const uvImg = document.getElementById('uv');
    switch (uvValue) {
      case 'L':
        uvImg.src = 'images/images_weather_tomorrow/icons/green_for_L.png';
        break;
      case 'M':
        uvImg.src = 'images/images_weather_tomorrow/icons/yellow_for_M.png';
        break;
      case 'H':
        uvImg.src = 'images/images_weather_tomorrow/icons/red_for_h.png';
        break;
      default:
        // Handle unknown value if needed
        uvImg.src = ''; // Set to an empty image or default image URL
    }

   // Handle special weather description with placeholder images
    const weatherDesc = weather['Weather Description'];
    const weatherImg = document.getElementById('weather_img');
    
    // Object mapping weather descriptions to placeholder image URLs
    const weatherImages = {
      'Sunny intervals and a gentle breeze': 'images/images_weather_tomorrow/weather_description/sun_cloud.png',
      'Sunny intervals and light winds': 'images/images_weather_tomorrow/weather_description/sun_cloud.png',
      'Light rain and a gentle breeze': 'images/images_weather_tomorrow/weather_description/light_rain.png',
      'Light rain and a moderate breeze': 'images/images_weather_tomorrow/weather_description/light_rain.png',
      'Light rain and light winds': 'images/images_weather_tomorrow/weather_description/light_rain.png',
      'Light rain showers and a moderate breeze': 'images/images_weather_tomorrow/weather_description/light_rain.png',
      'Light rain showers and a gentle breeze': 'images/images_weather_tomorrow/weather_description/light_rain.png',
      'Thundery showers and a gentle breeze': 'images/images_weather_tomorrow/weather_description/thunder.png',
      'Light cloud and a gentle breeze': 'images/images_weather_tomorrow/weather_description/clouds.png',
      'Light cloud and a moderate breeze': 'images/images_weather_tomorrow/weather_description/clouds.png',
      'Snow': 'images/images_weather_tomorrow/weather_description/snow.png',
      'Sunny and a gentle breeze': 'images/images_weather_tomorrow/weather_description/sun.png'
    };

    // Default image URL for weather conditions not found in weatherImages
    const defaultWeatherImg = 'https://i.imgur.com/default_weather.png';

    // Check if the weather description exists in the map
    if (weatherDesc in weatherImages) {
      weatherImg.src = weatherImages[weatherDesc]; // Set the corresponding image URL
    } else {
      weatherImg.src = defaultWeatherImg; // Set default image URL
    }

    // Handle Moon Phase
    const moonPhase = weather['Moon Phase'];
    const moonImg = document.getElementById('moon_phase_img');
    const moonText = document.getElementById('moon_phase_text'); // Text placeholder
    switch (moonPhase) {
  case 'First Quarter':
    moonImg.src = 'images/images_weather_tomorrow/moons/first-quarter-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Last Quarter':
    moonImg.src = 'images/images_weather_tomorrow/moons/last-quarter-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Waxing Gibbous':
    moonImg.src = 'images/images_weather_tomorrow/moons/waxing-gibbous-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Waning Gibbous':
    moonImg.src = 'images/images_weather_tomorrow/moons/waning-gibbous-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Full Moon':
    moonImg.src = 'images/images_weather_tomorrow/moons/full-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'New Moon':
    moonImg.src = 'images/images_weather_tomorrow/moons/new-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Waxing Crescent':
    moonImg.src = 'images/images_weather_tomorrow/moons/waxing-crescent-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  case 'Waning Crescent':
    moonImg.src = 'images/images_weather_tomorrow/moons/waning-crescent-moon-icon.png';
    moonText.textContent = moonPhase; // Display moon phase text
    break;
  default:
    // Handle unknown value if needed
    moonImg.src = ''; // Set to an empty image or default image URL
    moonText.textContent = moonPhase; // Display moon phase text or clear if no moon phase
}

  } else {
    noDataMsg.style.display = 'block';
  }
}

// Function to fetch CSV data, parse it, and display it on the webpage
async function fetchAndDisplayData() {
  try {
    const data = await fetchWeatherData();
    if (data !== null) {
      console.log('Fetched CSV Data:', data);
      displayWeatherData(data);
    } else {
      console.log('No data fetched or parsed');
    }
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
}

// Function to rotate the list items with fade-out and fade-in effects
function rotateListItems() {
  const list = document.getElementById('weather-list');
  const firstItem = list.firstElementChild;

  firstItem.classList.add('fade-out');
  setTimeout(() => {
    list.appendChild(firstItem);
    firstItem.classList.remove('fade-out');
    firstItem.classList.add('animate');
    setTimeout(() => {
      firstItem.classList.remove('animate');
    }, 1000); // Matches the transition duration
  }, 1000); // Matches the transition duration
}

// Initial fetch and display
fetchAndDisplayData();

// Fetch and display data every 10 seconds (example)
setInterval(fetchAndDisplayData, 10000); // 10 seconds interval

// Rotate list items every 10 seconds
setInterval(rotateListItems, 10000); // 10 seconds interval
