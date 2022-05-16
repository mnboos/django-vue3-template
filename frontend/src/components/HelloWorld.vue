<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useCounterStore } from "@/stores/counter";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useDummyStore } from "@/stores/dummy";

interface Props {
    msg?: string;
}

const props = withDefaults(defineProps<Props>(), { msg: "This is a default value" });

const { msg } = toRefs(props);

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
    counterStore.fetchUsers();
}

function undetailedPost() {
    dummyStore.undetailedPost();
}

const tripleCount = computed(() => counterStore.counter * 2);
</script>

<template>
    <div class="greetings">
        <h1 class="green">{{ msg }}</h1>
        <div>Count from getter: {{ counterStore.count }}</div>
        <div>Count from state: {{ counterStore.counter }}</div>
        <div>Triple count from computed: {{ tripleCount }}</div>
        <div>Users: {{ users }}</div>
        <div>Msg Prop: {{ msg }}</div>
        <div>Route: {{ route.fullPath }}</div>
        <button @click="increase">increase</button>
        <button @click="getusers">getusers</button>
        <button @click="undetailedPost">undetailed_post</button>
        <button v-if="isAuthenticated" @click="authStore.logout()">logout</button>
        <button v-if="!isAuthenticated" @click="redirectToLogin">login</button>

        <h3>Authenticated: {{ isAuthenticated }}</h3>
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
