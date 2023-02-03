import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            meta: { requiresAuth: false },
            component: () => import("../components/NotFound.vue"),
        },
        {
            path: "/",
            name: "home",
            component: () => import("../views/HomeView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/about",
            name: "about",
            meta: { requiresAuth: false },
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/login",
            name: "login",
            meta: { requiresAuth: false },
            props: route => ({ redirectTo: route.query.redirectTo }),
            component: () => import("../views/LoginView.vue"),
        },
    ],
});
router.beforeEach(async to => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isInitialized) {
        await authStore.initialize();
        if (!authStore.isAuthenticated) {
            return {
                name: "login",
                query: {
                    redirectTo: to.fullPath,
                },
            };
        }
    }
});
router.afterEach(async to => {
    const authStore = useAuthStore();
    if (!authStore.isInitialized) {
        await authStore.initialize();
    }
});

export default router;
