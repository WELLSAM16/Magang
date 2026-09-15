import pandas as pd
import json
import numpy as np
import datetime

# Convert NaN, inf and datetime to JSON serializable formats
def clean_data(obj):
    if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return None
    elif isinstance(obj, (datetime.date, datetime.datetime, pd.Timestamp)):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: clean_data(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_data(v) for v in obj]
    return obj

try:
    df = pd.read_excel(r'C:\Users\WELLSAM\Downloads\9. Skoring UP Medsos - September 2026.xlsx', sheet_name=None)
    output = {}
    for name, sheet in df.items():
        # Replace NaN with None before converting to dict
        sheet_cleaned = sheet.replace({np.nan: None})
        records = sheet_cleaned.head(50).to_dict(orient='records')
        output[name] = clean_data(records)

    with open(r'd:\Magang\monitoring-app\scratch\excel_data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
