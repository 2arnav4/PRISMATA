import os
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from controllers.pipeline import process_pdf  # Your modified pipeline with process_pdf returning dict
from storage.db import insert_document

processor_bp = Blueprint('processor', __name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@processor_bp.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    result = process_pdf(filepath)

    insert_document(
        file_name=filename,
        uploaded_at=datetime.utcnow().isoformat(),
        original_text=result.get("original_text"),
        language=result.get("language"),
        translated_text=result.get("translated_text"),
        summary=result.get("summary"),
        department_label=result.get("department_label"),
        notes=None
    )

    return jsonify(result), 201
