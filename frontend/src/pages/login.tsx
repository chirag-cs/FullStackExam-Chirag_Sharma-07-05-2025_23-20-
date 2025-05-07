import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async () => {
       setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log(res.data, "login_data");
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('userId', res.data.userId);
      router.push('/');
    } catch (err: any) {
      if (err.response && err.response.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const goToHome = () => {
    router.push('/');
  };
  return (
    <div>
        <button onClick={goToHome}>Go to Home</button>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}
