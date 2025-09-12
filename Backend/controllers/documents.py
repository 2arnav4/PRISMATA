from flask import Blueprint, jsonify, request
from storage.db import fetch_documents_by_department

documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/latest', methods=['GET'])
def latest_documents():
    # Accept department as a query parameter (e.g. /latest?department=HR)
    department = request.args.get('department')
    if not department:
        # Try JSON body fallback
        json_data = request.json or {}
        department = json_data.get('department')

    if not department:
        return jsonify({"error": "Department query parameter is required."}), 400

    docs = fetch_documents_by_department(department)
    return jsonify({"documents": docs})
