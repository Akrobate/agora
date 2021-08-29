<template>
    <component :is="layout">
        <router-view></router-view>
    </component>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
    name: 'App',
    data: () => ({
    }),
    computed: {
        ...mapGetters({
            token_data: 'authentication_store/tokenData',
        }),
        layout() {
            if (this.$route.meta.public === true) {
                return 'DefaultLayout'
            }
            if (this.token_data.access_type === 'guest') {
                return 'GuestAppLayout'
            }
            return (this.$route.meta.layout || 'AppLayout')
        }
    }
};
</script>
