<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
    msg?: string;
}

const props = withDefaults(defineProps<Props>(), { msg: "This message is the default value of this component" });
const { msg } = toRefs(props);
</script>

<template>
    <span class="green">{{ msg }}</span>
</template>

<style scoped></style>
