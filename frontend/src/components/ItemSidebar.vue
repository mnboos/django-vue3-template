<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, toRefs, watch } from "vue";
import _ from "lodash";

interface Item {
    id: number;
}

const props = defineProps<{
    title: string;
    items: Item[];
    selectedItem?: Item;
    displayProperty: string | (<T extends Item>(obj: T) => string);
}>();

const { title, items, selectedItem, displayProperty } = toRefs(props);

const router = useRouter();
const route = useRoute();

const selectedItemInternal = ref(selectedItem?.value);

const emit = defineEmits<{
    (event: "change:selection", item: object): void;
    (event: "add:new"): void;
}>();

function changeSelection(item: Item) {
    emit("change:selection", item);
}

if (selectedItem?.value) {
    watch(selectedItem, newSelectedItem => (selectedItemInternal.value = newSelectedItem));
}

function isSelected(item: Item) {
    return item.id === selectedItemInternal.value?.id;
}
</script>
<template>
    <q-drawer position="" show-if-above side="left" behavior="desktop" bordered>
        <q-list>
            <q-item>
                <q-item-label class="text-h5">{{ title }}</q-item-label>
            </q-item>
            <q-separator />
            <q-item
                clickable
                v-for="item in items"
                :key="item.id"
                @click="changeSelection(item)"
                :focused="isSelected(item)"
            >
                <q-item-section>
                    {{ _.isFunction(displayProperty) ? displayProperty(item) : item[displayProperty] }}
                </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
                <q-item-section>
                    <q-btn flat icon="add" color="primary" @click="emit('add:new')">Hinzufügen</q-btn>
                </q-item-section></q-item
            >
        </q-list>
    </q-drawer>
</template>
<!-----------------CSS-------------------------------->
<style scoped></style>
