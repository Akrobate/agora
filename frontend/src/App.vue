<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
  }),
  computed: {
    layout() {
      return (this.$route.meta.layout || 'AppLayout')
    }
  },
};
</script>
