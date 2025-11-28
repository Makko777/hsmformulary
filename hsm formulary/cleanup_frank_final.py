import json
import re

# Load the data
with open('src/frankShannData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Final cleanup pass on {len(data)} entries...")

fixes = 0

for entry in data:
    original_name = entry['name']
    original_dosage = entry['dosage']
    
    # Fix BOTH name and dosage
    name = entry['name']
    dosage = entry['dosage']
    
    # Apply all H-pattern fixes to BOTH fields
    for field_name, field_value in [('name', name), ('dosage', dosage)]:
        # Time interval fixes
        field_value = re.sub(r'\b121-1\b', '12H', field_value)
        field_value = re.sub(r'\b81-1\b', '8H', field_value)
        field_value = re.sub(r'\b61-1\b', '6H', field_value)
        field_value = re.sub(r'\b241-1\b', '24H', field_value)
        field_value = re.sub(r'\b(\d+)1-1\b', r'\1H', field_value)
        
        if field_name == 'name':
            name = field_value
        else:
            dosage = field_value
    
    # Update if changed
    if original_name != name or original_dosage != dosage:
        entry['name'] = name
        entry['dosage'] = dosage
        fixes += 1
        if original_name != name:
            print(f"Fixed NAME: '{original_name}' → '{name}'")

# Save
with open('src/frankShannData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"\n✓ Applied {fixes} final fixes")
print(f"✓ Saved to src/frankShannData.json")

# Verify
import subprocess
result = subprocess.run(['grep', '-c', '121-1', 'src/frankShannData.json'], 
                       capture_output=True, text=True, cwd='/Users/cda/Desktop/my Coding Project/hsm formulary')
count = result.stdout.strip()
print(f"\nVerification: {count} occurrences of '121-1' remaining in file")
