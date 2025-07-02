<script setup lang="ts">
import { Button } from "@hardimpactdev/liftoff-ui";
</script>

<template>
    <Head title="Home" />
    <Link :href="Controllers.HomeController.show()">Home</Link>

    <Button>Click me</Button>
</template>
