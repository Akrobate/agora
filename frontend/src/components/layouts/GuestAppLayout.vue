<template>
    <v-app>
        <guest-app-bar />
        <v-main>
            <slot />
        </v-main>
        <snack-bar />
    </v-app>
</template>

<script>
import GuestAppBar from '@/components/elements/GuestAppBar';
import SnackBar from '@/components/elements/SnackBar';

export default {
    components: {
        GuestAppBar,
        SnackBar,
    },
};

</script>