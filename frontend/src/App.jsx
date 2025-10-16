import './App.css'
import Prism from './components/Prism'
import { useState, useEffect } from 'react'

function App() {
  // Use environment variable and remove trailing slash
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
  
  // Debug: Log the API URL
  console.log('API_URL:', API_URL)
  console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL)

  // Generate or retrieve unique user ID from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now()
      localStorage.setItem('userId', userId)
    }
    return userId
  }

  const userId = getUserId()

  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completedTodos, setCompletedTodos] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = `${API_URL}/todos`
      console.log('Fetching todos from:', url)
      console.log('User ID:', userId)
      
      const response = await fetch(url, {
        headers: {
          'X-User-ID': userId
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      // Check if response was successful and has todos
      if (response.ok && data.todos) {
        setTodos(data.todos)
      } else {
        const errorMsg = data.message || 'Unknown error'
        console.error('Failed to fetch todos:', errorMsg)
        setError(errorMsg)
        setTodos([]) // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError(error.message || 'Failed to connect to server')
      setTodos([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`${API_URL}/create_todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        fetchTodos()
      }
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete_todo/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': userId
        }
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleComplete = (id) => {
    setCompletedTodos(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <>
      <div className='bg-gray-900 w-full h-screen relative'>
        {/* Prism Background */}
        <div className='absolute top-0 left-0 w-full h-full z-0'>
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

        {/* Todo Section */}
        <div className='relative z-10 h-screen flex items-center justify-center p-5'>
          <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-10 w-full max-w-[1200px] max-h-[90vh] overflow-auto shadow-2xl'>
            <h1 className='text-white text-4xl font-bold mb-8 text-center'>Todo App</h1>

            {/* Container for Form and Todos */}
            <div className='flex flex-col md:flex-row gap-6'>
              {/* Left Side - Form */}
              <div className='w-full md:w-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <form onSubmit={handleSubmit} className='space-y-5'>
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 outline-none focus:border-blue-400 transition-all'
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className='w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 outline-none focus:border-blue-400 transition-all resize-none'
                    />
                  </div>

                  <button
                    type="submit"
                    className='w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all transform hover:scale-105 active:scale-95'
                  >
                    Add Todo
                  </button>
                </form>
              </div>

              {/* Right Side - Todos Display */}
              <div className='w-full md:w-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-h-[600px] overflow-auto'>
                <h2 className='text-white text-2xl font-bold mb-5'>Your Todos</h2>

                {loading ? (
                  <p className='text-white/60 text-center py-8'>Loading todos...</p>
                ) : error ? (
                  <div className='text-center py-8'>
                    <p className='text-red-400 mb-2'>Error: {error}</p>
                    <button 
                      onClick={fetchTodos}
                      className='px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all'
                    >
                      Retry
                    </button>
                  </div>
                ) : !todos || todos.length === 0 ? (
                  <p className='text-white/60 text-center py-8'>No todos yet. Add one!</p>
                ) : (
                  <div className='space-y-4'>
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className='bg-white/10 p-5 rounded-xl border border-white/20 hover:bg-white/15 transition-all'
                      >
                        <div className='flex items-start gap-3'>
                          <input
                            type="checkbox"
                            checked={completedTodos[todo.id] || false}
                            onChange={() => toggleComplete(todo.id)}
                            className='mt-1 w-5 h-5 rounded cursor-pointer accent-blue-500'
                          />
                          <div className='flex-1'>
                            <h3 className={`text-white text-xl font-bold mb-2 transition-all ${
                              completedTodos[todo.id] ? 'line-through opacity-60' : ''
                            }`}>
                              {todo.title}
                            </h3>
                            <p className={`text-white/80 transition-all ${
                              completedTodos[todo.id] ? 'line-through opacity-50' : ''
                            }`}>
                              {todo.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className='px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-all transform hover:scale-105 active:scale-95'
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
      </div>
    </>
  )
}

export default App