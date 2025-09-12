import sqlite3
import os

DB_NAME = 'documents.db'

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        # Users table for authentication
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                department TEXT NOT NULL
            )
        ''')

        # Documents table for processed docs
        conn.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                uploaded_at TEXT NOT NULL,
                original_text TEXT,
                language TEXT,
                translated_text TEXT,
                summary TEXT,
                department_label TEXT,
                notes TEXT
            )
        ''')
        print("Database initialized: users and documents tables are ready.")

def insert_user(username, password, department):
    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO users (username, password, department) VALUES (?, ?, ?)
        ''', (username, password, department))
        conn.commit()

def get_user_by_username(username):
    with get_db_connection() as conn:
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    return dict(user) if user else None

def check_user_credentials(username, password):
    with get_db_connection() as conn:
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password)).fetchone()
    return dict(user) if user else None

def insert_document(file_name, uploaded_at, original_text, language, translated_text, summary, department_label, notes=None):
    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO documents (
                file_name,
                uploaded_at,
                original_text,
                language,
                translated_text,
                summary,
                department_label,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (file_name, uploaded_at, original_text, language, translated_text, summary, department_label, notes))
        conn.commit()

def fetch_all_documents():
    with get_db_connection() as conn:
        docs = conn.execute('SELECT * FROM documents ORDER BY uploaded_at DESC').fetchall()
    return [dict(d) for d in docs]

def fetch_document_by_id(doc_id):
    with get_db_connection() as conn:
        doc = conn.execute('SELECT * FROM documents WHERE id = ?', (doc_id,)).fetchone()
    return dict(doc) if doc else None

def fetch_documents_by_department(department):
    with get_db_connection() as conn:
        docs = conn.execute(
            'SELECT * FROM documents WHERE department_label = ? ORDER BY uploaded_at DESC', (department,)
        ).fetchall()
    return [dict(d) for d in docs]
