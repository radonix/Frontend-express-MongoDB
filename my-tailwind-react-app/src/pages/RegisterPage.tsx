import { useState, FocusEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './registerPage.css'; // Crie um arquivo CSS para esta página

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [namePlaceholder, setNamePlaceholder] = useState("Nome Completo");
  const [emailPlaceholder, setEmailPlaceholder] = useState("E-mail");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Senha");
  const [confirmPasswordPlaceholder, setConfirmPasswordPlaceholder] = useState("Confirmar Senha");
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Store userId

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setRegistrationError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch('https://expert-space-cod-xp4jgq5v754c6rwj-3000.app.github.dev/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        setRegistrationSuccess(true);
        setRegistrationError('');
        setUserId(data.userId || data._id || null); // Store userId from response
        // Optionally redirect the user or show a success message
      } else {
        console.error('Registration failed:', data);
        setRegistrationError(data.message || 'Erro ao registrar usuário.');
        setRegistrationSuccess(false);
        setUserId(null);
      }
    } catch (error) {
      console.error('There was an error during registration:', error);
      setRegistrationError('Erro de conexão com o servidor.');
      setRegistrationSuccess(false);
      setUserId(null);
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <div className="register-logo">
          <img src="/logo.png" alt="logo" className="register-logo-img" />
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-inputs">
            <input
              type="text"
              className="register-input"
              placeholder={namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNamePlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setNamePlaceholder(e.target.value ? "" : "Nome Completo")}
              autoComplete="name"
              required
            />
            <input
              type="email"
              className="register-input"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setEmailPlaceholder(e.target.value ? "" : "E-mail")}
              autoComplete="email"
              required
            />
            <input
              type="password"
              className="register-input"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordPlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setPasswordPlaceholder(e.target.value ? "" : "Senha")}
              autoComplete="new-password"
              required
            />
            <input
              type="password"
              className="register-input"
              placeholder={confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmPasswordPlaceholder("")}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setConfirmPasswordPlaceholder(e.target.value ? "" : "Confirmar Senha")}
              autoComplete="new-password"
              required
            />
          </div>
          {registrationError && <p className="error-message">{registrationError}</p>}
          {registrationSuccess && <p className="success-message">Cadastro realizado com sucesso!</p>}
          {/* Optionally display userId for debugging */}
          {userId && <p className="user-id-message">Seu ID de usuário: {userId}</p>}
          <button
            type="submit"
            className="register-button"
          >
            Cadastrar
          </button>
          <Link
            to="/login"
            className="register-login-link"
          >
            Já tem uma conta? Faça login!
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;