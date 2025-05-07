import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const register = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
      });

      
      router.push('/login');
    } catch (err: any) {
        console.log(err, "error in register");
      if (err.response && err.response.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      <button onClick={() => router.push('/')}>Go to Home</button>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
}
