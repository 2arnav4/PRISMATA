"""
Standalone prototype: PDF -> (extract + translate + summarize + classify).
Uses two local models:
 - google/flan-t5-base (summarization + classification)
 - facebook/m2m100_418M (translation)
"""

import os
from pathlib import Path
# from IndicTransToolkit.processor import IndicProcessor, IndicTransModel

# --- Optional imports ---
try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None

try:
    import pytesseract
    from pdf2image import convert_from_path
except ImportError:
    pytesseract = None
    convert_from_path = None

try:
    from langdetect import detect
except ImportError:
    detect = None

# transformers
_HAVE_TRANSFORMERS = False
try:
    from transformers import (
        AutoTokenizer, AutoModelForSeq2SeqLM,
        M2M100ForConditionalGeneration, M2M100Tokenizer,
        pipeline
    )
    import torch
    _HAVE_TRANSFORMERS = True
except ImportError:
    pass


# --- Step A: Extract text ---
def extract_text_from_pdf(path: str) -> str:
    print(">> Extracting text from PDF...")
    if PdfReader is None:
        print("PyPDF2 not installed -> cannot extract text.")
        return ""

    reader = PdfReader(path)
    texts = []
    for page in reader.pages:
        try:
            txt = page.extract_text() or ""
            texts.append(txt)
        except Exception:
            texts.append("")
    result = "\n".join(texts).strip()
    if result:
        print("   Extracted text successfully using PyPDF2.")
        return result

    # fallback OCR
    if pytesseract and convert_from_path:
        print("   No text found, trying OCR fallback...")
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pages = convert_from_path(path)
        ocr_texts = []
        for p in pages:
            txt = pytesseract.image_to_string(p)
            ocr_texts.append(txt)
        result = "\n".join(ocr_texts).strip()
        if result:
            print("   OCR successful.")
            return result
    print("   Extraction failed, returning empty text.")
    return ""


# --- Step B: Language detection ---
def detect_language(text: str):
    print(">> Detecting language...")
    if detect:
        try:
            lang = detect(text)
            print(f"   Detected language: {lang}")
            return lang
        except Exception as e:
            print("   Language detection failed:", e)
            return None
    else:
        print("   langdetect not installed -> skipping.")
        return None


# --- Step C: Local LLM wrapper ---
class LocalLLM:
    def __init__(self):
        self.loaded = False
        self.summarizer = None
        self.flantokenizer = None
        self.flanmodel = None
        self.indic_tokenizer = None
        self.indic_model = None
        self.indic_processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        if _HAVE_TRANSFORMERS:
            try:
                # Load flan-t5-base for summarization & classification
                model_name = "google/flan-t5-base"
                self.flantokenizer = AutoTokenizer.from_pretrained(
                    model_name, local_files_only=True
                )
                self.flanmodel = AutoModelForSeq2SeqLM.from_pretrained(
                    model_name, local_files_only=True
                )
                self.summarizer = pipeline(
                    "summarization",
                    model=self.flanmodel,
                    tokenizer=self.flantokenizer,
                    device=0 if torch.cuda.is_available() else -1
                )

                # # Load IndicTrans2 for translation
                # model_name = "./models/indictrans2-indic-en-dist-200M"
                # # self.indic_tokenizer = AutoTokenizer.from_pretrained(
                # #     model_name, local_files_only=True, trust_remote_code=True
                # # )
                # self.indic_model = IndicTransModel.from_pretrained(model_name)
                # self.indic_processor = IndicProcessor(inference=True)

                self.loaded = True
                print(">> Local models loaded: flan-t5-base + indictrans2-indic-en-dist-200M")
            except Exception as e:
                print(">> Could not load local models:", e)

    def summarize(self, text: str) -> str:
        if not self.summarizer:
            print("   No summarizer -> fallback (keep text unchanged).")
            return text
        try:
            out = self.summarizer(text, max_length=300, min_length=30, do_sample=False)
            return out[0]["summary_text"]
        except Exception as e:
            print("   Summarization failed -> fallback:", e)
            return text

    # def translate_to_en(self, text: str, src_lang="hin_Deva") -> str:
    #     """Translate text from any Indic language to English using IndicTrans2."""
    #     if not self.indic_model or not self.indic_processor:
    #         print("   No translator -> fallback (return original text).")
    #         return text
    #     try:
    #         # Preprocess
    #         batch = self.indic_processor.preprocess_batch(
    #             [text],
    #             src_lang=src_lang,
    #             tgt_lang="eng_Latn"
    #         )

    #         # Translate
    #         translations = self.indic_model.translate(batch)

    #         # Postprocess
    #         translations = self.indic_processor.postprocess_batch(translations, lang="eng_Latn")
    #         return translations[0]
    #     except Exception as e:
    #         print("   Translation failed -> fallback:", e)
    #         return text



