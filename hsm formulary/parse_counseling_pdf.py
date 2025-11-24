import re
import json

def clean_text(text):
    """Remove page markers, extra spaces, and common artifacts"""
    text = re.sub(r'===\s*PAGE\s*\d+\s*===', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

def remove_footer_text(text):
    """Remove common footer/reference text"""
    text = re.sub(r'Before ending this peer review.*', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'Remarks:.*', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'Reviewed by:.*', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'References:.*', '', text, flags=re.IGNORECASE | re.DOTALL)
    return text.strip()

def parse_special_considerations(text):
    """Parse special considerations into categorized sections"""
    if not text or len(text) < 5:
        return {}
    
    # Remove footer text
    text = remove_footer_text(text)
    
    categories = {
        'pregnancy': '',
        'breastfeeding': '',
        'elderly': '',
        'paediatric': '',
        'fasting': '',
        'hepaticImpairment': '',
        'renalImpairment': '',
        'other': []
    }
    
    # Split by common category headers
    # Look for patterns like "Pregnancy", "Breastfeeding", etc.
    sections = re.split(r'\b(Pregnancy|Breastfeeding|Elderly|Paediatric|Fasting|Hepatic [Ii]mpairment|Renal [Ii]mpairment)\b', text, flags=re.IGNORECASE)
    
    current_category = None
    current_content = []
    
    for i, section in enumerate(sections):
        section_lower = section.lower().strip()
        
        if section_lower == 'pregnancy':
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'pregnancy'
            current_content = []
        elif section_lower == 'breastfeeding':
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'breastfeeding'
            current_content = []
        elif section_lower == 'elderly':
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'elderly'
            current_content = []
        elif section_lower == 'paediatric':
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'paediatric'
            current_content = []
        elif section_lower == 'fasting':
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'fasting'
            current_content = []
        elif 'hepatic' in section_lower and 'impairment' in section_lower:
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'hepaticImpairment'
            current_content = []
        elif 'renal' in section_lower and 'impairment' in section_lower:
            if current_category and current_content:
                categories[current_category] = ' '.join(current_content).strip()
            current_category = 'renalImpairment'
            current_content = []
        elif section.strip() and current_category:
            # This is content for the current category
            current_content.append(section.strip())
    
    # Save the last category
    if current_category and current_content:
        categories[current_category] = ' '.join(current_content).strip()
    
    # Clean up numbered prefixes
    for key in categories:
        if isinstance(categories[key], str):
            categories[key] = re.sub(r'^\d+\.?\s*', '', categories[key]).strip()
    
    # If no categories were found, put everything in 'other'
    if not any(categories[k] for k in ['pregnancy', 'breastfeeding', 'elderly', 'paediatric']):
        categories['other'] = [text.strip()]
    
    return categories

def parse_side_effects(text):
    """Parse side effects into structured format with management"""
    if not text or len(text) < 5:
        return []
    
    # Remove footer text
    text = remove_footer_text(text)
    text = re.sub(r'^Side\s*Effects\s*:?', '', text, flags=re.IGNORECASE).strip()
    
    # Split by numbered patterns
    parts = re.split(r'(?<!\d)(\d+\.)\s+', text)
    
    items = []
    current_item = ""
    
    for i, part in enumerate(parts):
        if re.match(r'^\d+\.$', part):
            if current_item.strip():
                items.append(current_item.strip())
            current_item = ""
        else:
            current_item += part
    
    if current_item.strip():
        items.append(current_item.strip())
    
    # If no numbered items, try splitting by sentences
    if len(items) <= 1 and len(text) > 100:
        items = [s.strip() + '.' for s in text.split('. ') if len(s.strip()) > 10]
    
    # Clean up items
    cleaned_items = []
    for item in items:
        item = item.strip()
        if len(item) < 5 or item.isdigit():
            continue
        cleaned_items.append(item)
    
    return cleaned_items

def extract_drug_name(before_text):
    """Extract clean drug name from text immediately before <HEADER_NAME>"""
    before_text = before_text[-100:]
    
    # Remove page markers
    before_text = re.sub(r'===\s*PAGE\s*\d+\s*===', ' ', before_text)
    
    # Remove URLs and domains
    before_text = re.sub(r'http\S+', '', before_text)
    before_text = re.sub(r'\S+\.com\S*', '', before_text)
    before_text = re.sub(r'\S+\.gov\S*', '', before_text)
    before_text = re.sub(r'\S+\.my\S*', '', before_text)
    before_text = re.sub(r'\S+\.pdf\S*', '', before_text)
    
    # Remove common reference patterns
    before_text = re.sub(r'Retrieved\s+\w+\s+\d+', '', before_text, flags=re.IGNORECASE)
    before_text = re.sub(r'Services\.\s*Retrieved', '', before_text, flags=re.IGNORECASE)
    before_text = re.sub(r'Department\s+of\s+Health', '', before_text, flags=re.IGNORECASE)
    before_text = re.sub(r'Ministry\s+of\s+Health', '', before_text, flags=re.IGNORECASE)
    
    # Remove trailing numbers
    before_text = re.sub(r'\d+\s*$', '', before_text)
    
    # Get last few words
    words = before_text.strip().split()
    filtered_words = []
    
    for word in reversed(words):
        if word.lower() in ['the', 'of', 'and', 'or', 'in', 'to', 'for', 'with', 'from', 'by', 'at', 'on', 'a', 'an']:
            break
        if word.isdigit():
            break
        if re.match(r'^\d+\.$', word):
            break
        if word.lower() in ['retrieved', 'services', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']:
            break
        filtered_words.insert(0, word)
        if len(filtered_words) >= 6:
            break
    
    name = " ".join(filtered_words).strip()
    
    # Final cleaning
    name = re.sub(r'^[\W\d]+', '', name).strip()
    name = re.sub(r'[\W\d]+$', '', name).strip()
    name = re.sub(r'\s+(com|gov|my|pdf)\s*$', '', name, flags=re.IGNORECASE)
    
    if len(name) < 3 or not any(c.isalpha() for c in name):
        return None
    
    return name

def parse_counseling_text(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    processed_lines = []
    for line in lines:
        clean_line = line.strip()
        # Handle headers that appear on their own lines to avoid false positives in text
        if clean_line == "Others":
            processed_lines.append("<HEADER_OTHERS>")
        elif re.match(r'^Storage\*?$', clean_line):
            processed_lines.append("<HEADER_STORAGE>")
        else:
            processed_lines.append(clean_line)

    full_text = " ".join(processed_lines)
    full_text = re.sub(r'\s+', ' ', full_text)
    
    # Replace headers with markers
    text = full_text
    text = re.sub(r'\bName\s*:', '<HEADER_NAME>', text, flags=re.IGNORECASE)
    text = re.sub(r'\bPharmacological\s+Group\b', '<HEADER_GROUP>', text, flags=re.IGNORECASE)
    text = re.sub(r'\bIndications\s+and\s+Dosage\b', '<HEADER_INDICATION>', text, flags=re.IGNORECASE)
    text = re.sub(r'\bMethod\s+of\s+Administration\s*\*?', '<HEADER_METHOD>', text, flags=re.IGNORECASE)
    text = re.sub(r'\bSpecial\s+Considerations\b', '<HEADER_SPECIAL>', text, flags=re.IGNORECASE)
    text = re.sub(r'\bSide\s+Effects\s+and\s+their\s+Management\s*\*?', '<HEADER_SIDE_EFFECTS>', text, flags=re.IGNORECASE)
    # Storage and Others are now handled during line processing to prevent false positives
    
    name_pattern = r'(.{0,100})<HEADER_NAME>'
    matches = list(re.finditer(name_pattern, text))
    
    extracted_data = []
    
    for i, match in enumerate(matches):
        name_candidate = match.group(1)
        name = extract_drug_name(name_candidate) # Use the existing extract_drug_name for robust cleaning
        
        # Skip non-drug entries
        if not name:
            continue
        
        # Filter out common non-drug text patterns
        skip_patterns = [
            r'^Name\s*:?\s*$',  # Just "Name:" with no actual name
            r'^Signature',
            r'^Date',
            r'^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # Dates
            r'^Reviewed\s+by',
            r'^Prepared\s+by',
            r'^Checked\s+by',
            r'^Verified\s+by',
            r'^\s*$',  # Empty
            r'^Page\s+\d+',
            r'^Remarks',
            r'^References',
        ]
        
        should_skip = False
        for pattern in skip_patterns:
            if re.match(pattern, name, re.IGNORECASE):
                should_skip = True
                break
        
        if should_skip:
            continue
        
        # Also skip if name is too short (likely not a drug name)
        if len(name) < 3:
            continue
        
        start_pos = match.end()
        if i < len(matches) - 1:
            end_pos = matches[i+1].start()
        else:
            end_pos = len(text)
        
        drug_content = text[start_pos:end_pos]
        
        ALL_HEADERS = ['<HEADER_GROUP>', '<HEADER_INDICATION>', '<HEADER_METHOD>', '<HEADER_SPECIAL>', '<HEADER_SIDE_EFFECTS>', '<HEADER_STORAGE>', '<HEADER_OTHERS>']

        # Extract sections
        def extract_section(content, start_marker, explicit_end_markers):
            if start_marker and start_marker not in content:
                return ""
            start_idx = content.find(start_marker) + len(start_marker) if start_marker else 0
            end_idx = len(content)
            
            # Use all headers as potential stop markers to prevent bleeding
            # This ensures we stop at the NEXT header, whatever it is
            stop_markers = set(explicit_end_markers + ALL_HEADERS)
            if start_marker in stop_markers:
                stop_markers.remove(start_marker)
                
            for marker in stop_markers:
                idx = content.find(marker, start_idx)
                if idx != -1 and idx < end_idx:
                    end_idx = idx
            result = content[start_idx:end_idx]
            return clean_text(result)

        group = extract_section(drug_content, '<HEADER_GROUP>', [])
        indication_and_dosage = extract_section(drug_content, '<HEADER_INDICATION>', [])
        method = extract_section(drug_content, '<HEADER_METHOD>', [])
        special = extract_section(drug_content, '<HEADER_SPECIAL>', [])
        side_effects = extract_section(drug_content, '<HEADER_SIDE_EFFECTS>', [])
        storage = extract_section(drug_content, '<HEADER_STORAGE>', [])
        others = extract_section(drug_content, '<HEADER_OTHERS>', [])

        # Clean specific fields
        indication_and_dosage = re.sub(r'^1\.\s*Indication\s*:', '', indication_and_dosage, flags=re.IGNORECASE).strip()
        indication_and_dosage = re.sub(r'^Indication\s*:', '', indication_and_dosage, flags=re.IGNORECASE).strip()
        
        # Split indication and dosage
        # Look for common dosage markers
        dosage_match = re.search(r'(?:Dosage|Dose)\s*:', indication_and_dosage, re.IGNORECASE)
        if dosage_match:
            indication = indication_and_dosage[:dosage_match.start()].strip()
            dosage = indication_and_dosage[dosage_match.start():].strip()
            # Clean dosage prefix
            dosage = re.sub(r'^(?:Dosage|Dose)\s*:', '', dosage, flags=re.IGNORECASE).strip()
        else:
            # If no clear split, use the whole text for indication and extract dosage info
            indication = indication_and_dosage
            # Try to find dosage patterns (mg, mcg, etc.)
            dosage_pattern = r'(?:^|\n)(?:\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|%|units?|tablets?|capsules?).*?)(?=\n|$)'
            dosage_matches = re.findall(dosage_pattern, indication_and_dosage, re.IGNORECASE | re.MULTILINE)
            if dosage_matches:
                dosage = ' '.join(dosage_matches).strip()
            else:
                dosage = "See indication for dosage details"
        
        # Remove footer text
        others = remove_footer_text(others)
        storage = remove_footer_text(storage)

        # Parse special considerations into categories
        special_considerations = parse_special_considerations(special)
        
        # Parse side effects
        side_effects_list = parse_side_effects(side_effects)

        drug = {
            "id": f"counsel-{str(i+1).zfill(3)}",
            "name": name,
            "pharmacologicalGroup": group,
            "indication": indication,
            "dosage": dosage,
            "methodOfAdministration": method,
            "specialConsiderations": special_considerations,
            "sideEffects": side_effects_list,
            "others": {
                "storage": storage,
                "other_points": others
            }
        }
        
        extracted_data.append(drug)

    with open('counseling_data_extracted.json', 'w') as f:
        json.dump(extracted_data, f, indent=4)
        
    print(f"Extracted {len(extracted_data)} medications.")

if __name__ == "__main__":
    parse_counseling_text('counseling_pdf_content.txt')
