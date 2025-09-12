from flask import Blueprint, request, jsonify
from storage.db import insert_user, check_user_credentials, get_user_by_username

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json or request.form
    username = data.get('username')
    password = data.get('password')
    department = data.get('department')

    if not username or not password or not department:
        return jsonify({"error": "All fields are required."}), 400

    if get_user_by_username(username):
        return jsonify({"error": "Username already exists."}), 409

    insert_user(username, password, department)
    return jsonify({"message": "Registration successful."}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or request.form
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password required."}), 400

    user = check_user_credentials(username, password)
    if user:
        # Return user info to client along with department for later use
        return jsonify({
            "message": "Login successful.",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "department": user['department']
            }
        }), 200
    else:
        return jsonify({"error": "Invalid credentials."}), 401

# No logout route needed in stateless API