# --- Step D: Classification ---
def classify_with_keywords(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ["invoice", "bill", "payment", "amount"]):
        return "Finance"
    if any(w in t for w in ["training", "employee", "staff", "hr"]):
        return "HR"
    if any(w in t for w in ["maintenance", "job card", "engine", "overhaul"]):
        return "Engineering"
    if any(w in t for w in ["safety", "circular", "hazard", "alert"]):
        return "Safety"
    if any(w in t for w in ["purchase order", "vendor", "procurement"]):
        return "Procurement"
    return "Other"


def classify_text(text: str, llm=None) -> str:
    print(">> Classifying text...")
    if llm and llm.flantokenizer and llm.flanmodel:
        try:
            prompt = f"Which of these departments is this message suited for? [Finance, HR, Engineering, Safety, Procurement, Other]:\n\n{text[:1000]}"
            inputs = llm.flantokenizer(prompt, return_tensors="pt", truncation=True)
            outputs = llm.flanmodel.generate(**inputs, max_length=50)
            llm_result = llm.flantokenizer.decode(outputs[0], skip_special_tokens=True)
            if any(cat in llm_result for cat in ["Finance", "HR", "Engineering", "Safety", "Procurement", "Other"]):
                print("   Classified using Local LLM:", llm_result)
                return llm_result
            else:
                print("   LLM response unclear -> fallback.")
        except Exception as e:
            print("   LLM classification failed -> fallback:", e)

    label = classify_with_keywords(text)
    print("   Classified using fallback keywords:", label)
    return label


# --- Main pipeline ---
# def process_pdf(path: str):
#     print("\n=== Processing PDF:", path, "===\n")
#     raw_text = extract_text_from_pdf(path)
#     print("RAW TEXT:\n", raw_text, "\n")

#     lang = detect_language(raw_text)

#     llm = LocalLLM()

#     # Translation step
#     # if lang and lang != "en":
#     #     print(">> Translating to English...")
#     #     translated = llm.translate_to_en(raw_text)
#     # else:
#     #     translated = raw_text
#     # print("TRANSLATED TEXT (first 300 chars):\n", translated[:300], "\n")
#     translated = raw_text

#     # Summarization step
#     print(">> Summarizing text...")
#     summary = llm.summarize(translated)
#     print("SUMMARY (first 300 chars):\n", summary[:300], "\n")

#     # Classification
#     label = classify_text(translated, llm=llm)
#     print("CLASSIFICATION RESULT:", label)

#     print("\n=== Pipeline finished ===\n")


def process_pdf(path: str):
    print("\n=== Processing PDF:", path, "===\n")

    # Step 1: Extract text
    raw_text = extract_text_from_pdf(path)
    print("RAW TEXT:\n", raw_text[:250], "...\n")

    # Step 2: Detect language
    lang = detect_language(raw_text)
    print("LANGUAGE DETECTED:", lang)

    llm = LocalLLM()

    # Step 3: Translate if needed
    # Uncomment and implement the actual translation logic as needed and as your models permit.
    # if lang and lang != "en":
    #     print(">> Translating to English...")
    #     translated = llm.translate_to_en(raw_text, src_lang=lang)
    # else:
    #     translated = raw_text
    translated = raw_text  # By default, no translation for now
    print("TRANSLATED TEXT (first 300 chars):\n", translated[:300], "\n")

    # Step 4: Summarization
    print(">> Summarizing text...")
    summary = llm.summarize(translated)
    print("SUMMARY (first 300 chars):\n", summary[:300], "\n")

    # Step 5: Classification
    label = classify_text(translated, llm=llm)
    print("CLASSIFICATION RESULT:", label)

    print("\n=== Pipeline finished ===\n")

    return {
        "original_text": raw_text,
        "language": lang,
        "translated_text": translated,
        "summary": summary,
        "department_label": label
    }


# --- Run directly ---
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", help="Path to PDF file")
    args = parser.parse_args()

    process_pdf(args.pdf)
