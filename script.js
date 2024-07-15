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
    document.getElementById('moon_phase').textContent = weather['Moon Phase'];
    document.getElementById('chance_of_rain').textContent = weather['Chance of Rain(%)'];

    // Handle Pollen
    const pollenValue = weather['Pollen'];
    if (pollenValue === 'L') {
      document.getElementById('pollen').src = 'https://i.imgur.com/2LQs8o4.png';
    } else if (pollenValue === 'M') {
      document.getElementById('pollen').src = 'https://i.imgur.com/8TtKLIi.png';
    } else if (pollenValue === 'H') {
      document.getElementById('pollen').src = 'https://i.imgur.com/RIPYD1d.png';
    } else {
      // Handle unknown value if needed
    }

    // Handle UV
    const uvValue = weather['UV'];
    if (uvValue === 'L') {
      document.getElementById('uv').src = 'https://i.imgur.com/2LQs8o4.png';
    } else if (uvValue === 'M') {
      document.getElementById('uv').src = 'https://i.imgur.com/8TtKLIi.png';
    } else if (uvValue === 'H') {
      document.getElementById('uv').src = 'https://i.imgur.com/RIPYD1d.png';
    } else {
      // Handle unknown value if needed
    }

    // Handle special weather description
    const weatherDesc = weather['Weather Description'];
    if (weatherDesc === 'Thundery showers and a gentle breeze') {
      document.getElementById('weather_img').src = 'https://i.imgur.com/hdhpIDG.png';
    } else {
      // Set default image or handle other cases
      document.getElementById('weather_img').src = ''; // Set to an empty image or default image URL
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
