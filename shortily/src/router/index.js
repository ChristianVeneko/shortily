// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Dashboard from "../components/Dashboard.vue";
import Welcome from "../components/Welcome.vue";
import LinkRedirect from "../components/LinkRedirect.vue";

const routes = [
  { path: "/", component: Welcome },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/r/:shortUrl", component: LinkRedirect },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("token");

  // Si la ruta es para redirigir a un enlace acortado, permitir el acceso sin autenticación
  if (to.path.startsWith("/r/")) {
    next();
    return;
  }

  // Si el usuario está intentando acceder a la página de inicio de sesión o registro
  if (to.path === "/login" || to.path === "/register") {
    // Si ya está logueado, redirigir al dashboard
    if (isLoggedIn) {
      next("/dashboard");
    } else {
      next(); // Permitir acceso a las rutas de login y register
    }
  } else if (isLoggedIn && to.path === "/") {
    // Si el usuario está logueado y está en la página de inicio, redirigir al dashboard
    next("/dashboard");
  } else if (!isLoggedIn && to.path !== "/") {
    // Redirigir a la página de login si no está logueado y no está intentando acceder a la página de inicio
    next("/");
  } else {
    // Permitir acceso a otras rutas si el usuario está logueado o si está en la página de inicio
    next();
  }
});

export default router;
