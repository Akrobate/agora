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
            console.log('this.token_datathis.token_datathis.token_datathis.token_data', this.token_data)
            if (this.token_data.access_type === 'guest') {
                return 'DefaultLayout'
            }
            return (this.$route.meta.layout || 'AppLayout')
        }
    },
};
</script>
