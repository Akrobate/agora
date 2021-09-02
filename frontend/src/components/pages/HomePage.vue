<template>
    <v-container>

        <h1 v-if="display_managed_campaigns" class="text-h5 mt-8">Les campagnes récentes que vous géréz</h1>
        <v-row class="my-4" v-if="display_managed_campaigns">
            <v-col>
                <v-card>
                    <v-card-title>
                        Participation
                    </v-card-title>
                    <v-card-subtitle>
                        Membres ayant répondu
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row align="center">
                            <v-col class="col-5" align="center">
                            <v-progress-circular
                                :rotate="90"
                                :size="100"
                                :width="15"
                                :value="participation_count / participant_total_count * 100"
                                color="green"
                                >
                                {{ Math.ceil(participation_count / participant_total_count * 100) }}%
                            </v-progress-circular>
                            </v-col>
                            <v-col align="center">
                                    <p>
                                        {{ participant_total_count }} participants au total
                                    </p>
                                    <p>
                                        {{ participation_count }} ont participé
                                    </p>
                                    <p>
                                        {{ participant_total_count - participation_count}} pas participé
                                    </p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        
        <h1 class="text-h5 mt-8">Vos votes attendus sur les campagnes</h1>


        <v-row class="my-4">
            <v-col
                v-for="campaign in campaignInProgressList.slice(0, 3)"
                :key="campaign.id"
            >
                <v-card class="fill-height d-flex flex-column">
                    <v-card-title>
                        {{ campaign.title }}
                    </v-card-title>
                    <v-card-subtitle>
                        Campagne
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
                            Participer
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'HomePage',
    data: () => ({
        display_managed_campaigns: false,
    }),
    computed: {
        ...mapGetters({
            campaignInProgressList: 'campaign_store/campaignInProgressList',
        })
    },
    methods: {
        ...mapActions({
            loadCampaigns: 'campaign_store/loadCampaigns',
        })
    },
    mounted() {
        this.loadCampaigns({ list_to_update: 'in_progress' })
    }

}
</script>
