<template>
  <v-app>
    <app-bar />
    <app-drawer />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/elements/AppBar';
import AppDrawer from '@/components/elements/AppDrawer';

export default {
  components: {
    AppBar,
    AppDrawer,
  },
};
</script>
