<script setup lang="ts"></script>

<template>
    <main>
        <q-drawer show-if-above side="left" behavior="desktop" bordered>
            <RouterLink to="/" class="q-ml-sm">Home</RouterLink> <br />
            <RouterLink to="/login" class="q-ml-sm">Login</RouterLink> <br />
            <RouterLink to="/about" class="q-ml-sm">About</RouterLink> <br />
        </q-drawer>
    </main>
</template>
