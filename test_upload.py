#!/usr/bin/env python3
"""
Simple test script to verify the document upload and LLM processing works.
Run this after starting the backend server.
"""

import requests
import os

def test_upload():
    # Backend URL
    url = "http://localhost:5000/documents/upload"
    
    # Create a simple test file
    test_content = """
    SAFETY CIRCULAR
    
    To: All Employees
    From: Safety Department
    Subject: Workplace Safety Guidelines
    
    This circular outlines important safety procedures that must be followed:
    
    1. Always wear personal protective equipment (PPE)
    2. Report any hazards immediately
    3. Follow proper lockout/tagout procedures
    4. Maintain clean work areas
    
    For any safety concerns, contact the Safety Department.
    
    Date: 2024-01-15
    """
    
    # Create test file
    test_file_path = "test_safety_document.txt"
    with open(test_file_path, "w") as f:
        f.write(test_content)
    
    try:
        # Upload file
        with open(test_file_path, "rb") as f:
            files = {"file": f}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Upload and processing successful!")
            result = response.json()
            processing_result = result.get("processing_result", {})
            print(f"📄 File: {result.get('filename')}")
            print(f"🏢 Department: {processing_result.get('department')}")
            print(f"🌐 Language: {processing_result.get('language')}")
            print(f"📝 Summary: {processing_result.get('summary')}")
        else:
            print("❌ Upload failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        # Clean up test file
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

if __name__ == "__main__":
    print("Testing document upload and LLM processing...")
    print("Make sure the backend server is running on http://localhost:5000")
    print("-" * 50)
    test_upload()
