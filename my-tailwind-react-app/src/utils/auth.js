export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  // Check for a token in localStorage (adjust key as needed)
  return !!localStorage.getItem('token');
}