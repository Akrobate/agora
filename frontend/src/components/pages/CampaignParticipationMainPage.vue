<template>
    <v-container>
        <h1 class="text-h5 mt-8">{{ campaign_title }}</h1>

        <v-card class="elevation-6 mt-8">
            <v-card-text>
                {{campaign_description}}
            </v-card-text>
        </v-card>

        <proposition-manual-sort-element :campaign_id="campaign_id" />

        <v-row class="my-10">
            <v-col cols="6" align="center">
                <v-btn
                    class="mt-3"
                    color="primary"
                    :to="{ name: 'campaign-participate', params: { campaign_id: campaign_id } }"
                    large
                >
                    Valider mon classement
                </v-btn>
            </v-col>
            <v-col cols="6" align="center">
                <v-btn
                    class="mt-3"
                    color="primary"
                    :to="{ name: 'campaign-elo-game', params: { campaign_id: campaign_id } }"
                    large
                >
                    <v-icon class="mr-3">
                        mdi-play-circle
                    </v-icon>
                    Lancer le classement ELO
                </v-btn>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>

import { mapActions } from 'vuex'

import PropositionManualSortElement from '@/components/elements/proposition/PropositionManualSortElement'

export default {
    props: {
        campaign_id: Number,
    },
    components: {
        PropositionManualSortElement,
    },
    data() {
        return {
            campaign_title: null,
            campaign_description: null,
        }
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign_store/getCampaign',
        }),
    },
    async mounted() {
        const campaign = await this.getCampaign({
            campaign_id: this.campaign_id
        })
        this.campaign_id = campaign.id
        this.campaign_title = campaign.title
        this.campaign_description = campaign.description

    }
}
</script>