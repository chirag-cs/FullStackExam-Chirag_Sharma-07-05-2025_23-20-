import { GetServerSideProps } from 'next';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function Home({ products }: { products: Product[] }) {
  const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div>
     
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1rem' }}>
      {email ? (
  <>
    <span>Welcome, {email}</span>
    <button onClick={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setEmail(null);
    }}>
      Logout
    </button>
  </>
) : (
  <>
    <Link href="/login"><button>Login</button></Link>
    <Link href="/register"><button>Register</button></Link>
  </>
)}
<button onClick={() => router.push("/reports")}>Go to Reports</button>
      </div>


      <h1>Product Listings</h1>
      {products.map((product) => (
        <div key={product._id}>
          <Link href={`/product/${product._id}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>{product.description}</p>
          <p>₹{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get('http://localhost:5000/api/products');
  return {
    props: {
      products: res.data.data,
    },
  };
};
