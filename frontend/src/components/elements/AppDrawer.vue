<template>
    <v-navigation-drawer
        app
        :clipped="$vuetify.breakpoint.lgAndUp"
        :value="isOpenedDrawer"
        @input="setOpenedDrawer"
    >


        <v-list dense nav>
            <v-list-item
                link
                :to="{ name: 'home' }"
                :exact="true"
            >
                <v-list-item-icon>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ $t('dashboard_link_label') }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>



        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    {{ $t('campaign_section_title') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ $t('campaign_section_subtitle') }}
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
                    {{ $t('user_section_title') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ $t('user_section_subtitle') }}
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
            <v-list-item
                link
                :to="{'name': 'user-profile'}"
                :exact="true"
            >
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>
                        {{ $t('user_profile_link_label') }}
                    </v-list-item-title>
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
                    <v-list-item-title>
                        {{ $t('logout') }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            items: [
                {
                    title: this.$t('campaign_create_link_label'),
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
                    title: this.$t('campaign_draft_link_label'),
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
                    title: this.$t('campaign_in_progress_link_label'),
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
                    title: this.$t('campaign_finished_link_label'),
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
        }
    },
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


<i18n locale='fr'>
{
    "dashboard_label": "Tableau de bord",
    "logout": "Déconnection",
    "dashboard_link_label": "Tableau de bord",
    "campaign_section_title": "Campagnes",
    "campaign_section_subtitle": "gestion campagnes",
    "campaign_create_link_label": "Créer",
    "campaign_draft_link_label": "Brouillons",
    "campaign_in_progress_link_label": "En cours",
    "campaign_finished_link_label": "Terminées",
    "user_section_title": "Utilisateur",
    "user_section_subtitle": "Paramètres",
    "user_profile_link_label": "Profil"
}
</i18n>