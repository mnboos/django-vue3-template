<script setup lang="ts">
import { ref } from "vue";
import { useCounterStore } from "@/stores/counter";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useDummyStore } from "@/stores/dummy";

const props = defineProps<{
    msg: string;
}>();

class Foobar {
    readonly authStore = useAuthStore();
    readonly counterStore = useCounterStore();
}

const foobar = new Foobar();

const referencedMsgProperty = ref(props.msg);

const counterStore = useCounterStore();
const authStore = useAuthStore();
const dummyStore = useDummyStore();

const router = useRouter();
const route = useRoute();

const { isAuthenticated } = storeToRefs(authStore);
const { users } = storeToRefs(counterStore);

function increase() {
    counterStore.increment();
}

function redirectToLogin() {
    router.push("login");
}

function getusers() {
    foobar.counterStore.getUsers();
}

function undetailedPost() {
    dummyStore.undetailedPost();
}
</script>

<template>
    <div class="greetings">
        <h1 class="green">{{ msg }}</h1>
        <h2>Count: {{ counterStore.count }}</h2>
        <h2>Count: {{ counterStore.counter }}</h2>
        <h2>Count: {{ counterStore.users }}</h2>
        <h2>Count: {{ foobar.counterStore.count }}</h2>
        <h2>Users: {{ users }}</h2>
        <h3>Referenced Msg Prop: {{ referencedMsgProperty }}</h3>
        <h3>Route: {{ route.fullPath }}</h3>
        <button @click="increase">increase</button>
        <button @click="getusers">getusers</button>
        <button @click="undetailedPost">undetailed_post</button>
        <button v-if="isAuthenticated" @click="authStore.logout()">logout</button>
        <button v-if="!isAuthenticated" @click="redirectToLogin">login</button>

        <h3>Authenticated: {{ isAuthenticated }}</h3>
        <h3>
            You’ve successfully created a project with
            <a target="_blank" href="https://vitejs.dev/">Vite</a> +
            <a target="_blank" href="https://vuejs.org/">Vue 3</a>. What's next?
        </h3>
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}
</style>
