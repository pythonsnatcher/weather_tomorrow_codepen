// Function to fetch and parse CSV file
async function fetchCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    return parseCSV(data);
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    return null;
  }
}

// Function to parse CSV data
function parseCSV(data) {
  const rows = data.trim().split('\n').map(row => row.split(','));
  const headers = rows[0];
  const records = rows.slice(1).map(row => {
    let record = {};
    row.forEach((value, index) => {
      record[headers[index]] = value.trim(); // Trim whitespace from values
    });
    return record;
  });
  return records;
}

// Function to display data on the webpage
function displayData(data) {
  const weatherList = document.getElementById('weather-list');
  const noDataMsg = document.getElementById('no-data');

  // Clear existing data
  weatherList.innerHTML = '';
  noDataMsg.style.display = 'none';

  // Display weather data
  if (data && data.length > 0) {
    const weather = data[0]; // Assuming only one record is fetched

    // Iterate through each property and update corresponding HTML elements
    Object.keys(weather).forEach(key => {
      const element = document.getElementById(key.toLowerCase());
      if (element) {
        element.textContent = weather[key];
      }
    });
  } else {
    noDataMsg.style.display = 'block';
  }
}

// Function to fetch CSV data and display on the webpage every 10 seconds
async function fetchAndDisplayData() {
  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/1Kc82bLJaPwsLR55owMorJKZDjD-PFBOdsqS4lylfTs4/export?format=csv';
    const data = await fetchCSV(csvUrl);
    if (data) {
      console.log('Fetched CSV Data:', data);
      displayData(data);
    } else {
      console.log('No data fetched or parsed');
    }
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
}

// Initial fetch and display
fetchAndDisplayData();

// Fetch and display data every 10 seconds
setInterval(() => {
  fetchAndDisplayData();
}, 10000); // 10 seconds interval

// Debug prints for console
console.log('Script loaded:', new Date());
