<template>
    <div v-if="visible">
        
        <h1 class="text-h5 mt-8">{{ $t('expected_votes_title') }}</h1>

        <v-row class="my-4">
            <v-col
                v-for="campaign in campaign_list.slice(0, max_cards_count)"
                :key="campaign.id"
            >
                <v-card class="fill-height d-flex flex-column">
                    <v-card-title>
                        {{ campaign.title }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ $t('card_generic_subtitle') }} {{ campaign.end_date | humanizeFutureDuration }}
                    </v-card-subtitle>
                    <v-card-text class="fill-height">
                        {{ campaign.description }}
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                            text
                            :to="{ name: 'campaign-participate', params: { campaign_id: campaign.id } }"
                        >
                            <v-icon class="mr-2" color="green">mdi-play-circle</v-icon>
                            {{ $t('participate_button') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>


    </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
    CAMPAIGN_STATUS,
} from '@/constants'
export default {
    name: 'ExpectedParticipationElement',
    data: () => ({
        campaign_list: [],
        display_managed_campaigns: true,
        visible: false,
        max_cards_count: 3,
    }),
    methods: {
        ...mapActions({
            searchCampaign: 'campaign_store/searchCampaign',
        })
    },
    async mounted() {
        this.campaign_list = await this.searchCampaign({ campaign_status_list: [CAMPAIGN_STATUS.IN_PROGRESS] })
        this.visible = (this.campaign_list.length > 0)
    }
}
</script>

<i18n locale="fr">
{
    "expected_votes_title": "Vos votes attendus sur les campagnes",
    "card_generic_subtitle": "Se termine dans",
    "participate_button": "Participer"
}
</i18n>

