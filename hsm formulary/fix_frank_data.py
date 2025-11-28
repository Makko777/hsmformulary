import json
import re

# Load the data
with open('src/frankShannData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Processing {len(data)} entries...")

# Comprehensive post-processing to fix specific remaining OCR issues
for idx, entry in enumerate(data):
    original_name = entry['name']
    original_dosage = entry['dosage']
    
    # ===== DRUG NAME FIXES =====
    name = entry['name']
    
    # Fix specific drug name OCR errors
    name = re.sub(r'5n\b', 'tin', name)  # "Alitre5noin" → "Alitretinoin"
    name = re.sub(r'5\b', 't', name) if 'Aloglip' in name else name  # "Aloglip5n" → "Alogliptin"
    name = re.sub(r'\b5\b', 't', name) if any(x in name for x in ['Aloglip', 'Ceft']) else name
    name = re.sub(r'Ace!ylcysteine', 'Acetylcysteine', name)
    name = re.sub(r'Acetylcysteinu', 'Acetylcysteine', name)
    name = re.sub(r'\s+\+\s+', ' + ', name)  # Normalize spacing around +
    name = re.sub(r'idovudine', 'zidovudine', name) if 'lamivudine' in name else name
    name = re.sub(r'\s+g\b', 'g', name)  # "300m g" → "300mg"
    name = re.sub(r'(\d+)m\s+g\b', r'\1mg', name)  # "300m g" → "300mg"

    
    # ===== DOSAGE FIXES =====
    dosage = entry['dosage']
    
    # Fix common number OCR errors
    dosage = re.sub(r'\b1\s*OO\s*(?=mg|mcg|ml)', '100', dosage)  # "1 OO" or "1OO" → "100"
    dosage = re.sub(r'\b1\s*O\s*(?=mg|mcg|ml)', '10', dosage)  # "1 O" → "10"
    dosage = re.sub(r'\b2\s*O\s*(?=mg|mcg|ml)', '20', dosage)  # "2 O" → "20"
    dosage = re.sub(r'\b5\s*O\s*(?=mg|mcg|ml)', '50', dosage)  # "5 O" → "50"
    dosage = re.sub(r'1\s*OOrng', '100mg', dosage)  # "1 OOrng" → "100mg"
    dosage = re.sub(r'1\s*Orng', '10mg', dosage)  # "1 Orng" → "10mg"
    dosage = re.sub(r'(\d+)\s*rng\b', r'\1mg', dosage)  # "100rng" → "100mg"
    dosage = re.sub(r'(\d+)\s*rnq\b', r'\1mg', dosage)  # "100rnq" → "100mg"
    
    # Fix spacing issues with units
    dosage = re.sub(r'(\d+)\s*m\s+g\b', r'\1mg', dosage)  # "300m g" → "300mg"
    dosage = re.sub(r'(\d+)m\s+g\b', r'\1mg', dosage)  # "300m g" → "300mg"
    dosage = re.sub(r'(\d+)\s*g\s*\.\s*', r'\1g. ', dosage)  # "300g ." → "300g. "
    dosage = re.sub(r'g\s*\.\s+', 'g. ', dosage)  # Normalize "g ." → "g. "
    
    # Fix frequency/interval errors
    dosage = re.sub(r'6-1H\b', '6-12H', dosage)  # "6-1H" → "6-12H"
    dosage = re.sub(r'(\d+)-1H\b', r'\1-12H', dosage)  # "8-1H" → "8-12H"
    dosage = re.sub(r'ti-1', '6-1', dosage)  # "ti-1" → "6-1"
    dosage = re.sub(r'12\.ti', '12.5', dosage)  # "12.ti" → "12.5"
    dosage = re.sub(r'/2S\b', '/2', dosage)  # "/2S" → "/2" (tablet half)
    dosage = re.sub(r'(\d+)H\s+oral', r'\1H oral', dosage)  # Normalize spacing
    dosage = re.sub(r'8H\s+oral', '8H oral', dosage)
    dosage = re.sub(r'12H\s+oral', '12H oral', dosage)
    
    # Fix common abbreviations and words
    dosage = re.sub(r'\bqv\b', '(qv)', dosage)  # Mark cross-references
    dosage = re.sub(r'\btub\b', 'tab', dosage)  # "tub" → "tab"
    dosage = re.sub(r'\bornl\b', 'oral', dosage, flags=re.IGNORECASE)
    dosage = re.sub(r'\boml\b', 'oral', dosage, flags=re.IGNORECASE)
    dosage = re.sub(r'\borul\b', 'oral', dosage, flags=re.IGNORECASE)
    dosage = re.sub(r'\btl1en\b', 'then', dosage)
    dosage = re.sub(r'\btl1on\b', 'then', dosage)
    dosage = re.sub(r'\brnax\b', 'max', dosage)
    dosage = re.sub(r'\brnin\b', 'min', dosage)
    dosage = re.sub(r'\brnane\b', 'mane', dosage)
    dosage = re.sub(r'\bnocle\b', 'nocte', dosage)
    
    # Fix "Adult, NOT/kg" patterns
    dosage = re.sub(r'Adult,\s*NOT/kg:', 'Adult, NOT/kg:', dosage)
    dosage = re.sub(r'NOT\s*/\s*kg', 'NOT/kg', dosage)
    
    # Fix decimal points
    dosage = re.sub(r'(\d+)\s*\.\s*(\d+)', r'\1.\2', dosage)  # "0 . 5" → "0.5"
    dosage = re.sub(r'(\d+)_(\d+)', r'\1.\2', dosage)  # "0_5" → "0.5"
    
    # Fix percentage and special characters
    dosage = re.sub(r'([)%])\s*\.(\s+[A-Z])', r'\1.\n\2', dosage)  # Separate sentences
    dosage = re.sub(r'umoi', 'umol', dosage)
    dosage = re.sub(r'umolll', 'umol/L', dosage)
    dosage = re.sub(r'urnol', 'umol', dosage)
    
    # Fix time patterns
    dosage = re.sub(r'\b(\d+)wl\u003c\b', r'\1wk', dosage)  # "4wl<" → "4wk"
    dosage = re.sub(r'\bwl\u003c\b', 'wk', dosage)
    dosage = re.sub(r'(\d+)\s*hr\b', r'\1H', dosage)  # Standardize to "H"
    dosage = re.sub(r'lH\b', 'H', dosage)  # "1H" trailing issues
    
    # Fix common word fragments
    dosage = re.sub(r'beforo\b', 'before', dosage)
    dosage = re.sub(r'paracetarnol', 'paracetamol', dosage, flags=re.IGNORECASE)
    dosage = re.sub(r'paracetarno1', 'paracetamol', dosage, flags=re.IGNORECASE)
    dosage = re.sub(r'angioplasly', 'angioplasty', dosage)
    dosage = re.sub(r'intratrac:l1eal', 'intratracheal', dosage)
    dosage = re.sub(r'narar,r,tclt\.', 'paracetamol', dosage)
    
    # Fix spacing and punctuation
    dosage = re.sub(r'\s+', ' ', dosage)  # Normalize whitespace
    dosage = re.sub(r'\s+\.', '.', dosage)  # Remove space before period
    dosage = re.sub(r'\.+', '.', dosage)  # Multiple periods → single period
    dosage = re.sub(r'\s+,', ',', dosage)  # Remove space before comma
    
    # Update entry if changed
    entry['name'] = name.strip()
    entry['dosage'] = dosage.strip()
    
    # Log significant changes
    if original_name != entry['name']:
        print(f"  Fixed name [{idx+1}]: {original_name} → {entry['name']}")
    if len(original_dosage) > 50 and original_dosage != entry['dosage']:
        # Only log dosage changes for entries with substantial dosage text
        changes = sum(1 for a, b in zip(original_dosage.split(), entry['dosage'].split()) if a != b)
        if changes > 2:
            print(f"  Fixed dosage [{idx+1}] {entry['name']}: {changes} word changes")

# Save the fixed data
with open('src/frankShannData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"\n✓ Post-processing fixes applied successfully to {len(data)} entries!")
print("✓ Fixed data saved to src/frankShannData.json")
