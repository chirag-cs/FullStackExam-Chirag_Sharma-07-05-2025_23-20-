import { useEffect, useState } from 'react';
import withAuth from '../lib/withAuth';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

function CartPage() {
  const { token } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const router = useRouter();

  const fetchCart = async () => {
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items);
    } catch (err : any) {
        if (err.response && err.response.data?.error) {
            setMessage(err.response.data.error);
            router.push('/login');
          } else {
            setMessage('An unknown error occurred');
          }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await axios.post(
        'http://localhost:5000/api/cart/remove',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders/checkout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Order placed successfully!');
      fetchCart(); 
    } catch (err) {
      console.error('Checkout error:', err);
      setMessage('Failed to place order.');
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);

    const goToHome = () => {
       router.push('/');
    };

  return (
    <div>

<button
        onClick={goToHome}
      >
        Go to Home
      </button>
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.productId._id}>
              <p>
                {item.productId.name} - {item.quantity} × ₹{item.productId.price}
              </p>
              <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ₹{totalPrice}</h3>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
      {message && <p>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CartPage;
