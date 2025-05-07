import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { user} = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace('/login');
      }
    }, [user, router]);

    if (!user) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
