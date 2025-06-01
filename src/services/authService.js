const USERS_KEY = 'todo_app_users';
const CURRENT_USER_KEY = 'todo_app_current_user';

export const authService = {
  // Registrar un nuevo usuario
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.email === userData.email)) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // En una aplicación real, esto debería estar hasheado
      createdAt: new Date().toISOString()
    };

    // Guardar usuario
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    authService.login(userData.email, userData.password);
    
    return newUser;
  },

  // Iniciar sesión
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Guardar usuario actual
    const currentUser = { ...user };
    delete currentUser.password; // No guardar la contraseña en el usuario actual
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    return currentUser;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  },

  // Verificar si hay una sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  }
}; 