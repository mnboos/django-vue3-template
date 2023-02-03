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
        // {
        //     path: "/helloworld",
        //     name: "helloworld",
        //     meta: { requiresAuth: true },
        //     // route level code-splitting
        //     // this generates a separate chunk (About.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import("../components/HelloWorld.vue"),
        // },
        {
            path: "/about",
            name: "about",
            meta: { requiresAuth: false },
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/login",
            name: "login",
            meta: { requiresAuth: false },
            props: route => ({ redirectTo: route.query.redirectTo }),
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
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
