<template>
    <div v-if="visible">
        <h1 class="text-h5 mt-8">{{ $t('managed_campaigns_title') }}</h1>
        <v-row class="my-4">
            <v-col
                v-for="campaign in campaign_list.slice(0, max_cards_count)"
                :key="campaign.id"
            >
                <v-card>
                    <v-card-title>
                        {{ campaign.title }}
                        <v-spacer />
                        <v-menu
                            bottom
                            left
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list dense>
                                <v-list-item
                                    link
                                    :to="{ name: 'campaign-result', params: { campaign_id: campaign.id } }"
                                >
                                    <v-list-item-icon class="mr-4">
                                        <v-icon>mdi-format-list-bulleted-square</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ $t('more_button') }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item
                                    link
                                    :to="{ name: 'campaign-edit', params: { id: campaign.id } }"
                                >
                                    <v-list-item-icon class="mr-4">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ $t('edit_button') }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card-title>
                    <v-card-subtitle v-if="campaign.campaign_status === CAMPAIGN_STATUS.FINISHED">
                        {{ $t('finished') }} {{ campaign.end_date | humanizeDate }}
                    </v-card-subtitle>
                    <v-card-subtitle v-else >
                        {{ $t('in_progress') }} ({{ $t('remaining') }} {{ campaign.end_date | humanizeFutureDuration }})
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row>
                            <v-col class="col-5">
                            <v-progress-circular
                                :rotate="90"
                                :size="100"
                                :width="15"
                                :value="calculatePercentage(campaign.users.participation_count, campaign.users.participant_total_count)"
                                color="green"
                                >
                                {{ Math.ceil(calculatePercentage(campaign.users.participation_count, campaign.users.participant_total_count)) }}%
                            </v-progress-circular>
                            </v-col>
                            <v-col>
                                    <p>
                                        {{ campaign.users.participant_total_count }} {{ $('total_members') }}
                                    </p>
                                    <p>
                                        {{ campaign.users.participation_count }} {{ $t('has_participated') }}
                                    </p>
                                    <p>
                                        {{ campaign.users.participant_total_count - campaign.users.participation_count}} {{ $t('not_participated') }}
                                    </p>
                            </v-col>
                        </v-row>
                    </v-card-text>
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
        }),
        calculatePercentage(value, total_value) {
            if (value == 0 || total_value == 0) {
                return 0
            }
            return value / total_value * 100
        },
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
    "managed_campaigns_title": "Les campagnes récentes que vous gérez",
    "more_button": "Résultats détaillés",
    "edit_button": "Modifier",
    "finished": "Terminée",
    "in_progress": "En cours",
    "remaining": "il reste",
    "total_members": "participants au total",
    "has_participated": "ont participé",
    "not_participated": "pas participé"
}
</i18n>
