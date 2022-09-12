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
                {{ $t('agora_app_title') }}
            </span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon :to="{ name: 'about'}">
            <v-icon>mdi-information</v-icon>
        </v-btn>

        <v-btn icon :to="{ name: 'about'}">
            <v-icon>mdi-cog</v-icon>
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
        }),
        toggleDrawerState() {
            this.setOpenedDrawer(!this.isOpenedDrawer)
        },
    },
    computed: {
        ...mapGetters({
            isOpenedDrawer: 'app_layout_store/isOpenedDrawer',
        }),
    }
}
</script>

<i18n locale='french'>
{
    "agora_app_title": "Agora"
}
</i18n>
