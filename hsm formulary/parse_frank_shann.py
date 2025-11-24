import re
import json

def clean_text(text):
    """Remove page markers and common artifacts, fix OCR errors"""
    # Page artifacts
    text = re.sub(r'=== PAGE \d+ ===', ' ', text)
    text = re.sub(r'\$9\.95 \+ postage from orders@drugdoses\.com Page \d+', ' ', text)
    text = re.sub(r'drugdoses\.com', ' ', text)
    
    # OCR Typos - Units (attached to numbers)
    text = re.sub(r'(?<=\d)rng', 'mg', text)
    text = re.sub(r'(?<=\d)rncg', 'mcg', text)
    text = re.sub(r'(?<=\d)rnin', 'min', text)
    text = re.sub(r'(?<=\d)l<g', 'kg', text)
    text = re.sub(r'(?<=\d)1<g', 'kg', text)
    text = re.sub(r'(?<=\d)1<\[', 'kg', text)
    text = re.sub(r'(?<=\d)m g', 'mg', text)
    
    # Standalone unit typos
    text = re.sub(r'\brng\b', 'mg', text)
    text = re.sub(r'\brncg\b', 'mcg', text)
    text = re.sub(r'\brnin\b', 'min', text)
    text = re.sub(r'\bl<g\b', 'kg', text)
    text = re.sub(r'\bI<g\b', 'kg', text)
    text = re.sub(r'\bk\(J\b', 'kg', text)
    text = re.sub(r'\brnl\b', 'ml', text)
    
    # Common word OCR errors
    text = re.sub(r'\bornl\b', 'oral', text)
    text = re.sub(r'\boml\b', 'oral', text)
    text = re.sub(r'\bOrnin\b', '0min', text)
    text = re.sub(r'\bbeforo\b', 'before', text)
    text = re.sub(r'\btl1on\b', 'then', text)
    text = re.sub(r'\btl1en\b', 'then', text)
    text = re.sub(r'\bparacetarno1\b', 'paracetamol', text)
    text = re.sub(r'\bparacetarnol\b', 'paracetamol', text)
    text = re.sub(r'\bangioplasly\b', 'angioplasty', text)
    text = re.sub(r'\bsoltn\b', 'solution', text)
    text = re.sub(r'\bintratrac:l1eal\b', 'intratracheal', text)
    text = re.sub(r'\bnarar\.r,tclt\b', 'paracetamol', text)
    text = re.sub(r'\bumoi\b', 'umol', text)
    text = re.sub(r'\bumolll\b', 'umol/L', text)
    text = re.sub(r'\burnoi\b', 'umol', text)
    text = re.sub(r'\bOOOurnoi\b', '000umol', text)
    
    # Specific number/letter confusions
    text = re.sub(r'\b1 OOrng\b', '100mg', text)
    text = re.sub(r'\b1 Orng\b', '10mg', text)
    text = re.sub(r'\b1 1\.0g\b', '1.0g', text)
    text = re.sub(r'\b0\. 1\b', '0.1', text)
    text = re.sub(r'\b0\. 2\b', '0.2', text)
    text = re.sub(r'\b0\. 5\b', '0.5', text)
    
    # Time intervals
    text = re.sub(r'\b8-24ft\b', '8-24H', text)
    text = re.sub(r'\b6-12JI\b', '6-12H', text)
    text = re.sub(r'\b4wl<\b', '4wk', text)
    text = re.sub(r'\bl2hr\b', '12hr', text)
    text = re.sub(r'\b4H\b', '4H', text)
    
    # Special characters and symbols
    text = re.sub(r'\\u00b7', '-', text)  # Middle dot to hyphen
    text = re.sub(r'~', '-', text)  # Tilde to hyphen
    text = re.sub(r'­', '', text)  # Soft hyphen removal
    
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
    
    # Fix "Abaca vir" -> "Abacavir" type errors (risky, be careful)
    # text = re.sub(r'([A-Z][a-z]+)\s([a-z]+)', r'\1\2', text) # Too risky
    
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_frank_shann(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    parsed_data = []
    current_entry = None
    
    # Common non-drug words that might start a sentence
    NON_DRUG_STARTS = {
        'Monitor', 'Note', 'Caution', 'Warning', 'See', 'Adult', 'Child', 'Infant', 'Neonatal', 'Preterm', 'Term', 
        'Give', 'Stop', 'Repeat', 'Max', 'Min', 'Total', 'Daily', 'Weekly', 'Monthly', 'If', 'Then', 'For', 'Use', 
        'Avoid', 'Adjust', 'Check', 'Measure', 'Keep', 'Protect', 'Dilute', 'Dissolve', 'Infuse', 'Inject', 'Take', 
        'Administer', 'Apply', 'In', 'On', 'At', 'To', 'By', 'With', 'Without', 'Or', 'And', 'But', 'However', 
        'Although', 'Because', 'Since', 'When', 'Where', 'Why', 'How', 'What', 'Who', 'Which', 'That', 'This', 
        'These', 'Those', 'It', 'They', 'We', 'You', 'He', 'She', 'The', 'A', 'An', 'My', 'Your', 'His', 'Her', 
        'Its', 'Our', 'Their', 'NB', 'IV', 'IM', 'SC', 'PO', 'PR', 'PV', 'SL', 'TOP', 'INH', 'NEB', 'Contents',
        'Drug', 'Doses', 'Infusion', 'Rates', 'Table', 'Haemofiltration', 'Cytochrome', 'Alveolar', 'Muscle',
        'Pacemaker', 'Intravenous', 'Haematology', 'Fluid', 'Dialysis', 'Ventilation', 'Immunisation', 'Antibiotic',
        'Normal', 'Values', 'Resuscitation', 'Pharmacokinetic', 'Prophylaxis', 'Treatment', 'Loading', 'Maintenance'
    }

    start_processing = False
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if "DRUGS ARE LISTED BY GENERIC NAME" in line:
            start_processing = True
            continue
            
        if not start_processing:
            continue

        if '=== PAGE' in line or '$9.95' in line or 'drugdoses.com' in line or line.isdigit():
            continue
            
        # OCR cleanup
        if line.startswith('1\\') or line.startswith('|'):
             line = 'A' + line[2:]
        
        # Check for new drug entry
        is_new_entry = False
        first_word = line.split(' ')[0].strip('.,:;()')
        
        # Heuristic 1: "Name." pattern
        if first_word and first_word[0].isupper() and first_word not in NON_DRUG_STARTS:
            if re.match(r'^[A-Z][a-zA-Z0-9\+\-\s\(\)]{2,60}?(\.|:)\s', line):
                is_new_entry = True
            elif '+' in line and len(line.split('+')[0]) < 50 and not line.startswith('Adult'):
                 is_new_entry = True
            elif len(line) < 60 and not any(c in line for c in ['=', '>', '<']) and line.endswith('.'):
                 is_new_entry = True

        if is_new_entry:
            # Handle split
            if '.' in line:
                parts = line.split('.', 1)
                name = parts[0].strip()
                dosage = parts[1].strip() if len(parts) > 1 else ""
                
                # Validation
                if len(name) > 80:
                    is_new_entry = False
            else:
                name = line
                dosage = ""
                
            if is_new_entry:
                current_entry = {
                    "id": f"fs-{str(len(parsed_data)+1).zfill(4)}",
                    "name": name,
                    "dosage": dosage
                }
                parsed_data.append(current_entry)
        
        if not is_new_entry:
            if current_entry:
                # Check for "hidden" drug entry in this line (merged by OCR)
                # Look for pattern: ". Name. "
                # e.g. "...eye. Acetylcysteine. Liver failure..."
                
                # We split by ". " and check if any part looks like a drug name
                # This is risky but necessary for merged lines
                
                # Only try this if the line contains a potential drug name pattern
                potential_split = re.search(r'\.\s+([A-Z][a-z]{3,20})\.\s', line)
                if potential_split:
                    possible_name = potential_split.group(1)
                    if possible_name not in NON_DRUG_STARTS:
                        # Found a split!
                        # Split the line
                        pre_split = line[:potential_split.start()+1]
                        post_split = line[potential_split.start()+1:].strip()
                        
                        # Add pre_split to current
                        if current_entry['dosage']:
                            current_entry['dosage'] += " " + pre_split
                        else:
                            current_entry['dosage'] = pre_split
                            
                        # Create new entry
                        parts = post_split.split('.', 1)
                        new_name = parts[0].strip()
                        new_dosage = parts[1].strip() if len(parts) > 1 else ""
                        
                        current_entry = {
                            "id": f"fs-{str(len(parsed_data)+1).zfill(4)}",
                            "name": new_name,
                            "dosage": new_dosage
                        }
                        parsed_data.append(current_entry)
                        continue # Done with this line

                if current_entry['dosage']:
                    current_entry['dosage'] += " " + line
                else:
                    current_entry['dosage'] = line
            else:
                pass

    # Post-processing
    final_data = []
    for entry in parsed_data:
        if len(entry['name']) < 2: continue
        if entry['name'] in NON_DRUG_STARTS: continue
        
        entry['dosage'] = clean_text(entry['dosage'])
        entry['name'] = clean_text(entry['name'])
        
        # Fix common drug name OCR errors
        name_fixes = {
            "Abaca vir": "Abacavir",
            "Abalacept": "Abatacept",
            "Ace!ylcysteinu": "Acetylcysteine",
            "Acetyl<:ysteine": "Acetylcysteine",
            "zidovudine": "zidovudine",  # Keep lowercase for now
            "idovudine": "zidovudine"
        }
        
        for wrong, correct in name_fixes.items():
            if wrong in entry['name']:
                entry['name'] = entry['name'].replace(wrong, correct)
        
        # Remove entries that are clearly fragments or junk
        if len(entry['name']) > 100:  # Too long to be a drug name
            continue
        if entry['name'].count('.') > 3:  # Too many periods
            continue
        if not any(c.isalpha() for c in entry['name']):  # No letters
            continue
            
        final_data.append(entry)
            
    with open('frank_shann_data.json', 'w') as f:
        json.dump(final_data, f, indent=4)
        
    print(f"Extracted {len(final_data)} entries.")

if __name__ == "__main__":
    parse_frank_shann('frank_shann_extracted.txt')
