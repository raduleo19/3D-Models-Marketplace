import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/views/LoginPage.vue'
import RegisterPage from '../components/views/RegisterPage.vue'
import ProductsPage from '../components/views/ProductsPage.vue'
import ProfilePage from '../components/views/ProfilePage.vue'
import CartPage from '../components/views/CartPage.vue'
import OrdersPage from '../components/views/OrdersPage.vue'
import PublishPage from '../components/views/PublishPage.vue'
import ProductDetailPage from '../components/views/ProductDetailPage.vue'
import HomePage from '../components/views/HomePage.vue'
import PublicationsPage from '../components/views/PublicationsPage.vue'
import BalancePage from '../components/views/BalancePage.vue'
import ForgotPasswordPage from '../components/views/ForgotPasswordPage.vue'

import { useUserStore } from '../stores/UserStore'
import jwt_decode from "jwt-decode";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage
    },
    {
      path: '/publish',
      name: 'publish',
      component: PublishPage
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetailPage
    },
    {
      path: '/publications',
      name: 'publications',
      component: PublicationsPage
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalancePage
    }
  ]
})

router.beforeEach(async (to) => {
  const protectedPages = ["/profile", "/cart", "/orders"];

  const authRequired = protectedPages.includes(to.path);
  const auth = useUserStore();

  if (authRequired) {
    if (!auth.token) {
      auth.returnUrl = to.fullPath;
      return '/login';
    } else {
      const jwtPayload = jwt_decode(auth.token);
      if (jwtPayload.exp < Date.now() / 1000) {
        auth.token = "";
        return '/login';
      }
    }
  }
});

export default router
