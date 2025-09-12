#!/usr/bin/env python3
"""
Test script to verify the processor endpoint works correctly.
This tests the /process/upload endpoint that the frontend is now using.
"""

import requests
import os

def test_processor_upload():
    # Backend URL for processor endpoint
    url = "http://127.0.0.1:5000/process/upload"
    
    # Create a simple test PDF content (as text for testing)
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
    
    # Create test file (as .txt since we can't create actual PDF easily)
    test_file_path = "test_safety_document.txt"
    with open(test_file_path, "wb") as f:
        f.write(test_content.encode())
    
    try:
        # Upload file using the processor endpoint
        with open(test_file_path, "rb") as f:
            files = {"pdf": f}  # Note: using 'pdf' as the field name
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Upload and processing successful!")
            result = response.json()
            print(f"📄 Original Text Length: {len(result.get('original_text', ''))}")
            print(f"🏢 Department: {result.get('department_label')}")
            print(f"🌐 Language: {result.get('language')}")
            print(f"📝 Summary: {result.get('summary', '')[:100]}...")
            print(f"🔄 Translated: {len(result.get('translated_text', ''))} chars")
            print("\nFull Response:")
            print(result)
        else:
            print("❌ Upload failed!")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        # Clean up test file
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

if __name__ == "__main__":
    print("Testing processor upload endpoint...")
    print("Make sure the backend server is running on http://127.0.0.1:5000")
    print("-" * 50)
    test_processor_upload()
