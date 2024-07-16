"""
the json credentials file needs to be locally accessible for this script to function
"""

import requests
from lxml import html
import csv
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os

from gspread.exceptions import APIError

def weather_com_(url, xpath_expression):
    try:
        response = requests.get(url)
        response.encoding = 'utf-8'
        tree = html.fromstring(response.content)
        chance_of_rain = tree.xpath(xpath_expression)

        if chance_of_rain:
            chance_of_rain_text = chance_of_rain[0].text_content().strip()
            chance_of_rain_value = chance_of_rain_text.replace('%', '')
            return chance_of_rain_value
        else:
            return "Chance of rain not found on the webpage."

    except Exception as e:
        print(f"Error fetching chance of rain from {url}: {e}")
        return None

def the_weather_outlook(url):
    try:
        xpath_date = '//*[@id="2"]/td[1]/div/text()'
        xpath_high_temp = '//*[@id="2"]/td[3]/span/text()'
        xpath_wind_speed = '//*[@id="2"]/td[4]/span/text()'
        xpath_humidity = '//*[@id="2"]/td[7]/text()'
        xpath_pressure = '//*[@id="2"]/td[8]/text()'
        xpath_rain_total = '//*[@id="rt2"]/text()'
        xpath_wind_gust = '//*[@id="2"]/td[6]/span/text()'

        response = requests.get(url)
        response.encoding = 'utf-8'
        tree = html.fromstring(response.content)

        date = tree.xpath(xpath_date)[0].strip()
        high_temp_text = tree.xpath(xpath_high_temp)[0].strip()
        wind_speed_text = tree.xpath(xpath_wind_speed)[0].strip()
        humidity_text = tree.xpath(xpath_humidity)[0].strip()
        pressure_text = tree.xpath(xpath_pressure)[0].strip()
        rain_total_text = tree.xpath(xpath_rain_total)[0].strip()

        high_temp = extract_numeric_value(high_temp_text)
        wind_speed = extract_numeric_value(wind_speed_text)
        humidity = extract_numeric_value(humidity_text.rstrip('%'))
        pressure = extract_numeric_value(pressure_text)
        rain_total = extract_numeric_value(rain_total_text.rstrip('mm'))

        wind_gust_text = tree.xpath(xpath_wind_gust)[0].strip()
        wind_gust = extract_numeric_value(wind_gust_text)

        weather_data = {
            'Location': 'London',
            'Date': date,
            'High Temperature(C)': high_temp,
            'Wind Speed(mph)': wind_speed,
            'Humidity(%)': humidity,
            'Pressure(mb)': pressure,
            'Rain Total (mm)': rain_total,
            'Wind Gust(mph)': wind_gust
        }

        return weather_data

    except Exception as e:
        print(f"Error fetching weather data from The Weather Outlook: {e}")
        return None

def extract_numeric_value(text):
    try:
        numeric_text = ''.join(filter(lambda x: x.isdigit() or x == '.', text))
        numeric_value = float(numeric_text) if '.' in numeric_text else int(numeric_text)
        return numeric_value
    except ValueError:
        return text

def get_bbc_weather_data(url):
    try:
        xpath_tomorrow_pollen = '//*[@id="wr-forecast"]/div[4]/div/div[1]/div[4]/div/div[2]/div[2]/span[1]/span[1]/span[2]/text()'
        xpath_tomorrow_uv = '//*[@id="wr-forecast"]/div[4]/div/div[1]/div[4]/div/div[2]/div[2]/span[2]/span[1]/span[2]/text()'
        xpath_sunrise = '//*[@id="wr-forecast"]/div[4]/div/div[1]/div[4]/div/div[2]/div[1]/span[1]/span[2]/text()'
        xpath_sunset = '//*[@id="wr-forecast"]/div[4]/div/div[1]/div[4]/div/div[2]/div[1]/span[2]/span[2]/text()'
        xpath_weather_description = '//*[@id="daylink-1"]/div[4]/div[2]/div/text()'
        xpath_low_temperature = '//*[@id="daylink-1"]/div[4]/div[1]/div/div[4]/div/div[2]/span[2]/span/span[1]/text()'

        response = requests.get(url)
        response.encoding = 'utf-8'
        tree = html.fromstring(response.content)

        tomorrow_pollen = tree.xpath(xpath_tomorrow_pollen)[0].strip()
        tomorrow_uv = tree.xpath(xpath_tomorrow_uv)[0].strip()
        sunrise_time = tree.xpath(xpath_sunrise)[0].strip()
        sunset_time = tree.xpath(xpath_sunset)[0].strip()
        weather_description = tree.xpath(xpath_weather_description)[0].strip()
        low_temperature = tree.xpath(xpath_low_temperature)[0].strip()

        # Clean up low_temperature to remove non-numeric characters (e.g., '°')
        low_temperature = ''.join(filter(lambda x: x.isdigit() or x == '.', low_temperature))


        bbc_weather_data = {
            'Pollen': tomorrow_pollen,
            'UV': tomorrow_uv,
            'Sunrise': sunrise_time,
            'Sunset': sunset_time,
            'Weather Description': weather_description,
            'Low Temperature(C)': low_temperature
        }

        return bbc_weather_data

    except Exception as e:
        print(f"Error fetching weather data from BBC Weather: {e}")
        return None



