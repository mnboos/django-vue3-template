<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const activeTab = ref("");
const authStore = useAuthStore();

console.log("App setting up...");
console.log(`Mode: ${import.meta.env.MODE}`);
console.log(`Title: ${import.meta.env.VITE_APP_TITLE}`);
document.title = import.meta.env.VITE_APP_TITLE;
</script>

<template>
    <q-layout view="hHh lpR fFf" class="fit">
        <q-header elevated class="bg-primary text-white print-hide" height-hint="98">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>
                    Django-Vue3-Template
                </q-toolbar-title>
            </q-toolbar>

            <q-tabs active-class="tab-active" indicator-color="transparent">
                <q-route-tab class="tab-min-width" @click="activeTab = 'home'" to="/" label="Home" icon="home" />
                <q-route-tab class="tab-min-width" @click="activeTab = 'about'" to="/about" label="About" icon="info" />

                <q-space />
                <q-route-tab
                    v-if="!authStore.isAuthenticated"
                    @click="activeTab = 'login'"
                    to="/login"
                    label="Anmelden"
                    icon="login"
                />
                <q-route-tab
                    id="menuLogout"
                    v-if="authStore.isAuthenticated"
                    @click="authStore.logout()"
                    to="/login"
                    label="Abmelden"
                    icon="logout"
                />
            </q-tabs>
        </q-header>

        <q-page-container class="wrapper fit">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<style>
/*noinspection CssUnknownTarget*/
@import "@/assets/base.css";

.tab-active {
    background-color: var(--q-info);
    border-radius: unset;
    color: white;
}
.button-tab-active {
    background-color: var(--q-info);
    color: white;
    border-radius: unset;
}

.sharp-edges {
    border-radius: unset;
}
.button-min-width {
    min-width: 175px;
}

.tab-min-width {
    min-width: 140px;
}
.background-color--hover:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
}

#app {
    /*max-width: 1280px;*/
    margin: 0 auto;
    /*padding: 2rem;*/

    font-weight: normal;
}

header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

a,
.green {
    text-decoration: none;
    color: hsla(160, 100%, 37%, 1);
    transition: 0.4s;
}

@media (hover: hover) {
    a:hover {
        background-color: hsla(160, 100%, 37%, 0.2);
    }
    span.q-focus-helper :hover {
        background-color: hsla(160, 100%, 37%, 0.2);
    }
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    /*display: inline-block;*/
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    body {
        display: flex;
        place-items: center;
    }

    #app {
        /*display: grid;*/
        /*grid-template-columns: 1fr 1fr;*/
        /*padding: 0 2rem;*/
    }

    header {
        /*display: flex;*/
        place-items: center;
        /*padding-right: calc(var(--section-gap) / 2);*/
    }
}

/*    header {*/
/*        !*display: flex;*!*/
/*        place-items: center;*/
/*        padding-right: calc(var(--section-gap) / 2);*/
/*    }*/

/*    header .wrapper {*/
/*        display: flex;*/
/*        place-items: flex-start;*/
/*        flex-wrap: wrap;*/
/*    }*/

/*    .logo {*/
/*        margin: 0 2rem 0 0;*/
/*    }*/

/*    nav {*/
/*        text-align: left;*/
/*        margin-left: -1rem;*/
/*        font-size: 1rem;*/

/*        padding: 1rem 0;*/
/*        margin-top: 1rem;*/
/*    }*/
/*}*/
</style>
