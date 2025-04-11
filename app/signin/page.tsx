'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signin.module.css';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = 'https://job-os-internship-2.vercel.app';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Signin failed');
      }
    } catch (error) {
      if(error)
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sign In</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <div className={styles.spinner}></div> : 'Sign In'}
          </button>
        </form>
        <p className={styles.signupLink}>
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
