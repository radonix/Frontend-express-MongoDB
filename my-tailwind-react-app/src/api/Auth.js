
// import './Auth.css'; // Removed unused CSS import

const API_URL = 'https://zany-winner-x496vg95wgfv659-3000.app.github.dev/users';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro na resposta do servidor ao tentar login.' }));
      // Log detalhado do erro da API
      console.error('API Login Error:', { status: response.status, errorData, requestBody: { email } }); // Não logar senha
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Handle empty response body gracefully
    try {
      return await response.json();
    } catch {
      return {};
    }
  } catch (error) {
    console.error('Login request failed:', error);
    throw error; // Re-throw para ser pego pelo chamador (componente)
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    // Handle empty response body gracefully
    try {
      return await response.json();
    } catch {
      return {};
    }
  } catch (error) {
    // Log do erro da requisição ou do processamento da resposta
    console.error('Register request failed:', error);
    throw error; 
  }
};