import PyPDF2
import os

pdf_path = 'public/Frank Shann 17th Edition 2017.pdf'
output_path = 'frank_shann_extracted.txt'

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        print(f"Number of pages: {num_pages}")
        
        with open(output_path, 'w') as out_file:
            for i in range(num_pages):
                page = reader.pages[i]
                text = page.extract_text()
                out_file.write(f"=== PAGE {i+1} ===\n\n")
                out_file.write(text)
                out_file.write("\n\n")
                
    print(f"Successfully extracted text to {output_path}")

except Exception as e:
    print(f"Error extracting text: {e}")
