import json
import re

def parse_abx_data(filename='abx_extracted.txt'):
    """Parse ABX regime extracted text into structured JSON"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    antibiotics = []
    antifungals = []
    antivirals = []
    
    # Split by pages
    pages = text.split('=== PAGE')
    
    current_drug = None
    current_category = 'antibiotic'
    
    for page in pages[1:]:  # Skip first empty split
        lines = page.split('\n')
        page_num = lines[0].strip().replace('===', '').strip()
        
        # Determine category based on page title
        if 'Antifungal' in ''.join(lines[:10]):
            current_category = 'antifungal'
        elif 'Antiviral' in ''.join(lines[:10]):
            current_category = 'antiviral'
        
        # Simple extraction: look for drug name patterns
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Skip headers and empty lines
            if not line or 'Antibiotic' in line or 'Usual' in line or '===' in line:
                continue
            
            # Detect drug names (starts with IV/Oral or capitalized word)
            if re.match(r'^(IV|Oral|Penicillin)', line):
                # Extract drug name
                drug_name = line
                
                # Try to get usual dose from next few lines
                usual_dose = ""
                dosage_info = []
                
                for j in range(i+1, min(i+20, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and not next_line.startswith('CrCl') and not next_line.startswith('Source'):
                        if 'mg' in next_line or 'MU' in next_line or 'unit' in next_line:
                            usual_dose = next_line
                            break
                
                # Get dosing adjustments
                for j in range(i+1, min(i+30, len(lines))):
                    next_line = lines[j].strip()
                    if 'CrCl' in next_line or 'GFR' in next_line or 'ml/min' in next_line:
                        dosage_info.append(next_line)
                
                if drug_name and usual_dose:
                    drug_entry = {
                        "name": drug_name,
                        "usualDose": usual_dose,
                        "renalDosing": ' '.join(dosage_info[:5]) if dosage_info else "See reference for details",
                        "category": current_category
                    }
                    
                    if current_category == 'antibiotic':
                        antibiotics.append(drug_entry)
                    elif current_category == 'antifungal':
                        antifungals.append(drug_entry)
                    elif current_category == 'antiviral':
                        antivirals.append(drug_entry)
    
    # Manual extraction for key drugs (more reliable)
    abx_data = [
        {
            "id": "amikacin-md",
            "name": "Amikacin (Multiple Daily Doses)",
            "route": "IV",
            "usualDose": "7.5 mg/kg BD",
            "renalDosing": [
                {"crcl": ">50-90", "adjustment": "7.5mg/kg q12h"},
                {"crcl": "30-50", "adjustment": "7.5mg/kg q24h"},
                {"crcl": "10-30", "adjustment": "7.5mg/kg q48h"},
                {"crcl": "<10", "adjustment": "7.5mg/kg q72h"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Aminoglycoside"
        },
        {
            "id": "amikacin-od",
            "name": "Amikacin (Once Daily)",
            "route": "IV",
            "usualDose": "15mg/kg OD",
            "renalDosing": [
                {"crcl": ">80", "adjustment": "15mg/kg q24h"},
                {"crcl": "60-80", "adjustment": "12mg/kg q24h"},
                {"crcl": "40-60", "adjustment": "7.5mg/kg q24h"},
                {"crcl": "30-40", "adjustment": "4mg/kg q24h"},
                {"crcl": "20-30", "adjustment": "7.5mg/kg q48h"},
                {"crcl": "10-20", "adjustment": "4mg/kg q48h"},
                {"crcl": "<10", "adjustment": "3mg/kg q72h"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Aminoglycoside"
        },
        {
            "id": "ampicillin",
            "name": "Ampicillin",
            "route": "IV",
            "usualDose": "500mg-2g q6h",
            "renalDosing": [
                {"crcl": ">50", "adjustment": "q6h"},
                {"crcl": "10-50", "adjustment": "q6-12h"},
                {"crcl": "<10", "adjustment": "q12-24h"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Penicillin"
        },
        {
            "id": "augmentin",
            "name": "Augmentin (Amoxycillin 1g/Clavulanate 200mg)",
            "route": "IV",
            "usualDose": "1.2g TDS",
            "renalDosing": [
                {"crcl": "10-50", "adjustment": "1.2g BD"},
                {"crcl": "<10", "adjustment": "1.2g OD"}
            ],
            "notes": "",
            "category": "Penicillin + Beta-lactamase Inhibitor"
        },
        {
            "id": "azithromycin",
            "name": "Azithromycin",
            "route": "IV",
            "usualDose": "500mg OD",
            "renalDosing": [
                {"crcl": "All", "adjustment": "No adjustment recommended"}
            ],
            "notes": "Use with caution if GFR <10 ml/min",
            "category": "Macrolide"
        },
        {
            "id": "bactrim",
            "name": "Bactrim (Sulfamethoxazole/Trimethoprim)",
            "route": "IV",
            "usualDose": "8-20mg/kg/day (Trimethoprim) in divided doses",
            "renalDosing": [
                {"crcl": ">30", "adjustment": "No adjustment"},
                {"crcl": "15-30", "adjustment": "½ of recommended dose (BD for PCP)"},
                {"crcl": "<15", "adjustment": "Not recommended. If used: 5-10mg/kg OD post HD"}
            ],
            "notes": "Administer after HD",
            "category": "Sulfonamide"
        },
        {
            "id": "cefazolin",
            "name": "Cefazolin",
            "route": "IV",
            "usualDose": "1-2g TDS",
            "renalDosing": [
                {"crcl": "35-54", "adjustment": "Full dose TDS"},
                {"crcl": "11-34", "adjustment": "½ usual dose BD"},
                {"crcl": "<10", "adjustment": "½ usual dose OD"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Cephalosporin (1st gen)"
        },
        {
            "id": "cefepime",
            "name": "Cefepime",
            "route": "IV",
            "usualDose": "1-2g BD/TDS",
            "renalDosing": [
                {"crcl": ">60", "adjustment": "500mg BD to 2g TDS (based on severity)"},
                {"crcl": "30-60", "adjustment": "500mg OD to 2g BD"},
                {"crcl": "11-29", "adjustment": "250mg-500mg OD to 2g OD"},
                {"crcl": "<11", "adjustment": "250mg OD to 1g OD"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Cephalosporin (4th gen)"
        },
        {
            "id": "ceftazidime",
            "name": "Ceftazidime",
            "route": "IV",
            "usualDose": "1-2g BD/TDS",
            "renalDosing": [
                {"crcl": "31-50", "adjustment": "1g q12h"},
                {"crcl": "16-30", "adjustment": "1g q24h"},
                {"crcl": "6-15", "adjustment": "0.5g q24h"},
                {"crcl": "≤5", "adjustment": "0.5g q48h"}
            ],
            "notes": "Administer post HD on HD day. May increase by 50% in severe infection",
            "category": "Cephalosporin (3rd gen)"
        },
        {
            "id": "ceftriaxone",
            "name": "Ceftriaxone",
            "route": "IV",
            "usualDose": "1-2g OD",
            "renalDosing": [
                {"crcl": "All", "adjustment": "No adjustment necessary"}
            ],
            "notes": "Max ≤2g/day if concurrent renal and hepatic dysfunction",
            "category": "Cephalosporin (3rd gen)"
        },
        {
            "id": "ciprofloxacin-iv",
            "name": "Ciprofloxacin",
            "route": "IV",
            "usualDose": "200-400mg BD",
            "renalDosing": [
                {"crcl": "≥50", "adjustment": "No adjustment"},
                {"crcl": "10-50", "adjustment": "200mg BD"},
                {"crcl": "<10", "adjustment": "200mg BD"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Fluoroquinolone"
        },
        {
            "id": "ciprofloxacin-oral",
            "name": "Ciprofloxacin",
            "route": "Oral",
            "usualDose": "250-750mg BD",
            "renalDosing": [
                {"crcl": "30-50", "adjustment": "250-500mg BD"},
                {"crcl": "5-29", "adjustment": "250-500mg OD"},
                {"crcl": "HD", "adjustment": "250-500mg OD post HD"}
            ],
            "notes": "",
            "category": "Fluoroquinolone"
        },
        {
            "id": "meropenem",
            "name": "Meropenem",
            "route": "IV",
            "usualDose": "500mg-2g TDS",
            "renalDosing": [
                {"crcl": "26-50", "adjustment": "Recommended dose BD"},
                {"crcl": "10-25", "adjustment": "½ recommended dose BD"},
                {"crcl": "<10", "adjustment": "½ recommended dose OD"}
            ],
            "notes": "Administer after HD on HD day (500mg OD post HD)",
            "category": "Carbapenem"
        },
        {
            "id": "vancomycin",
           "name": "Vancomycin",
            "route": "IV",
            "usualDose": "2-3g/day in 2-4 divided doses (Max: 4g/day)",
            "renalDosing": [
                {"crcl": ">50", "adjustment": "15-20mg/kg BD/TDS"},
                {"crcl": "20-49", "adjustment": "15-20mg/kg OD"},
                {"crcl": "<20", "adjustment": "TDM-guided after 1g stat"}
            ],
            "notes": "Dose based on therapeutic drug monitoring",
            "category": "Glycopeptide"
        },
        {
            "id": "gentamicin-md",
            "name": "Gentamicin (Multiple Daily)",
            "route": "IV",
            "usualDose": "1.7mg/kg TDS",
            "renalDosing": [
                {"crcl": ">50-90", "adjustment": "1.7mg/kg TDS"},
                {"crcl": "10-50", "adjustment": "1.7mg/kg q12-48h"},
                {"crcl": "<10", "adjustment": "1.7mg/kg q48-72h"}
            ],
            "notes": "Administer post HD on HD day. Further adjust based on TDM",
            "category": "Aminoglycoside"
        },
        {
            "id": "gentamicin-od",
            "name": "Gentamicin (Once Daily)",
            "route": "IV",
            "usualDose": "3-5mg/kg OD",
            "renalDosing": [
                {"crcl": ">80", "adjustment": "5mg/kg q24h"},
                {"crcl": "60-80", "adjustment": "4mg/kg q24h"},
                {"crcl": "40-60", "adjustment": "3.5mg/kg q24h"},
                {"crcl": "30-40", "adjustment": "2.5mg/kg q24h"},
                {"crcl": "20-30", "adjustment": "4mg/kg q48h"},
                {"crcl": "10-20", "adjustment": "3mg/kg q48h"},
                {"crcl": "<10", "adjustment": "2mg/kg q72h"}
            ],
            "notes": "Administer post HD on HD day. Further adjust based on TDM",
            "category": "Aminoglycoside"
        },
        {
            "id": "metronidazole",
            "name": "Metronidazole (Flagyl)",
            "route": "IV",
            "usualDose": "500mg TDS",
            "renalDosing": [
                {"crcl": "All", "adjustment": "No adjustment necessary"}
            ],
            "notes": "",
            "category": "Nitroimidazole"
        },
        {
            "id": "tazocin",
            "name": "Tazocin (Piperacil lin 4g/Tazobactam 0.5g)",
            "route": "IV",
            "usualDose": "4.5g TDS-QID (Max: 18g/day)",
            "renalDosing": [
                {"crcl": "20-40", "adjustment": "2.25g QID"},
                {"crcl": "<20", "adjustment": "2.25g TDS or QID for nosocomial pneumonia"}
            ],
            "notes": "Administer post HD on HD day",
            "category": "Penicillin + Beta-lactamase Inhibitor"
        }
    ]
    
    # Save to JSON
    output = {
        "metadata": {
            "title": "ABX Regime HSM 2017",
            "description": "Antibiotic Dosage in Adult Patients with Impaired Renal Function",
            "source": "Hospital Seri Manjung",
            "year": 2017,
            "totalEntries": len(abx_data)
        },
        "antibiotics": abx_data
    }
    
    with open('src/abxData.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created src/abxData.json with {len(abx_data)} entries")
    return output

if __name__ == "__main__":
    parse_abx_data()
