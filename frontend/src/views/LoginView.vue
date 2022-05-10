<template>
    <div>
        <span class="text-h5">Login</span>

        <q-form ref="form">
            <q-input
                label="E-Mail"
                v-model="email"
                type="email"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'E-Mail is required']"
            />
            <q-input
                label="Password"
                v-model="password"
                :type="!showPassword ? 'password' : 'text'"
                :rules="[val => (val && val.length > 0) || 'Password is required']"
            >
                <template v-slot:append>
                    <q-icon
                        :name="!showPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="showPassword = !showPassword"
                    />
                </template>
            </q-input>
            <q-btn label="Login" class="q-mt-auto" color="primary" icon="login" @click="login" />
        </q-form>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();

type VForm = { validate: () => boolean };

const form = ref<VForm | null>(null);
const email = ref("admin");
const password = ref("");
const showPassword = ref(false);

const $q = useQuasar();

const props = defineProps({
    redirectTo: {
        type: String,
        default: "/",
    },
});

const { redirectTo } = toRefs(props);

console.log("login view props redirect to: ", redirectTo.value);

const router = useRouter();
const route = useRoute();

async function login() {
    const success = (await form.value?.validate()) || false;

    console.log("submit form: ", {
        success,
        email: email.value,
        password: password.value,
    });
    if (!success) {
        $q.notify({
            message: "Please enter a valid username/password combination",
            type: "negative",
        });
    } else {
        try {
            await authStore.login(email.value, password.value);
            $q.notify("Successfully logged in");

            await router.push(redirectTo.value);
        } catch (err) {
            console.error("Login failed: ", err);
            $q.notify({
                message: "Login failed",
                type: "negative",
            });
        }
    }
}
</script>

<style></style>