def fetch_moon_data(url):
    try:
        xpath_moon_phase = '//*[@id="upcomingmoonphases"]/div/div/div[1]/div[3]/text()'

        response = requests.get(url)
        response.encoding = 'utf-8'
        tree = html.fromstring(response.content)

        moon_phase = tree.xpath(xpath_moon_phase)
        if moon_phase:
            moon_phase_text = moon_phase[0].strip()
            return moon_phase_text
        else:
            return "Moon phase not found on the webpage."

    except Exception as e:
        print(f"Error fetching moon data: {e}")
        return None

def get_combined_weather_data(url_weather_outlook, url_bbc_weather, url_weather_com):
    combined_weather_data = {}

    weather_outlook_data = the_weather_outlook(url_weather_outlook)
    if weather_outlook_data:
        combined_weather_data.update(weather_outlook_data)

    bbc_weather_data = get_bbc_weather_data(url_bbc_weather)
    if bbc_weather_data:
        combined_weather_data.update(bbc_weather_data)



    url_moon_phase = "https://timesprayer.com/en/moon/united-kingdom-gb/london/#upcomingmoonphases"
    moon_phase_data = fetch_moon_data(url_moon_phase)
    if moon_phase_data:
        combined_weather_data['Moon Phase'] = moon_phase_data
    else:
        combined_weather_data['Moon Phase'] = "Moon phase data not available."

    xpath_weather_com = '/html/body/div[1]/main/div[2]/main/div[1]/section/div[2]/div[2]/details[2]/summary/div/div/div[3]/span'
    chance_of_rain = weather_com_(url_weather_com, xpath_weather_com)
    combined_weather_data['Chance of Rain(%)'] = chance_of_rain

    return combined_weather_data


def write_to_google_sheets(data, sheet_name, sheet_url):
    try:
        # Authorize without credentials assuming public access
        client = gspread.authorize(None)

        # Open the Google Sheets document by URL
        sheet = client.open_by_url(sheet_url)

        # Select the worksheet by name
        worksheet = sheet.worksheet(sheet_name)

        # Clear existing content (if desired)
        worksheet.clear()

        # Prepare data to write
        headers = list(data.keys())
        values = list(data.values())

        # Append headers as the first row
        worksheet.append_row(headers)

        # Append data values as subsequent rows
        worksheet.append_row(values)

        print(f"Data successfully written to '{sheet_name}' in '{sheet_url}'")

    except APIError as e:
        print(f"Error writing to Google Sheets: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

url_weather_outlook = "https://www.theweatheroutlook.com/forecast/uk/london"
url_bbc_weather = "https://www.bbc.co.uk/weather/2643743"
url_weather_com = "https://weather.com/en-GB/weather/tenday/l/4c5ad40da52894d049451564c63c55bb65acbafdca5e334eba01d5aaec4983fc"

combined_weather_data = get_combined_weather_data(url_weather_outlook, url_bbc_weather, url_weather_com)

sheet_url = os.getenv('GOOGLE_SHEETS_URL')
sheet_name = 'Sheet1'


if combined_weather_data:
    print("Combined Weather Data:")
    fieldnames = [
        'Date', 'Location', 'Weather Description', 'High Temperature(C)', 'Low Temperature(C)',
        'Wind Speed(mph)', 'Wind Gust(mph)', 'Chance of Rain(%)', 'Rain Total (mm)',
        'Humidity(%)', 'Pressure(mb)', 'Pollen', 'UV', 'Sunrise', 'Sunset', 'Moon Phase',
    ]
    for field in fieldnames:
        print(f"{field}: {combined_weather_data[field]}")

    # csv_file_path = "weather_tomorrow.csv"
    # with open(csv_file_path, mode='w', newline='') as file:
    #     writer = csv.DictWriter(file, fieldnames=fieldnames)
    #     writer.writeheader()
    #     writer.writerow(combined_weather_data)

    # print(f"\nWeather data has been written to {csv_file_path}")

    write_to_google_sheets(combined_weather_data, sheet_name, sheet_url)
    print("Weather data has been written to Google Sheets")
else:
    print("No weather data available.")
