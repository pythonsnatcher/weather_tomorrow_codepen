// Function to fetch weather data from your CSV or other source
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
  const weatherList = document.getElementById('weather-list');
  const noDataMsg = document.getElementById('no-data');

  // Clear existing data
  weatherList.innerHTML = '';
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
    document.getElementById('pressure').textContent = weather['Pressure(mb)'];
    document.getElementById('rain_total').textContent = weather['Rain Total (mm)'];
    document.getElementById('wind_gust').textContent = weather['Wind Gust(mph)'];
    document.getElementById('pollen').textContent = weather['Pollen'];
    document.getElementById('uv').textContent = weather['UV'];
    document.getElementById('sunrise').textContent = weather['Sunrise'];
    document.getElementById('sunset').textContent = weather['Sunset'];
    document.getElementById('weather_description').textContent = weather['Weather Description'];
    document.getElementById('moon_phase').textContent = weather['Moon Phase'];
    document.getElementById('chance_of_rain').textContent = weather['Chance of Rain(%)'];
  } else {
    noDataMsg.style.display = 'block';
  }
}

// Function to fetch CSV data and display it on the webpage
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

// Initial fetch and display
fetchAndDisplayData();

// Fetch and display data every 10 seconds (example)
setInterval(fetchAndDisplayData, 10000); // 10 seconds interval
