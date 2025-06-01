import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './TodoList.css';

// Función inteligente para generar descripciones
function generarDescripcionInteligente(texto) {
  const lower = texto.toLowerCase();
  if (lower.includes('perro')) {
    return 'Esta tarea consiste en sacar a tu perro a caminar para que haga ejercicio y necesidades.';
  }
  if (lower.includes('gato')) {
    return 'Esta tarea está relacionada con el cuidado de tu gato.';
  }
  if (lower.includes('comprar') || lower.includes('super')) {
    return 'Esta tarea implica realizar compras o ir al supermercado.';
  }
  if (lower.includes('estudiar')) {
    return 'Esta tarea consiste en dedicar tiempo a estudiar y aprender.';
  }
  if (lower.includes('trabajo') || lower.includes('oficina')) {
    return 'Esta tarea está relacionada con tus responsabilidades laborales.';
  }
  if (lower.includes('ejercicio') || lower.includes('correr') || lower.includes('gym')) {
    return 'Esta tarea implica realizar actividad física para mantenerte saludable.';
  }
  if (lower.includes('cita') || lower.includes('doctor') || lower.includes('médico')) {
    return 'Esta tarea es un recordatorio de una cita médica o importante.';
  }
  if (lower.includes('limpiar') || lower.includes('aseo')) {
    return 'Esta tarea consiste en limpiar o mantener el orden en tu espacio.';
  }
  if (lower.includes('leer')) {
    return 'Esta tarea consiste en leer un libro, artículo o documento.';
  }
  if (lower.includes('llamar') || lower.includes('telefono')) {
    return 'Esta tarea es un recordatorio para hacer una llamada importante.';
  }
  // Por defecto
  return 'Esta tarea es importante para tu organización personal.';
}

// Popup de descripción usando portal
function DescripcionPopup({ descripcion, x, y }) {
  return ReactDOM.createPortal(
    <div className="todo-desc-popup" style={{ left: x + 16, top: y + 16 }}>
      {descripcion}
      <span className="todo-desc-arrow" />
    </div>,
    document.body
  );
}

function TrashCan({ show, trashRef }) {
  return ReactDOM.createPortal(
    <div ref={trashRef} className={`trash-can-fixed${show ? ' show' : ''}`}>
      <span role="img" aria-label="Basurero" className="trash-can-icon">🗑️</span>
    </div>,
    document.body
  );
}

function FlyingTask({ text, from, to, onEnd }) {
  // from: {x, y, width, height}, to: {x, y}
  const [flying, setFlying] = useState(false);
  useEffect(() => {
    setTimeout(() => setFlying(true), 10);
    const timer = setTimeout(() => onEnd(), 900);
    return () => clearTimeout(timer);
  }, [onEnd]);
  return ReactDOM.createPortal(
    <div
      className={`flying-task${flying ? ' flying' : ''}`}
      style={{
        left: from.x,
        top: from.y,
        width: from.width,
        height: from.height,
        transform: flying
          ? `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(0.3) rotate(12deg)`
          : 'none',
        opacity: flying ? 0 : 1
      }}
    >
      <div className="todo-item flying-content">{text}</div>
    </div>,
    document.body
  );
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTask, setHoveredTask] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveringTrash, setHoveringTrash] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [showTrashCan, setShowTrashCan] = useState(false);
  const [flyingTask, setFlyingTask] = useState(null); // {text, from, to}
  const tasksPerPage = 5;
  const trashRef = useRef();
  const taskRefs = useRef({});

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
        completed: false,
        descripcion: generarDescripcionInteligente(newTodo)
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

  // Animación de lanzar a la basura (caída realista)
  const deleteTodo = (id) => {
    const taskElem = taskRefs.current[id];
    const trashElem = trashRef.current;
    if (taskElem && trashElem) {
      const taskRect = taskElem.getBoundingClientRect();
      const trashRect = trashElem.getBoundingClientRect();
      setFlyingTask({
        text: todos.find(t => t.id === id).text,
        from: {
          x: taskRect.left,
          y: taskRect.top,
          width: taskRect.width,
          height: taskRect.height
        },
        to: {
          x: trashRect.left + trashRect.width / 2 - taskRect.width / 2,
          y: trashRect.top + trashRect.height / 2 - taskRect.height / 2
        },
        id
      });
      setShowTrashCan(true);
      // Eliminar la tarea real de inmediato
      setTodos(todos.filter(todo => todo.id !== id));
      setRemovingId(null);
      setTimeout(() => setShowTrashCan(false), 800);
    } else {
      // fallback si no hay refs
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // El clon visual desaparece solo al terminar la animación
  const handleFlyingEnd = () => {
    setFlyingTask(null);
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

  // Mostrar popup al pasar el mouse
  const handleMouseEnter = (todo) => {
    if (!hoveringTrash) setHoveredTask(todo);
  };
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseLeave = () => {
    setHoveredTask(null);
  };

  // Ocultar popup al pasar el mouse por la basurita
  const handleTrashEnter = () => {
    setHoveringTrash(true);
    setHoveredTask(null);
  };
  const handleTrashLeave = () => {
    setHoveringTrash(false);
  };

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
          <li
            key={todo.id}
            ref={el => (taskRefs.current[todo.id] = el)}
            className={`todo-item ${todo.completed ? 'completed' : ''} ${removingId === todo.id ? 'removing-to-trash' : ''} ${flyingTask && flyingTask.id === todo.id ? 'pending-remove' : ''}`}
            onMouseEnter={() => handleMouseEnter(todo)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={flyingTask && flyingTask.id === todo.id ? { pointerEvents: 'none', opacity: 0.4 } : {}}
          >
            <div className="todo-content">
              <button
                className={`check-button ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
                disabled={!!(flyingTask && flyingTask.id === todo.id)}
              >
                {todo.completed && '✓'}
              </button>
              <span className="todo-text">{todo.text}</span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
              onMouseEnter={handleTrashEnter}
              onMouseLeave={handleTrashLeave}
              disabled={!!(flyingTask && flyingTask.id === todo.id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Popup visual de descripción usando portal */}
      {hoveredTask && !hoveringTrash && (
        <DescripcionPopup descripcion={hoveredTask.descripcion} x={mousePos.x} y={mousePos.y} />
      )}

      {/* Basurero animado a la derecha */}
      <TrashCan show={showTrashCan} trashRef={trashRef} />

      {/* Tarea volando hacia la canasta */}
      {flyingTask && (
        <FlyingTask {...flyingTask} onEnd={handleFlyingEnd} />
      )}

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