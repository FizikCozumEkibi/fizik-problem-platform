import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    
    // Check expiry
    if (user.expiryDate && new Date(user.expiryDate) < new Date()) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      return <Navigate to="/login" replace />;
    }

    // Check status
    if (user.status === 'blocked') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    return <Navigate to="/login" replace />;
  }
}
