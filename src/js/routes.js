
import HomePage from '../pages/home.jsx';
import FormPage from '../pages/form.jsx';


import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import NotFoundPage from '../pages/404.jsx';
import AggregatorProfile from '../pages/aggregatorProfile.jsx';
import SellToTDX from '../pages/sellToTDX.jsx';
import FarmerDetails from '../pages/farmerDetails.jsx';
import PaymentDetails from '../pages/paymentDetail.jsx';
import SaleComplete from '../pages/saleComplete.jsx';
import OrderStatus from '../pages/orderStatus.jsx';
import Login from '../pages/login.jsx';
import Dashboard from '../pages/dashboard.jsx';
import Signup from '../pages/signup.jsx';
import Farmers from '../pages/farmers.jsx';
import ForgotPassword from '../pages/forgotPassword.jsx';
import SyncData from '../pages/syncData.jsx';
import LoginPin from '../pages/loginPin.jsx';
import SetPin from '../pages/setPin.jsx';
import OfflineLogin from '../pages/offlineLogin.jsx';
import OfflineDashboard from '../pages/offlineDashboard.jsx';
import OfflineSellToTDX from '../pages/offlineSellToTDX.jsx';
import OfflineSaleComplete from '../pages/offlineSaleComplete.jsx';
import PendingTransactions from '../pages/pendingTransactions.jsx';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/sync-data/',
    component: SyncData,
  },
  {
    path: '/login-pin/',
    component: LoginPin,
  },
  {
    path: '/set-pin/',
    component: SetPin,
  },
  {
    path: '/login/',
    component: Login,
  },
  {
    path: '/signup/',
    component: Signup,
  },
  {
    path: '/forgot-password/',
    component: ForgotPassword,
  },
  {
    path: '/dashboard/',
    component: Dashboard,
  },
  {
    path: '/aggregator-profile/',
    component: AggregatorProfile,
  },
  {
    path: '/sell-to-tdx/',
    component: SellToTDX,
  },
  {
    path: '/enter-farmer-details/',
    component: FarmerDetails,
  },
  {
    path: '/payment-details/',
    component: PaymentDetails,
  },
  {
    path: '/sale-complete/',
    component: SaleComplete,
  },
  {
    path: '/order-status/',
    component: OrderStatus,
  },
  {
    path: '/pending-transactions/',
    component: PendingTransactions,
  },
  {
    path: '/farmers/',
    component: Farmers,
  },
  {
    path: '/offline-login/',
    component: OfflineLogin,
  },
  {
    path: '/offline-dashboard/',
    component: OfflineDashboard,
  },
  {
    path: '/sell-to-tdx-offline/',
    component: OfflineSellToTDX,
  },
  {
    path: '/offline-sale-complete/',
    component: OfflineSaleComplete,
  },


  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
