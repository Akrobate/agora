<template>
    <div v-if="visible">
        <h1 class="text-h5 mt-8">Les campagnes récentes que vous géréz</h1>
        <v-row class="my-4">
            <v-col
                v-for="campaign in campaign_list.slice(0, max_cards_count)"
                :key="campaign.id"
            >
                <v-card>
                    <v-card-title>
                        {{ campaign.title }}
                    </v-card-title>
                    <v-card-subtitle v-if="campaign.campaign_status === CAMPAIGN_STATUS.FINISHED">
                        Terminée {{ campaign.end_date | humanizeDate }}
                    </v-card-subtitle>
                    <v-card-subtitle v-else >
                        En cours (il reste {{ campaign.end_date | humanizeFutureDuration }})
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row align="center">
                            <v-col class="col-5" align="center">
                            <v-progress-circular
                                :rotate="90"
                                :size="100"
                                :width="15"
                                :value="campaign.users.participation_count / campaign.users.participant_total_count * 100"
                                color="green"
                                >
                                {{ Math.ceil(campaign.users.participation_count / campaign.users.participant_total_count * 100) }}%
                            </v-progress-circular>
                            </v-col>
                            <v-col align="center">
                                    <p>
                                        {{ campaign.users.participant_total_count }} participants au total
                                    </p>
                                    <p>
                                        {{ campaign.users.participation_count }} ont participé
                                    </p>
                                    <p>
                                        {{ campaign.users.participant_total_count - campaign.users.participation_count}} pas participé
                                    </p>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                            text
                            :to="{ name: 'campaign-edit', params: { id: campaign.id } }"
                        >
                            <v-icon class="mr-2">mdi-pencil</v-icon>
                            Editer
                        </v-btn>
                        <v-btn 
                            text
                            :to="{ name: 'campaign-result', params: { campaign_id: campaign.id } }"
                        >
                            <v-icon class="mr-2">mdi-format-list-bulleted-square</v-icon>
                            {{ $t('more_button') }}
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
    USER_ACCESS_LEVEL,
    CAMPAIGN_USER_STATUS,
} from '@/constants'
export default {
    name: 'ManagedCampaignsElement',
    data: () => ({
        visible: true,
        campaign_list: [],
        max_cards_count: 3,
        CAMPAIGN_STATUS,
    }),
    methods: {
        ...mapActions({
            searchCampaign: 'campaign_store/searchCampaign',
            searchCampaignUserList: 'campaign_store/searchCampaignUserList',
        })
    },
    async mounted() {
        const all_campaign_list = await this.searchCampaign({
            campaign_status_list: [
                CAMPAIGN_STATUS.IN_PROGRESS,
                CAMPAIGN_STATUS.FINISHED,
            ],
            sort_list: ['-end_date']
        })

        const managed_campaign_list = all_campaign_list
            .filter((campaign) => campaign.user_access_level === USER_ACCESS_LEVEL.MANAGER)
            .slice(0, this.max_cards_count)


        for (const campaign of managed_campaign_list) {
            const user_list = await this.searchCampaignUserList({campaign_id: campaign.id})
            campaign.users = {
                participant_total_count: user_list.filter((user) => user.is_participant).length,
                participation_count: user_list.filter(
                    (user) => user.user_status_list.map((user_status) => user_status.status_id).includes(CAMPAIGN_USER_STATUS.RESULT_SUBMITED),
                ).length,
            }
        }

        this.campaign_list = managed_campaign_list
        this.visible = (this.campaign_list.length > 0)
    }
}
</script>


<i18n locale="fr">
{
    "more_button": "Résultats détaillés"
}
</i18n>