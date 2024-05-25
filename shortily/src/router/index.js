import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Dashboard from "../components/Dashboard.vue";
import LinkRedirect from "../components/LinkRedirect.vue"; // Importa la vista para redirigir los enlaces cortos

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/r/:shortUrl", component: LinkRedirect }, // Ruta para redirigir los enlaces cortos
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("token");

  if (to.path === "/" || to.path === "/register") {
    // Permitir acceso a las rutas de login y register
    if (isLoggedIn) {
      // Si el usuario está logueado, redirigir al dashboard
      next("/dashboard");
    } else {
      next();
    }
  } else if (!isLoggedIn) {
    // Redirigir a la página de login si no está logueado
    next("/");
  } else {
    // Permitir acceso a las demás rutas
    next();
  }
});

export default router;
