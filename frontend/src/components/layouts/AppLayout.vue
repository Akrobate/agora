<template>
  <v-app>
    <app-bar />
    <app-drawer />
    <v-main>
      <slot />
    </v-main>
    <snack-bar />
  </v-app>
</template>

<script>
import AppBar from '@/components/elements/AppBar';
import AppDrawer from '@/components/elements/AppDrawer';
import SnackBar from '@/components/elements/SnackBar';

export default {
  components: {
    AppBar,
    AppDrawer,
    SnackBar,
  },
  mounted() {
  },
};
</script>
