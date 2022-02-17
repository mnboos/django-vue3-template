<script setup lang="ts">
import { ref } from "vue";
import { useCounterStore } from "@/stores/counter";

const props =  defineProps<{
  msg: string;
}>();

const bla = ref(props.msg)

const store = useCounterStore();

function increase() {
  store.increment();
}

function getusers() {
  store.getUsers();
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h2>Count: {{store.count}}</h2>
    <h2>Users: {{store.users}}</h2>
    <button @click="increase" >increase</button>
    <button @click="getusers" >getusers</button>

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
