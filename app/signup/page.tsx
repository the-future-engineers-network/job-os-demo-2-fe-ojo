'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./signup.module.css"; // Import CSS module

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = 'https://job-os-internship-2.vercel.app';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/signin');
      } else {
        setError(data.message || 'Signup failed');
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
        <h1>Signup</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? <div className={styles.spinner}></div> : 'Sign Up'}
          </button>
        </form>
        <p className={styles['signup-link']}>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

