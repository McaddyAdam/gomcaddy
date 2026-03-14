import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validate = () => {
    if (!form.email.includes('@')) return 'Enter a valid email address';
    if (form.password.length < 6) return 'Password should be at least 6 characters';
    if (!isLogin && form.name.trim().length < 2) return 'Name should be at least 2 characters';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        return;
      }

      if (data.token) {
        localStorage.setItem('gomcaddy_token', data.token);
      }

      setMessage(data.message || 'Success!');
    } catch {
      setError('Unable to connect to server. Please try again.');
    }
  };

  return (
    <section>
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form className="auth-form" onSubmit={submit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
      </form>

      <button className="text-btn" onClick={() => setIsLogin((prev) => !prev)}>
        {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
      </button>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </section>
  );
}
