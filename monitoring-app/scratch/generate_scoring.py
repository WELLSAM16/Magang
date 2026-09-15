import pandas as pd
import json
import math

try:
    df = pd.read_excel(r'C:\Users\WELLSAM\Downloads\9. Skoring UP Medsos - September 2026.xlsx', sheet_name=None)
    temp_sheet = df['TEMP']

    rules = []
    # Relevant rows for scoring are where 'Unnamed: 6' is a string containing '-' and 'Unnamed: 7' is a number
    for index, row in temp_sheet.iterrows():
        col6 = str(row.get('Unnamed: 6', ''))
        col7 = row.get('Unnamed: 7')
        if pd.notna(col7) and ' - View/Like ≥' in col6:
            parts = col6.split(' - View/Like ≥')
            platform = parts[0].strip()
            min_likes = int(parts[1].replace('.', ''))
            score = int(col7)
            rules.append({
                'platform': platform,
                'min_likes': min_likes,
                'score': score
            })
            
    # sort rules by min_likes descending so we can easily find the highest matching tier
    rules.sort(key=lambda x: x['min_likes'], reverse=True)

    keyword_sheet = df['KEYWORD']
    keywords = []
    ignore_list = ['KEYWORD KATEGORI ISU AGSET', 'Periode', 'Kategori', 'Grand Theme', 'Additional Issue', 'Operational Issue']
    for index, row in keyword_sheet.iterrows():
        for col in keyword_sheet.columns:
            val = str(row[col]).strip()
            if val and val != 'nan' and val != 'None' and val not in ignore_list:
                # remove newlines within the keyword
                val = val.replace('\n', ' ')
                # remove multiple spaces
                val = ' '.join(val.split())
                if len(val) > 2:
                    keywords.append(val)

    # unique keywords
    keywords = sorted(list(set(keywords)))

    output = {
        'rules': rules,
        'keywords': keywords
    }
    
    with open(r'd:\Magang\monitoring-app\scratch\scoring_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(rules)} rules and {len(keywords)} keywords.")
except Exception as e:
    print(f"Error: {e}")
