import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import withAuth from '@/lib/withAuth';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

type ProductPageProps = {
  product: Product;
};

function ProductPage({ product }: ProductPageProps) {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = async () => {
    setMessage('');
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId: product._id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Added to cart!');
    } catch (err : any) {
        if (err.response && err.response.data?.error) {
            setMessage(err.response.data.error);
            router.push('/login');
          } else {
            setMessage('An unknown error occurred');
          }
      
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const goToHome = () => {
    router.push('/');
  };



  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
        <button 
        onClick={goToHome}
      >
        Go to Home
      </button>

         <button
        onClick={goToCart}
      >
        Go to Cart
      </button>
      <h1>{product.name}</h1>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
        />
      )}
      <p>{product.description}</p>
      <h3>Price: ₹{product.price}</h3>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Quantity:{' '}
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ width: '60px' }}
          />
        </label>
      </div>

      <button onClick={handleAddToCart} style={{ marginTop: '1rem' }}>
        Add to Cart
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await axios.get(`http://localhost:5000/api/products/${id}`);
  return {
    props: {
      product: res.data,
    },
  };
};

export default ProductPage;