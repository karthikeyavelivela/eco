import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_dummy_data():
    np.random.seed(42)
    locations = ["Paris", "Tokyo", "New York", "London", "Sydney"]
    seasons = ["Winter", "Spring", "Summer", "Autumn"]
    events = ["None", "Festival", "Conference", "Holiday"]
    
    data = []
    start_date = datetime(2023, 1, 1)
    for _ in range(1000):
        date = start_date + timedelta(days=np.random.randint(0, 365))
        loc = np.random.choice(locations)
        season = np.random.choice(seasons)
        event = np.random.choice(events)
        weather_temp = np.random.normal(20, 10) # avg 20C
        
        # Base tourists
        tourists = np.random.normal(5000, 1000)
        if season == "Summer": tourists += 2000
        if event != "None": tourists += 3000
        
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "location": loc,
            "tourist_count": max(100, int(tourists)),
            "weather_temp": weather_temp,
            "event": event,
            "season": season
        })
        
    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    df.to_csv(os.path.join(os.path.dirname(__file__), "dataset.csv"), index=False)
    print("Dummy data generated at dataset.csv")

if __name__ == "__main__":
    generate_dummy_data()
