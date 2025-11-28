import json
import re

# Load the data
with open('src/frankShannData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Processing {len(data)} entries...")

fixes_applied = 0

# Apply final cleanup to all entries
for entry in data:
    original_name = entry['name']
    original_dosage = entry['dosage']
    
    # DRUG NAME FIXES
    name = entry['name']
    
    # Fix specific patterns
    name = re.sub(r'z\.idovudine', 'zidovudine', name)
    name = re.sub(r'Abaca vir', 'Abacavir', name)
    name = re.sub(r'Abalacept', 'Abatacept', name)
    name = re.sub(r'Acernetacin', 'Acemetacin', name)
    name = re.sub(r'Acetylcysteinu', 'Acetylcysteine', name)
    name = re.sub(r'Acetyl<:ysteine', 'Acetylcysteine', name)
    name = re.sub(r'\s+\.', '.', name)  # Remove space before period
    name = re.sub(r'\.\s+$', '', name)  # Remove trailing period + space
    name = re.sub(r'\s+$', '', name)  # Remove trailing space
    
    # DOSAGE FIXES
    dosage = entry['dosage']
    
    # Fix number patterns
    dosage = re.sub(r'10Omg', '100mg', dosage)
    dosage = re.sub(r'z\.idovudine', 'zidovudine', dosage)
    dosage = re.sub(r'rntJ', 'mg', dosage)
    dosage = re.sub(r'1\\\\biraterone', 'Abiraterone', dosage)
    
    # Fix remaining OCR errors
    dosage = re.sub(r'narar\.r,tclt', 'paracetamol', dosage)
    dosage = re.sub(r'intratrac:l1eal', 'intratracheal', dosage)
    dosage = re.sub(r'angioplasly', 'angioplasty', dosage)
    dosage = re.sub(r'SH\\.', '8H.', dosage)
    dosage = re.sub(r'oraL', 'oral', dosage)
    dosage = re.sub(r' \\.\\. ', ' ', dosage)  # Remove orphan periods
    dosage = re.sub(r'\\\\', '', dosage)  # Remove backslashes
    
    # Clean up multiple spaces and periods
    dosage = re.sub(r'\s+', ' ', dosage)
    dosage = re.sub(r'\.\.+', '.', dosage)
    dosage = re.sub(r'\s+\.', '.', dosage)
    dosage = re.sub(r'\.\s+\.', '.', dosage)
    
    # Update entry
    entry['name'] = name.strip()
    entry['dosage'] = dosage.strip()
    
    # Track if changed
    if original_name != entry['name'] or original_dosage != entry['dosage']:
        fixes_applied += 1

# Save the cleaned data
with open('src/frankShannData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"✓ Applied fixes to {fixes_applied} entries")
print(f"✓ Cleaned data saved to src/frankShannData.json")

# Show some samples
print("\nSample cleaned entries:")
for i in [0, 5, 10, 20, 50]:
    if i < len(data):
        print(f"\n{i+1}. {data[i]['name']}")
        dosage = data[i]['dosage'][:120] + "..." if len(data[i]['dosage']) > 120 else data[i]['dosage']
        print(f"   {dosage}")
