import re
import json
import unicodedata

def normalize_unicode(text):
    """Convert Unicode characters to ASCII where possible"""
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    return text

def clean_text(text):
    """Comprehensive text cleaning with aggressive OCR error correction"""
    # First, normalize Unicode
    text = normalize_unicode(text)
    
    # Remove page artifacts and headers/footers
    text = re.sub(r'=== PAGE \d+ ===', ' ', text)
    text = re.sub(r'\$\d+\.\d+ \+ postage from orders@drugdoses\.com Page \d+', ' ', text)
    text = re.sub(r'drugdoses\.com', ' ', text)
    text = re.sub(r'Page \d+', ' ', text)
    text = re.sub(r'\$9\.95.*?postage.*?drugdoses\.com', '', text, flags=re.IGNORECASE)
    
    # Fix exclamation marks (common OCR error for 't')
    # Protect patterns like "!i" which might be "5i" 
    text = re.sub(r'!', 't', text)
    
    # Fix common character substitutions - NUMBERS
    text = re.sub(r'\bO(?=mg|mcg|ml|kg|H\b)', '0', text)  # Capital O -> 0
    text = re.sub(r'(?<=\d)\s*O\s*(?=mg|mcg|ml|kg)', '0', text)  # "1 O" -> "10"
    text = re.sub(r'\b1\s*O\s*O\b', '100', text)  # "1 O O" -> "100"
    text = re.sub(r'\b1\s*O\b', '10', text)  # "1 O" -> "10"
    text = re.sub(r'\b2\s*O\b', '20', text)  # "2 O" -> "20"
    text = re.sub(r'\b5\s*O\b', '50', text)  # "5 O" -> "50"
    text = re.sub(r'/O\b', '20', text)  # "/O" -> "20"
    text = re.sub(r'\b0\s*\.\s*', '0.', text)  # "0 . " -> "0."
    
    # Fix UNITS - comprehensive pattern matching
    # mg variations
    text = re.sub(r'(?<=\d)\s*rng\b', 'mg', text)
    text = re.sub(r'(?<=\d)\s*rnq\b', 'mg', text)
    text = re.sub(r'(?<=\d)\s*rn\s*g\b', 'mg', text)
    text = re.sub(r'(?<=\d)\s*m\s+g\b', 'mg', text)
    text = re.sub(r'\brng\b', 'mg', text)
    text = re.sub(r'\brnq\b', 'mg', text)
    
    # mcg variations
    text = re.sub(r'(?<=\d)\s*rncg\b', 'mcg', text)
    text = re.sub(r'(?<=\d)\s*mc\s*g\b', 'mcg', text)
    text = re.sub(r'\brncg\b', 'mcg', text)
    
    # kg variations - very extensive
    text = re.sub(r'(?<=\d)\s*[lI1]\s*<\s*g\b', 'kg', text)
    text = re.sub(r'(?<=\d)\s*k\s*[(\[][Jg]\s*[)\]]\b', 'kg', text)
    text = re.sub(r'(?<=\d)\s*kq\b', 'kg', text)
    text = re.sub(r'\b[lI1]<g\b', 'kg', text)
    text = re.sub(r'\bI<g\b', 'kg', text)
    text = re.sub(r'\bk[(\[]J[)\]]\b', 'kg', text)
    text = re.sub(r'\bkq\b', 'kg', text)
    
    # ml variations
    text = re.sub(r'(?<=\d)\s*rnl\b', 'ml', text)
    text = re.sub(r'(?<=\d)\s*rn\s*l\b', 'ml', text)
    text = re.sub(r'\brnl\b', 'ml', text)
    text = re.sub(r'\bmll\b', 'ml', text)
    
    # Time intervals - H pattern
    text = re.sub(r'\bti\s*-\s*1', '6-1', text)  # "ti-1" is "6-1"
    text = re.sub(r'\b6\s*-\s*1\s*2\s*H\b', '6-12H', text)
    text = re.sub(r'\b8\s*-\s*1\s*2\s*H\b', '8-12H', text)
    text = re.sub(r'\b(\d+)\s*-\s*1\s*H\b', r'\1-12H', text)
    text = re.sub(r'\bti-12H\b', '6-12H', text)
    text = re.sub(r'\bti\b', '6', text)  # standalone "ti" is likely "6"
    text = re.sub(r'\b8-l2H\b', '8-12H', text)
    text = re.sub(r'\b(\d+)hr\b', r'\1H', text)  # Standardize hr -> H
    text = re.sub(r'\bllr\b', 'hr', text)
    text = re.sub(r'\blhr\b', 'hr', text)
    
    # Week patterns
    text = re.sub(r'\b(\d+)wl<\b', r'\1wk', text)
    text = re.sub(r'\bwl<\b', 'wk', text)
    
    # min variations
    text = re.sub(r'(?<=\d)\s*rnin\b', 'min', text)
    text = re.sub(r'\brnin\b', 'min', text)
    text = re.sub(r'\bOmin\b', '0min', text)
    
    # Fix common WORD OCR errors
    text = re.sub(r'\bornl\b', 'oral', text, flags=re.IGNORECASE)
    text = re.sub(r'\boml\b', 'oral', text, flags=re.IGNORECASE)
    text = re.sub(r'\borul\b', 'oral', text, flags=re.IGNORECASE)
    text = re.sub(r'\btl1en\b', 'then', text)
    text = re.sub(r'\btl1on\b', 'then', text)
    text = re.sub(r'\bthen1\b', 'then', text)
    text = re.sub(r'\btnon\b', 'then', text)
    text = re.sub(r'\bbeforc\b', 'before', text)
    text = re.sub(r'\bbeforo\b', 'before', text)
    text = re.sub(r'\bparacetarno1\b', 'paracetamol', text, flags=re.IGNORECASE)
    text = re.sub(r'\bparacetarnol\b', 'paracetamol', text, flags=re.IGNORECASE)
    text = re.sub(r'\bnarar,r,tclt\b', 'paracetamol', text, flags=re.IGNORECASE)
    text = re.sub(r'\bangioplasly\b', 'angioplasty', text)
    text = re.sub(r'\bsoltn\b', 'solution', text)
    text = re.sub(r'\bintratrac:l1eal\b', 'intratracheal', text)
    text = re.sub(r'\bumoi\b', 'umol', text)
    text = re.sub(r'\burnoi\b', 'umol', text)
    text = re.sub(r'\bumolll\b', 'umol/L', text)
    text = re.sub(r'\brnux\b', 'max', text)
    text = re.sub(r'\brnax\b', 'max', text)
    text = re.sub(r'\btub\b', 'tab', text)
    text = re.sub(r'\btau\b', 'tab', text)  # "tau" -> "tab"
    text = re.sub(r'\brepoat\b', 'repeat', text)
    text = re.sub(r'\brepeat\b', 'repeat', text)
    text = re.sub(r'\bdnily\b', 'daily', text)
    text = re.sub(r'\bdni!y\b', 'daily', text)
    text = re.sub(r'\brnane\b', 'mane', text)
    text = re.sub(r'\bnocle\b', 'nocte', text)
    text = re.sub(r'\benceph\b', 'encephalitis', text)
    text = re.sub(r'\bcella\b', 'cellulitis', text)
    text = re.sub(r'\binfsn\b', 'infusion', text)
    text = re.sub(r'\bincr\b', 'increase', text)
    text = re.sub(r'\breqd\b', 'required', text)
    text = re.sub(r'\bprn\b', 'as needed', text)
    
    # IV/IM variations
    text = re.sub(r'\bUlV\b', 'IV', text)
    text = re.sub(r'\bIVl\b', 'IM', text)
    text = re.sub(r'\blVl\b', 'IM', text)
    text = re.sub(r'\bIlV\b', 'IV', text)
    
    # Fix "See X" references
    text = re.sub(r'\bSec\b', 'See', text)
    text = re.sub(r'\bSoo\b', 'See', text)
    text = re.sub(r'\bSeu\b', 'See', text)
    
    # Fix decimal points
    text = re.sub(r'(\d+)\s*\.\s*(\d+)', r'\1.\2', text)
    text = re.sub(r'(\d+)\s*_\s*(\d+)', r'\1.\2', text)
    text = re.sub(r'0_1', '0.1', text)
    text = re.sub(r'12\.ti', '12.5', text)
    
    # Fix percentages and % symbol
    text = re.sub(r'([0-9])\s*%', r'\1%', text)
    
    # Fix spacing around operators
    text = re.sub(r'\s*\+\s*', ' + ', text)
    text = re.sub(r'\s*-\s*', '-', text)
    text = re.sub(r'(\d+)\s*/\s*(\d+)', r'\1/\2', text)
    
    # Clean up garbage patterns
    text = re.sub(r'[\\\\][\w]+', '', text)  # Remove backslash commands
    text = re.sub(r'~', '-', text)
    text = re.sub(r'--+', '-', text)
    
    # Remove soft hyphens and other invisible characters
    text = re.sub(r'[\u00ad\u200b\u200c\u200d]', '', text)
    
    # Fix double periods and spacing
    text = re.sub(r'\.\.+', '.', text)
    text = re.sub(r'\s+\.', '.', text)
    text = re.sub(r'\.\s+\.', '.', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+,', ',', text)
    
    return text.strip()

def is_valid_drug_name(name):
    """Check if a name looks like a valid drug name"""
    if not name or len(name) < 2 or len(name) > 100:
        return False
    
    # Must have letters
    if not any(c.isalpha() for c in name):
        return False
    
    # Not too many special characters
    if name.count('\\') > 0:
        return False
    
    # Check for gibberish patterns
    gibberish_patterns = [
        r'\\[a-zA-Z]+',  # Backslash commands
        r'[^\x00-\x7F]{3,}',  # Multiple non-ASCII characters
        r'\d{5,}',  # Too many digits
        r'[^a-zA-Z0-9\s\-\+\(\),\.%]{3,}',  # Too many special chars
    ]
    
    for pattern in gibberish_patterns:
        if re.search(pattern, name):
            return False
    
    return True

def is_valid_dosage(dosage):
    """Check if dosage text looks valid"""
    if not dosage:
        return True  # Empty dosage okay for cross-references
    
    if len(dosage) < 3:
        return False
    
    # Check for excessive gibberish
    clean = re.sub(r'[a-zA-Z0-9\s\-\+\(\),\.:/\%]', '', dosage)
    if len(clean) > len(dosage) * 0.3:  # More than 30% gibberish
        return False
    
    return True

def parse_frank_shann(file_path):
    """Parse Frank Shann text file into structured drug data"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Clean the entire content first
    content = clean_text(content)
    
    # Split into lines
    lines = content.split('\n')
    
    parsed_data = []
    current_entry = None
    
    # Words that shouldn't start a drug entry
    NON_DRUG_STARTS = {
        'Monitor', 'Note', 'Caution', 'Warning', 'See', 'Adult', 'Child', 'Infant', 
        'Neonatal', 'Preterm', 'Term', 'Give', 'Stop', 'Repeat', 'Max', 'Min', 
        'Total', 'Daily', 'Weekly', 'Monthly', 'If', 'Then', 'For', 'Use', 'Avoid', 
        'Adjust', 'Check', 'Measure', 'Keep', 'Protect', 'Dilute', 'Dissolve', 
        'Infuse', 'Inject', 'Take', 'Administer', 'Apply', 'In', 'On', 'At', 'To', 
        'By', 'With', 'Without', 'Or', 'And', 'But', 'However', 'Although', 'Because', 
        'Since', 'When', 'Where', 'Why', 'How', 'What', 'Who', 'Which', 'That', 
        'This', 'These', 'Those', 'It', 'They', 'We', 'You', 'He', 'She', 'The', 
        'A', 'An', 'NB', 'IV', 'IM', 'SC', 'PO', 'PR', 'PV', 'SL', 'TOP', 'INH', 
        'NEB', 'Contents', 'Drug', 'Doses', 'Infusion', 'Rates', 'Table', 
        'Haemofiltration', 'Cytochrome', 'Alveolar', 'Muscle', 'Pacemaker', 
        'Intravenous', 'Haematology', 'Fluid', 'Dialysis', 'Ventilation', 
        'Immunisation', 'Antibiotic', 'Normal', 'Values', 'Resuscitation', 
        'Pharmacokinetic', 'Prophylaxis', 'Treatment', 'Loading', 'Maintenance', 
        'Severe', 'Slow', 'Extended', 'Newborn', 'NOT', 'Inanimate'
    }
    
    start_processing = False
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 2:
            continue
        
        # Start processing after we see the main drug list marker
        if "DRUGS ARE LISTED BY GENERIC NAME" in line:
            start_processing = True
            continue
        
        if not start_processing:
            continue
        
        # Skip page markers
        if line.isdigit() or len(line) > 500:
            continue
        
        # Check if this is a new drug entry
        is_new_entry = False
        first_word = line.split(' ')[0].strip('.,:;()')
        
        # New entry detection heuristics
        if first_word and len(first_word) > 1:
            # Must start with uppercase
            if first_word[0].isupper() and first_word not in NON_DRUG_STARTS:
                # Pattern 1: "Name. dosage..."
                if '.' in line[:80]:
                    period_pos = line.find('.')
                    potential_name = line[:period_pos].strip()
                    if is_valid_drug_name(potential_name) and period_pos < 80:
                        is_new_entry = True
                        name = potential_name
                        dosage = line[period_pos+1:].strip()
                # Pattern 2: Combination drugs with +
                elif '+' in line[:60] and not line.startswith('Adult'):
                    is_new_entry = True
                    if '.' in line:
                        parts = line.split('.', 1)
                        name = parts[0].strip()
                        dosage = parts[1].strip() if len(parts) > 1 else ""
                    else:
                        name = line.strip()
                        dosage = ""
        
        if is_new_entry:
            # Validate name
            if is_valid_drug_name(name):
                current_entry = {
                    "id": f"fs-{str(len(parsed_data)+1).zfill(4)}",
                    "name": name,
                    "dosage": dosage
                }
                parsed_data.append(current_entry)
        else:
            # Append to current entry
            if current_entry:
                if current_entry['dosage']:
                    current_entry['dosage'] += " " + line
                else:
                    current_entry['dosage'] = line
    
    # Final validation and cleaning
    final_data = []
    rejected_count = 0
    
    for entry in parsed_data:
        # Clean again
        entry['name'] = clean_text(entry['name'])
        entry['dosage'] = clean_text(entry['dosage'])
        
        # Validate
        if not is_valid_drug_name(entry['name']):
            rejected_count += 1
            continue
        
        if entry['name'] in NON_DRUG_STARTS:
            rejected_count += 1
            continue
        
        # Additional name cleaning
        entry['name'] = re.sub(r'\s+', ' ', entry['name'])
        entry['name'] = entry['name'].strip()
        
        # Clean dosage
        entry['dosage'] = re.sub(r'\s+', ' ', entry['dosage'])
        entry['dosage'] = entry['dosage'].strip()
        
        final_data.append(entry)
    
    return final_data, rejected_count

if __name__ == "__main__":
    print("Parsing Frank Shann extracted text...")
    data, rejected = parse_frank_shann('frank_shann_extracted.txt')
    
    # Save to file
    output_file = 'src/frankShannData.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✓ Extracted {len(data)} valid drug entries")
    print(f"✓ Rejected {rejected} invalid entries")
    print(f"✓ Output saved to {output_file}")
    
    # Show sample entries
    print(f"\nSample entries:")
    for i in range(min(5, len(data))):
        print(f"\n{i+1}. {data[i]['name']}")
        dosage_preview = data[i]['dosage'][:100] + "..." if len(data[i]['dosage']) > 100 else data[i]['dosage']
        print(f"   {dosage_preview}")
