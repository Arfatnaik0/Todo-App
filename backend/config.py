from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re

app=Flask(__name__)

# Custom CORS function to allow all Vercel domains
def is_allowed_origin(origin):
    allowed_patterns = [
        r'^http://localhost:\d+$',
        r'^https://.*\.vercel\.app$',
        r'^https://todofrontend.*\.vercel\.app$'
    ]
    return any(re.match(pattern, origin) for pattern in allowed_patterns)

CORS(app, 
     origins=is_allowed_origin,
     supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db=SQLAlchemy(app)