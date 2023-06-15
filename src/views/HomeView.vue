<template>
  <div class="home">
    <img alt="Vue logo" src="" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
</script>
