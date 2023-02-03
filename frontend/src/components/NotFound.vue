<template>
    <div class="error-page">
        <h1>404</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <router-link to="/">Go back to the homepage</router-link>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from "vue";

onMounted(() => {
    console.log("mounted NotFound");
});
</script>

<style scoped>
.error-page {
    text-align: center;
}
h1 {
    font-size: 10rem;
}
</style>
