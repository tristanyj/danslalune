import ephem
import pandas as pd
import json
from datetime import datetime, timedelta

data = pd.read_csv('data.csv', sep=';', parse_dates=['date'], dayfirst=True)
data.fillna(0, inplace=True)

print(data)
print(data.head())

observer = ephem.Observer()
observer.lat, observer.lon = '44.3500', '2.0333'

moon_phases = {}
start_date = datetime(2023, 1, 1)
end_date = datetime(2023, 12, 31)
current_date = start_date

while current_date <= end_date:
    observer.date = current_date
    moon = ephem.Moon(observer)
    moon.compute(observer)
    moon_phases[current_date] = moon.phase
    current_date += timedelta(days=1)

    merged_data = []

for _, row in data.iterrows():
    date = row['date']
    moon_phase = moon_phases.get(date, None)
    entry = {
        "date": date.strftime('%Y-%m-%d'),
        "moon": moon_phase,
        "velage": row['velage'],
        "matrice": row['matrice'],
        "veau_perf": row['veau_perf'],
        "agnelage": row['agnelage']
    }
    merged_data.append(entry)

output_json = {"days": merged_data}

with open('dataset.json', 'w') as f:
    json.dump(output_json, f, indent=4)

print("JSON data successfully written to 'dataset.json'")
