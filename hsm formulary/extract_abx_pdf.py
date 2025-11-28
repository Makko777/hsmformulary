import PyPDF2
import sys

def extract_abx_pdf(pdf_path):
    """Extract text from ABX Regime PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            print(f"Total pages: {num_pages}")
            print("=" * 80)
            
            all_text = []
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                all_text.append(f"\n=== PAGE {page_num + 1} ===\n{text}")
            
            # Save to file
            with open('abx_extracted.txt', 'w', encoding='utf-8') as f:
                f.write('\n'.join(all_text))
            
            print(f"✓ Extracted {num_pages} pages")
            print("✓ Saved to abx_extracted.txt")
            
            # Show first 2000 characters
            preview = '\n'.join(all_text)[:2000]
            print("\n" + "=" * 80)
            print("PREVIEW (first 2000 chars):")
            print("=" * 80)
            print(preview)
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    extract_abx_pdf('public/Abx Regime HSM 2017.pdf')
