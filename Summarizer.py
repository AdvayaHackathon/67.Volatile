import google.generativeai as genai
import PyPDF2

API_KEY = "AIzaSyAe6idUrm8K9TLIGMg9aDvA-OmaPoSDYK0"
genai.configure(api_key=API_KEY)

# Function to extract text from one or more PDF files
def extract_text_from_pdfs(file_paths):
    all_text = ""
    for path in file_paths:
        try:
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    all_text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading {path}: {e}")
    return all_text

# Function to analyze and summarize the medical content
def analyze_medical_reports(pdf_paths):
    extracted_text = extract_text_from_pdfs(pdf_paths)

    if not extracted_text.strip():
        print("No text found in the PDF(s).")
        return

    prompt = f"""
    You are a medical assistant AI. A patient has uploaded their medical report(s).
    Your job is to help them understand everything clearly.

    Here is the full content of their report(s):

    --- START REPORT TEXT ---
    {extracted_text}
    --- END REPORT TEXT ---

    Based on the report(s), provide a detailed but understandable summary for the patient including:

    1. What condition(s) they may have or are being tested for
    2. Likely causes or contributing factors
    3. Common medications or treatments and what they do
    4. Side effects the patient should watch out for
    5. Important precautions or advice they should follow

    Avoid technical jargon where possible. Be empathetic and clear.
    """

    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")
        response = model.generate_content(prompt)
        print("📋 Summary for Patient:\n")
        print(response.text)
    except Exception as e:
        print("❌ Error during analysis:")
        print(e)

# Example usage
pdf_files = [
    "report1.pdf",
    "report2.pdf"
]

analyze_medical_reports(pdf_files)
