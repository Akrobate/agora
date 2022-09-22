<template>
    <v-app-bar
        app
        color="primary"
        dark
        :clipped-left="$vuetify.breakpoint.lgAndUp"
    >

        <v-app-bar-nav-icon @click.stop="toggleDrawerState()"></v-app-bar-nav-icon>

        <v-toolbar-title>
            <span>
                {{ $t('app_title') }}
            </span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :to="{ name: 'about'}">
            <v-icon>mdi-information</v-icon>
        </v-btn>

        <v-btn icon :to="{ name: 'user-profile'}">
            <avatar-element size='25' :email="email" />
        </v-btn>

        <v-btn icon @click="logout()">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import AvatarElement from '@/components/elements/user/AvatarElement'

export default {
    data: () => ({
        email: '',
    }),
    components: {
        AvatarElement,
    },
    mounted() {
        this.email = this.token_data.email
    },
    methods: {
        ...mapActions({
            setOpenedDrawer: 'app_layout_store/setOpenedDrawer',
            Authenticationlogout: 'authentication_store/logout',
        }),
        toggleDrawerState() {
            this.setOpenedDrawer(!this.isOpenedDrawer)
        },
        logout() {
            this.Authenticationlogout();
            this.$router.push({name: 'login'});
        },
    },
    computed: {
        ...mapGetters({
            isOpenedDrawer: 'app_layout_store/isOpenedDrawer',
            token_data: 'authentication_store/tokenData',
        }),
    },
}
</script>

<i18n locale='fr'>
{
    "app_title": "Agora"
}
</i18n>
