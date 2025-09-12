#!/usr/bin/env python3
"""
Test script to verify the authentication endpoints work correctly.
This tests both registration and login functionality.
"""

import requests
import json

def test_registration():
    """Test user registration"""
    print("Testing user registration...")
    
    url = "http://127.0.0.1:5000/auth/register"
    data = {
        "username": "testuser",
        "password": "testpass123",
        "department": "Operations"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return True
        elif response.status_code == 409:
            print("⚠️  User already exists - this is expected for subsequent runs")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting user login...")
    
    url = "http://127.0.0.1:5000/auth/login"
    data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {result}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"User ID: {result['user']['id']}")
            print(f"Username: {result['user']['username']}")
            print(f"Department: {result['user']['department']}")
            return True
        else:
            print("❌ Login failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\nTesting invalid login...")
    
    url = "http://127.0.0.1:5000/auth/login"
    data = {
        "username": "testuser",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 401:
            print("✅ Invalid login correctly rejected!")
            return True
        else:
            print("❌ Invalid login not properly handled!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Authentication Endpoints")
    print("Make sure the backend server is running on http://127.0.0.1:5000")
    print("-" * 50)
    
    # Run tests
    reg_success = test_registration()
    login_success = test_login()
    invalid_success = test_invalid_login()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Registration: {'✅ PASS' if reg_success else '❌ FAIL'}")
    print(f"Login: {'✅ PASS' if login_success else '❌ FAIL'}")
    print(f"Invalid Login Handling: {'✅ PASS' if invalid_success else '❌ FAIL'}")
    
    if all([reg_success, login_success, invalid_success]):
        print("\n🎉 All tests passed! Authentication system is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the backend server.")
