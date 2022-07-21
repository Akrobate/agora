<template>
  <v-app>
    <v-main>
      <slot />
    </v-main>
    <snack-bar />
  </v-app>
</template>

<script>
import SnackBar from '@/components/elements/SnackBar';

export default {
    components: {
        SnackBar,
    },
};
</script>
