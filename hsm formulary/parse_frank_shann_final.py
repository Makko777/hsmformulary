import re
import json

def clean_text(text):
    """Clean OCR errors from text"""
    # Fix common OCR errors
    replacements = {
        'rng': 'mg', 'rnq': 'mg', 'rn g': 'mg', 'm g': 'mg',
        'rncg': 'mcg', 'mc g': 'mcg',
        'l<g': 'kg', 'I<g': 'kg', 'k(J': 'kg', 'k[J': 'kg', 'kq': 'kg', '1<g': 'kg',
        'rnl': 'ml', 'rn l': 'ml', 'mll': 'ml',
        'rnin': 'min', 'Omin': '0min',
        'ornl': 'oral', 'oml': 'oral', 'orul': 'oral', 'omI': 'oral',
        'tl1en': 'then', 'tl1on': 'then',
        'beforo': 'before', 'beforc': 'before',
        'paracetarnol': 'paracetamol', 'paracetarno1': 'paracetamol',
        'soltn': 'solution',
        'umoi': 'umol', 'urnoi': 'umol', 'umolll': 'umol/L',
        'rnux': 'max', 'rnax': 'max',
        'tub': 'tab', 'tsb': 'tab', 'tau': 'tab',
        'repoat': 'repeat',
        'dnily': 'daily', 'dni!y': 'daily',
        'rnane': 'mane', 'nocle': 'nocte',
        'infsn': 'infusion', 'incr': 'increase', 'reqd': 'required',
        'Sec': 'See', 'Soo': 'See', 'Seu': 'See',
        'UlV': 'IV', 'IVl': 'IM', 'lVl': 'IM', 'IlV': 'IV',
        '8-24ft': '8-24H', '6-12JI': '6-12H', '8-l2H': '8-12H',
        '12-241-l': '12-24H', '12-241': '12-24H',
        'wl<': 'wk',
        '1 O': '10', '1O': '10', '2 O': '20', '2O': '20',
        '5 O': '50', '5O': '50', '/O': '20',
        '!': 't',
    }
    
    for wrong, correct in replacements.items():
        text = text.replace(wrong, correct)
    
    # Remove page markers
    text = re.sub(r'\$\d+\.\d+.*?drugdoses\.com', '', text)
    text = re.sub(r'\$9\.9[5ti].*?Page \d+', '', text)
    
    # Clean up spacing
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'(\d+)\s*\.(\d+)', r'\1.\2', text)  # Fix decimal points
    text = re.sub(r'(\d+)\s*%', r'\1%', text)  # Fix percentages
    
    return text.strip()

def parse_frank_shann(file_path):
    """Parse Frank Shann text file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find start of drug list
    start_marker = "DRUGS ARE LISTED BY GENERIC NAME"
    start_pos = content.find(start_marker)
    if start_pos == -1:
        print("ERROR: Could not find start marker")
        return []
    
    # Get drug content
    drug_text = content[start_pos + len(start_marker):]
    
    # Split into sentences/entries based on period followed by capital letter
    # This pattern finds drug entries like "DrugName. dosage info"
    entries = []
    current_name = ""
    current_dosage = ""
    
    lines = drug_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line or '===' in line or len(line) < 3:
            continue
        
        # Check if line starts with capital letter (potent new drug)
        if line[0].isupper() and '. ' in line:
            # Save previous entry
            if current_name:
                entries.append({
                    "id": f"fs-{len(entries)+1:04d}",
                    "name": clean_text(current_name),
                    "dosage": clean_text(current_dosage)
                })
            
            # Split at first period
            parts = line.split('. ', 1)
            current_name = parts[0]
            current_dosage = parts[1] if len(parts) > 1 else ""
        else:
            # Continue current entry
            if current_dosage:
                current_dosage += " " + line
            else:
                current_dosage = line
    
    # Add last entry
    if current_name:
        entries.append({
            "id": f"fs-{len(entries)+1:04d}",
            "name": clean_text(current_name),
            "dosage": clean_text(current_dosage)
        })
    
    # Filter out invalid entries
    valid_entries = []
    skip_words = {'Monitor', 'Note', 'See', 'Adult', 'Child', 'Blood', 'Bowel', 'Eye', 'Oral',
                  'Gel', 'Cream', 'Surgery', 'Urine', 'meg/min', 'herpes'}
    
    for entry in entries:
        name = entry['name']
        # Skip if name is too short or starts with skip word
        if len(name) < 3 or any(name.startswith(word) for word in skip_words):
            continue
        # Skip if name contains only numbers or is too long
        if name.isdigit() or len(name) > 100:
            continue
        valid_entries.append(entry)
    
    return valid_entries

if __name__ == "__main__":
    print("Parsing Frank Shann data...")
    data = parse_frank_shann('frank_shann_extracted.txt')
    
    # Save
    output_file = 'src/frankShannData.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✓ Extracted {len(data)} drug entries")
    print(f"✓ Saved to {output_file}")
    
    # Show samples
    print("\nFirst 5 entries:")
    for i in range(min(5, len(data))):
        print(f"\n{i+1}. {data[i]['name']}")
        dosage = data[i]['dosage'][:120] + "..." if len(data[i]['dosage']) > 120 else data[i]['dosage']
        print(f"   {dosage}")
