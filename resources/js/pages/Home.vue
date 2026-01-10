<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { HomeController } from '@/controllers';
</script>

<template>
    <Head title="Home" />
    <Link :href="HomeController.show().url">Home</Link>
</template>
