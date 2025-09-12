from flask import Flask
from storage.db import init_db
from controllers.auth import auth_bp
from controllers.processor import processor_bp
from controllers.documents import documents_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your-secret-key'  # Change in production!

    # Initialize database (creates tables if not exists)
    init_db()

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(processor_bp, url_prefix='/process')
    app.register_blueprint(documents_bp, url_prefix='/documents')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
