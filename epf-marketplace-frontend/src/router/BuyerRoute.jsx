import { Navigate, Outlet, useLocation } from 'react-router-dom';

function readUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function BuyerRoute() {
  const location = useLocation();
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  const user = readUser();
  const role = String(user?.role || '').toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && role !== 'buyer' && role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
