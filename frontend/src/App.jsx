import "./App.css";
import Prism from "./components/Prism";
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]); //Store all todos
  const [title, setTitle] = useState(""); //Store title
  const [description, setDescription] = useState(""); //store description
  const [completedTodos, setCompletedTodos] = useState({}); //Track completed todos

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error("Error fetching error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check if title and desc are present
    if (!title || !description) {
      alert("please fill in all the details");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create_todo", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        fetchTodos();
      } else {
        console.error("Failed to create todo");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_todo/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos();
        // Remove from completed state when deleted
        const newCompleted = { ...completedTodos };
        delete newCompleted[id];
        setCompletedTodos(newCompleted);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = (id) => {
    setCompletedTodos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="bg-gray-900 w-full h-screen relative">
        {/* Prism background */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.5}
            hueShift={0.1}
            colorFrequency={1}
            noise={0}
            glow={0.65}
          />
        </div>

        {/* Todo section */}
        <div className="relative z-10 h-screen flex items-center justify-center p-5">
          <div className="flex gap-6 w-full max-w-[1200px] max-h-[90vh]">
            {/* Left side - Form */}
            <div className=" w-1/2 flex items-center justify-center">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[20px] p-10 w-full h-0.6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h1 className="text-white text-4xl font-bold mb-8 text-center">
                Todo App
              </h1>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-white/20 bg-white/10 text-white text-base outline-none placeholder:text-white/60"
                  />
                </div>

                <div className="mb-5">
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full p-3 rounded-lg border-2 border-white/20 bg-white/10 text-white text-base outline-none resize-y placeholder:text-white/60"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 rounded-lg border-none bg-blue-500 text-white text-base font-bold cursor-pointer transition-all duration-300 hover:bg-blue-600"
                >
                  Add Todo
                </button>
              </form>
            </div>
            </div>

            {/* Right side - Todos Display */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[20px] p-10 w-full md:w-1/2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-auto">
              <h2 className="text-white text-2xl font-bold mb-5">
                Your Todos
              </h2>

              {todos.length === 0 ? (
                <p className="text-white/60 text-center">
                  No todos yet. Add one on the left!
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="bg-white/10 p-5 rounded-lg border border-white/20"
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        
                        
                        <div className="flex-1">
                          <h3 className={`text-white text-xl font-bold mb-2 transition-all ${completedTodos[todo.id] ? 'line-through opacity-60' : ''}`}>
                            {todo.title}
                          </h3>
                          <p className={`text-white/80 transition-all ${completedTodos[todo.id] ? 'line-through opacity-50' : ''}`}>
                            {todo.description}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={completedTodos[todo.id] || false}
                          onChange={() => toggleComplete(todo.id)}
                          className="w-5 h-7.5 mt-1 cursor-pointer accent-blue-500"
                        />
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="px-4 py-2 rounded-lg border-none bg-red-500 text-white text-sm font-bold cursor-pointer hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
