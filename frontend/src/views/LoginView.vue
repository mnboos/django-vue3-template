<template>
    <q-page class="row">
        <div class="self-center fit">
            <h5 class="text-center">Anmelden</h5>

            <q-form ref="form" autofocus class="row q-mx-md">
                <q-input
                    class="col-md-4 offset-md-4 col-xs-12"
                    label="E-Mail"
                    v-model="email"
                    type="email"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'E-Mail is required']"
                    @keyup.enter="passwordInput.focus()"
                />
                <q-space class="col-md-4 col-xs-0" />
                <q-input
                    class="col-md-4 offset-md-4 col-xs-12"
                    label="Passwort"
                    ref="passwordInput"
                    v-model="password"
                    :type="!showPassword ? 'password' : 'text'"
                    :rules="[val => (val && val.length > 0) || 'Password is required']"
                    @keyup.enter="login"
                >
                    <template v-slot:append>
                        <q-icon
                            :name="!showPassword ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="showPassword = !showPassword"
                        />
                    </template>
                </q-input>
                <div class="text-center col-md-4 offset-md-4 col-xs-12">
                    <q-btn
                        id="login"
                        label="Anmelden"
                        unelevated
                        class="q-mt-auto fit"
                        color="primary"
                        icon="login"
                        @click="login"
                        :disable="loggingIn"
                        :loading="loggingIn"
                    />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();

type VForm = { validate: () => boolean };

const passwordInput = ref(null);
const form = ref<VForm | null>(null);
const email = ref("admin");
const password = ref("");
const showPassword = ref(false);
const loggingIn = ref(false);

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
    const usernameAndPasswordEntered = (await form.value?.validate()) || false;

    if (!usernameAndPasswordEntered) {
        $q.notify({
            message: "Please enter a valid username/password combination",
            type: "negative",
        });
    } else {
        loggingIn.value = true;
        const loggedIn = await authStore.login(email.value, password.value);
        loggingIn.value = false;

        if (loggedIn) {
            $q.notify("Successfully logged in");
            await router.push(redirectTo.value);
        } else {
            $q.notify({
                message: "Login failed",
                type: "negative",
            });
        }
    }
}
</script>

<style></style>
