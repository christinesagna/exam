import BuyerRoute from './BuyerRoute';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import MyOrdersPage from '../pages/buyer/MyOrdersPage';
import OrderDetailPage from '../pages/buyer/OrderDetailPage';

export const sprint3BuyerRoutes = {
  path: '/buyer',
  element: <BuyerRoute />,
  children: [
    { path: 'cart', element: <CartPage /> },
    { path: 'checkout', element: <CheckoutPage /> },
    { path: 'orders', element: <MyOrdersPage /> },
    { path: 'orders/:orderId', element: <OrderDetailPage /> },
  ],
};
