<template>
    <v-app-bar
        app
        color="white"
        
        :clipped-left="$vuetify.breakpoint.lgAndUp"
    >

        <v-icon class="mr-2">
            mdi-bank-outline
        </v-icon>

        <v-toolbar-title>
            <span>{{ $t('app_title') }}</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>


        <v-btn icon :to="{ name: 'about'}">
            <v-icon>mdi-information</v-icon>
        </v-btn>

        <v-btn icon :to="{ name: 'home'}">
            <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn icon @click="logout()">
            <v-icon>mdi-logout</v-icon>
        </v-btn>

    </v-app-bar>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    data: () => ({}),
    methods: {
        ...mapActions({
            setOpenedDrawer: 'app_layout_store/setOpenedDrawer',
            Authenticationlogout: 'authentication_store/logout',
        }),
        toggleDrawerState() {
            this.setOpenedDrawer(!this.isOpenedDrawer)
        },
        async logout() {
            await this.Authenticationlogout();
            this.$router.push({name: 'login'});
        },
    },
    computed: {
        ...mapGetters({
            isOpenedDrawer: 'app_layout_store/isOpenedDrawer',
        }),
    }
}
</script>

<i18n locale='fr'>
{
    "app_title": "Agora"
}
</i18n>