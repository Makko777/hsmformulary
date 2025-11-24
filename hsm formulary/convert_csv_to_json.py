import csv
import json
import re
import os

def parse_csv_to_json(csv_path, json_output_path):
    print(f"Reading CSV from {csv_path}...")
    
    with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
        # Read all lines first to handle multi-line cells if possible, 
        # but standard csv module handles quoted multi-line fields well.
        reader = csv.reader(f)
        rows = list(reader)

    # Find header row
    header_idx = -1
    col_map = {'atc': 0, 'name': 1, 'ind': 2, 'dose': 3, 'cat': 4, 'dept': 5, 'notes': 6, 'brand': 7, 'price': 8}
    
    for i, row in enumerate(rows[:20]):
        row_str = " ".join(row).upper()
        if "ATC" in row_str and ("GENERIK" in row_str or "GENERIC" in row_str or "NAME" in row_str):
            header_idx = i
            print(f"Found header at line {i+1}")
            
            # Dynamic column mapping
            r = [c.upper() for c in row]
            
            def find_idx(keywords):
                for k in keywords:
                    for idx, cell in enumerate(r):
                        if k in cell:
                            return idx
                return -1

            atc = find_idx(["ATC"])
            name = find_idx(["GENERIK", "GENERIC", "NAME", "UBAT"])
            ind = find_idx(["INDIKASI", "INDICATION"])
            dose = find_idx(["DOS", "DOSE"])
            brand = find_idx(["BRAND"])
            price = find_idx(["PRICE", "HARGA", "RM"])
            cat = find_idx(["KATEGORI", "CAT", "PRESCRIBER"])
            notes = find_idx(["CATATAN", "NOTE", "REMARK"])
            dept = find_idx(["JABATAN", "DEPT"])

            if atc > -1: col_map['atc'] = atc
            if name > -1: col_map['name'] = name
            if ind > -1: col_map['ind'] = ind
            if dose > -1: col_map['dose'] = dose
            if brand > -1: col_map['brand'] = brand
            if price > -1: col_map['price'] = price
            if cat > -1: col_map['cat'] = cat
            if notes > -1: col_map['notes'] = notes
            if dept > -1: col_map['dept'] = dept
            
            break

    if header_idx == -1:
        print("Could not find header row. Using default mapping.")
        header_idx = 4 # Based on file view

    start_row = header_idx + 1
    current_section = "Others"
    drugs = []

    for i in range(start_row, len(rows)):
        row = rows[i]
        if not row: continue
        
        # Check for section header (e.g., "1.0 ALIMENTARY SYSTEM")
        first_cell = row[0].strip() if row else ""
        
        # If first cell has digits and looks like a section header
        if first_cell and re.match(r'^\d+\.\d+', first_cell):
            current_section = first_cell.replace('"', '').strip()
            # If the section header spans multiple lines or cells, try to clean it
            if len(row) > 1 and row[1]:
                 current_section += " " + row[1]
            continue
            
        # Skip if name column is empty
        if len(row) <= col_map['name'] or not row[col_map['name']].strip():
            continue
            
        raw_name = row[col_map['name']].strip()
        if "NAMA GENERIK" in raw_name.upper(): continue
        
        # Extract data
        brand_val = row[col_map['brand']].strip() if len(row) > col_map['brand'] else "Generic"
        if not brand_val: brand_val = "Generic"
        
        price_val = row[col_map['price']].strip() if len(row) > col_map['price'] else "N/A"
        price_val = price_val.replace('\n', ' ').strip()
        
        notes_val = row[col_map['notes']].strip() if len(row) > col_map['notes'] else ""
        dept_val = row[col_map['dept']].strip() if len(row) > col_map['dept'] else ""
        
        full_notes = notes_val
        if dept_val:
            full_notes += f" (Dept: {dept_val})"
            
        drug = {
            "id": f"drug-{i}",
            "genericName": raw_name,
            "brandName": brand_val,
            "category": current_section,
            "forms": [raw_name.split(" ")[-1]] if " " in raw_name else ["Unit"], # Simple heuristic
            "indications": row[col_map['ind']].strip() if len(row) > col_map['ind'] else "See detailed info",
            "dosing": row[col_map['dose']].strip() if len(row) > col_map['dose'] else "See detailed info",
            "renalDose": "Check guidelines",
            "pregnancy": "Not specified",
            "highAlert": False, # Could infer from notes if needed
            "notes": full_notes.strip(),
            "price": price_val,
            "prescriberCat": row[col_map['cat']].strip() if len(row) > col_map['cat'] else "N/A"
        }
        
        drugs.append(drug)

    print(f"Extracted {len(drugs)} drugs.")
    
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, indent=4, ensure_ascii=False)
    print(f"Saved to {json_output_path}")

if __name__ == "__main__":
    parse_csv_to_json('public/formulary.csv', 'src/formularyData.json')
