import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const tasksPerPage = 5;

  useEffect(() => {
    setShow(true);
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false
      }
    ]);
    setNewTodo('');
    setCurrentPage(1); // Resetear a la primera página al agregar una tarea
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filtrar tareas según el término de búsqueda y el filtro seleccionado
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true :
                         filter === 'completed' ? todo.completed :
                         !todo.completed;
    return matchesSearch && matchesFilter;
  });

  // Calcular tareas para la página actual
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTodos.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`todo-container ${show ? 'show' : ''}`}>
      <h2 className="todo-title">¿Qué tenemos planeado hacer hoy?</h2>
      
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tareas..."
          className="search-input"
        />
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Agregar nueva tarea..."
          className="todo-input"
        />
        <button type="submit" className="todo-button">Agregar</button>
      </form>

      <div className="todo-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button
          className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Por hacer
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completadas
        </button>
      </div>

      <ul className="todo-list">
        {currentTasks.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <button
                className={`check-button ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && '✓'}
              </button>
              <span className="todo-text">{todo.text}</span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}

      {filteredTodos.length === 0 && (
        <div className="no-tasks">
          {searchTerm ? 'No se encontraron tareas que coincidan con la búsqueda' : 'No hay tareas pendientes'}
        </div>
      )}
    </div>
  );
};

export default TodoList; 