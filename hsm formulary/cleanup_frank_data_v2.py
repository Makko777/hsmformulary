import json
import re

# Load the data
with open('src/frankShannData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Processing {len(data)} entries for additional OCR fixes...")

fixes_applied = 0

# Apply aggressive cleanup to all entries
for entry in data:
    original_name = entry['name']
    original_dosage = entry['dosage']
    
    # DRUG NAME FIXES
    name = entry['name']
    
    # Fix remaining spacing/OCR errors
    name = re.sub(r'\s+', ' ', name)  # Multiple spaces
    name = re.sub(r'\.+$', '', name)  # Trailing periods
    name = re.sub(r'^\s*\.+\s*', '', name)  # Leading periods
    name = name.strip()
    
    # DOSAGE FIXES - More aggressive patterns
    dosage = entry['dosage']
    
    # Fix H patterns (time intervals) - COMPREHENSIVE
    dosage = re.sub(r'\b121-1\b', '12H', dosage)  # "121-1" → "12H"
    dosage = re.sub(r'\b81-1\b', '8H', dosage)    # "81-1" → "8H"  
    dosage = re.sub(r'\b61-1\b', '6H', dosage)    # "61-1" → "6H"
    dosage = re.sub(r'\b241-1\b', '24H', dosage)  # "241-1" → "24H"
    dosage = re.sub(r'\b(\d+)1-1\b', r'\1H', dosage)  # Generic "X1-1" → "XH"
    
    # Fix other H patterns
    dosage = re.sub(r'\bBH\b', '8H', dosage)  # "BH" → "8H"
    dosage = re.sub(r'\b811\b', '8H', dosage)  # "811" → "8H"
    dosage = re.sub(r'\b12hr\b', '12H', dosage)  # "12hr" → "12H"
    dosage = re.sub(r'\b24hr\b', '24H', dosage)  # "24hr" → "24H"
    dosage = re.sub(r'\b(\d+)ft\b', r'\1H', dosage)  # "Xft" → "XH"
    dosage = re.sub(r'\b(\d+)JI\b', r'\1H', dosage)  # "XJI" → "XH"
    
    # Fix "See" patterns
    dosage = re.sub(r'\bsy\b', 'See', dosage, flags=re.IGNORECASE)  # "sy" → "See"
    dosage = re.sub(r'\bSy\b', 'See', dosage)  # "Sy" → "See"
    dosage = re.sub(r'\bsee\b', 'See', dosage)  # "see" → "See"
    
    # Fix number + unit spacing
    dosage = re.sub(r'(\d+)\s*rng\b', r'\1mg', dosage)
    dosage = re.sub(r'(\d+)\s*rnl\b', r'\1ml', dosage)
    dosage = re.sub(r'(\d+)\s*kfJ\b', r'\1kg', dosage)
    dosage = re.sub(r'(\d+)\s*l<g\b', r'\1kg', dosage)
    
    # Fix common OCR character confusions
    dosage = re.sub(r'\b1 0\b', '10', dosage)  # "1 0" → "10"
    dosage = re.sub(r'\b2 0\b', '20', dosage)  # "2 0" → "20"
    dosage = re.sub(r'\b5 0\b', '50', dosage)  # "5 0" → "50"
    dosage = re.sub(r'\b1OO\b', '100', dosage)  # "1OO" → "100"
    dosage = re.sub(r'\b10O\b', '100', dosage)  # "10O" → "100"
    dosage = re.sub(r'\b1 OO\b', '100', dosage)  # "1 OO" → "100"
    
    # Fix decimal patterns
    dosage = re.sub(r'(\d+)\s+\.\s*(\d+)', r'\1.\2', dosage)  # "1 . 5" → "1.5"
    dosage = re.sub(r'\.\.+', '.', dosage)  # Multiple periods
    dosage = re.sub(r'(\d+)\.(\d+)\.(\d+)', r'\1.\2-\3', dosage)  # "0.5.1" → "0.5-1"
    
    # Fix "Adult, NOT/kg" spacing
    dosage = re.sub(r'Adult,\s*NOT\s*/\s*kg', 'Adult, NOT/kg', dosage)
    
    # Fix percentage/concentration patterns
    dosage = re.sub(r'·(\d+)', r'-\1', dosage)  # "·5" → "-5"
    dosage = re.sub(r'(\d+)~(\d+)', r'\1-\2', dosage)  # "4~8" → "4-8"
    
    # Fix remaining word errors
    dosage = re.sub(r'\boraL\b', 'oral', dosage)
    dosage = re.sub(r'\boral\s*\.', 'oral.', dosage)
    dosage = re.sub(r'\bmrJ\b', 'mg', dosage)
    dosage = re.sub(r'\brn2\b', 'm2', dosage)
    dosage = re.sub(r'\brnl\b', 'ml', dosage)
    dosage = re.sub(r'\brncg\b', 'mcg', dosage)
    dosage = re.sub(r'\b1hr\b', '1H', dosage)
    dosage = re.sub(r'\b2hr\b', '2H', dosage)
    
    # Fix spacing around periods
    dosage = re.sub(r'\.\s+([a-z])', r'. \1', dosage)  # Ensure single space after period
    dosage = re.sub(r'\s+\.', '.', dosage)  # Remove space before period
    
    # Normalize whitespace
    dosage = re.sub(r'\s+', ' ', dosage)
    dosage = dosage.strip()
    
    # Update entry
    entry['name'] = name
    entry['dosage'] = dosage
    
    # Track changes
    if original_name != entry['name'] or original_dosage != entry['dosage']:
        fixes_applied += 1

# Save the cleaned data
with open('src/frankShannData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"✓ Applied fixes to {fixes_applied} entries")
print(f"✓ Cleaned data saved to src/frankShannData.json")

# Show lactulose entry if it exists
print("\nSearching for lactulose entry:")
for entry in data:
    if 'lactulose' in entry['name'].lower():
        print(f"\nID: {entry['id']}")
        print(f"Name: {entry['name']}")
        print(f"Dosage: {entry['dosage'][:200]}")
        break

# Show samples with "12H" pattern
print("\nSample entries with 12H pattern:")
count = 0
for entry in data:
    if '12H' in entry['dosage'] and count < 3:
        print(f"\n{entry['name'][:50]}: {entry['dosage'][:100]}...")
        count += 1
