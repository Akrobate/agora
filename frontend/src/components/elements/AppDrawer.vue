<template>
    <v-navigation-drawer
        app
        :clipped="$vuetify.breakpoint.lgAndUp"
        :value="isOpenedDrawer"
        @input="setOpenedDrawer"
    >
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Campagnes
                </v-list-item-title>
                <v-list-item-subtitle>
                    gestion campagnes
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                link
                :to="item.route"
                :exact="item.route_exact"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>


        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Utilisateur
                </v-list-item-title>
                <v-list-item-subtitle>
                    Paramètres
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
            <v-list-item
                link
                @click="logout"
            >
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Profil</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
                link
                @click="logout"
            >
                <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Déconnection</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    data: () => ({
        items: [
            {
                title: 'Créer',
                icon: 'mdi-text-box-plus-outline',
                route: {
                    name: 'campaign-create',
                    params: {
                        campaign_status: 'create',
                    },
                },
                route_exact: true,
            },
            {
                title: 'Brouillons',
                icon: 'mdi-file-document-edit-outline',
                route: {
                    name: 'campaign-list',
                    params: {
                        campaign_status: 'draft',
                    },
                },
                route_exact: true,
            },
            {
                title: 'En cours',
                icon: 'mdi-file-document-multiple-outline',
                route: {
                    name: 'campaign-list',
                    params: {
                        campaign_status: 'in-progress',
                    },
                },
                route_exact: true,
            },
            {
                title: 'Terminées',
                icon: 'mdi-text-box-check-outline',
                route: {
                    name: 'campaign-list',
                    params: {
                        campaign_status: 'finished',
                    },
                },
                route_exact: true,
            },
        ],
        right: null,
    }),
    mounted() {
        this.setOpenedDrawer(this.$vuetify.breakpoint.lgAndUp)
    },
    computed: {
        ...mapGetters({
            isOpenedDrawer: 'app_layout_store/isOpenedDrawer',
        }),
    },
    methods: {
        ...mapActions({
            setOpenedDrawer: 'app_layout_store/setOpenedDrawer',
            Authenticationlogout: 'authentication_store/logout'
        }),
        logout() {
            this.Authenticationlogout();
            this.$router.push({name: 'login'});
        },
    },
}

</script>
