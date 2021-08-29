<template>
    <v-app>
        <guest-app-bar />
        <v-main>
            <slot />
        </v-main>
    </v-app>
</template>

<script>
import GuestAppBar from '@/components/elements/GuestAppBar';

export default {
    components: {
        GuestAppBar,
    },
};

</script>