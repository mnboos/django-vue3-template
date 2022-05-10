import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/login",
            name: "login",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/LoginView.vue"),
        },
    ],
});
router.beforeEach(async to => {
    const authStore = useAuthStore();
    if (!authStore.isInitialized) {
        await authStore.initialize();
    }
    if (to.meta.requiresAuth && !authStore.isAuthenticated)
        return {
            name: "login",
            query: {
                redirectTo: to.fullPath,
            },
        };
});

export default router;
