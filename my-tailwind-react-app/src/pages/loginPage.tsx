import React, { useState, FocusEvent } from 'react';
import './loginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState("E-mail");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Senha");
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    // Prepare the data to send to the backend
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('https://zany-winner-x496vg95wgfv659-3000.app.github.dev/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Handle successful login (e.g., store token, redirect user)
        console.log('Login successful!', responseData);
        // Store token locally
        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
          console.log('Token stored:', responseData.token);
        }
        window.location.href = '/loggedIn'; // Redirect to the logged-in area
      } else {
        // Handle login failure (e.g., display error message)
        console.error('Login failed:', responseData);
        setErrorMessage(responseData.message || 'Falha ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('There was an error during login:', error);
      setErrorMessage('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <img src="/logo.png" alt="logo" className="login-logo-img" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-inputs">
            <input
              type="text"
              className="login-input"
              placeholder={emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setEmailPlaceholder(e.target.value ? "" : "E-mail")}
              autoComplete="username"
            />
            <input
              type="password"
              className="login-input"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setPasswordPlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setPasswordPlaceholder(e.target.value ? "" : "Senha")}
              autoComplete="current-password"
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button
            type="submit"
            className="login-button"
          >
            Entrar
          </button>
          <a
            href="#"
            className="login-forgot"
          >
        <div className="login-register">
            <button
            type="button"
            className="login-register-link"
            onClick={() => window.location.href = '/register'}
            >
            Não tem uma conta?Cadastre-se aqui!
            </button>
        </div>
          </a>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;