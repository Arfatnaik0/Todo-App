# Import necessary stuff
import os
from flask import request,jsonify
from config import db,app
from models import Todo

# test route
@app.route("/")
def hello():
   return "Hello world"

# Get all the todos already in database
@app.route("/todos",methods=["GET"])
def get_todos():
    todos=Todo.query.all()
    json_todos=list(map(lambda x: x.to_json(),todos))
    return jsonify({"todos":json_todos})

# create a todo
@app.route("/create_todo",methods=["POST"])
def create_todo():
    title=request.json.get("title")
    description=request.json.get("description")

    if not title or not description:
        return(
            jsonify({"message":"You must include a title and description"}),400
        )

    new_todo=Todo(title=title,description=description)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message":"Todo created successfully"}),201

# edit todo
@app.route("/edit_todo/<int:id>",methods=["PATCH"])
def update_todo(id):
    todo=Todo.query.get(id)

    if not todo:
        return jsonify({"message":"Todo not found"}),404
    
    data=request.json
    todo.title=data.get("title",todo.title)
    todo.description=data.get("description",todo.description)

    db.session.commit()
    return jsonify({"message":"Todo updated successfully"}),200

# delete todo
@app.route("/delete_todo/<int:id>",methods=["DELETE"])
def delete_todo(id):
    todo=Todo.query.get(id)

    if not todo:
        return(jsonify({"message":"Todo not found"})),404
    
    db.session.delete(todo)
    db.session.commit()

    return jsonify({"message":"Todo deleted"}),200


if __name__=="__main__":
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)