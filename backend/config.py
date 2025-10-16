from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS configuration - we'll update this after getting Vercel URL
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",  # Local development
            "https://*.vercel.app"     # All Vercel domains (we'll be specific later)
        ]
    }
})

# PostgreSQL in production, SQLite in development
if os.environ.get('DATABASE_URL'):
    # Render provides DATABASE_URL
    database_url = os.environ.get('DATABASE_URL')
    # Fix for SQLAlchemy if needed
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)