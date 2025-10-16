# Imports
from config import db

# define structure of db
class Todo(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(40),nullable=False)
    description=db.Column(db.String(120),nullable=False)

# to json funtion(for react to understand)
    def to_json(self):
        return{
            "id":self.id,
            "title":self.title,
            "description":self.description,
        }