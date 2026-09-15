import pandas as pd
import json

df = pd.read_excel(r'C:\Users\WELLSAM\Downloads\9. Skoring UP Medsos - September 2026.xlsx', sheet_name=None)
keyword_sheet = df['KEYWORD']

categories = {'Grand Theme': [], 'Operational Issue': [], 'Additional Issue': []}
current_category = None

for index, row in keyword_sheet.iterrows():
    # check if any column contains a category header
    row_vals = [str(x).strip() for x in row.values if pd.notna(x)]
    
    found_header = False
    for val in row_vals:
        if val in categories.keys():
            current_category = val
            found_header = True
            break
            
    if found_header:
        # keywords might also be on the same row, but usually below
        for val in row_vals:
            if val != current_category and len(val) > 2 and val not in ['KEYWORD KATEGORI ISU AGSET', 'Periode', 'Kategori']:
                categories[current_category].append(val)
        continue
        
    if current_category:
        for val in row_vals:
            if len(val) > 2 and val not in ['KEYWORD KATEGORI ISU AGSET', 'Periode', 'Kategori']:
                # handle newlines
                for v in val.split('\n'):
                    v = v.strip()
                    if len(v) > 2:
                        categories[current_category].append(v)

# cleanup
for k in categories:
    categories[k] = sorted(list(set(categories[k])))

print(json.dumps({k: len(v) for k, v in categories.items()}, indent=2))
with open(r'd:\Magang\monitoring-app\scratch\categories.json', 'w') as f:
    json.dump(categories, f, indent=2)
