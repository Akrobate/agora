<template>
<v-container>

    <v-row class="my-8">
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
        <v-col>
            <v-card>
                <v-card-title>
                    Invitations
                </v-card-title>
                <v-card-subtitle>
                    Membres invités
                </v-card-subtitle>
                <v-card-text>
                    <v-row align="center">
                        <v-col class="col-5" align="center">
                        <v-progress-circular
                            :rotate="90"
                            :size="100"
                            :width="15"
                            :value="invited_count / participant_total_count * 100"
                            color="blue"
                            >
                            {{ Math.ceil(invited_count / participant_total_count * 100) }}%
                        </v-progress-circular>
                        </v-col>
                        <v-col align="center">
                                <p>
                                    {{ participant_total_count }} participants
                                </p>
                                <p>
                                    {{ invited_count }} ont été invités
                                </p>
                                <p>
                                    {{ participant_total_count - invited_count}} pas invité
                                </p>
                        </v-col>

                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>

        <v-col>
            <v-card>
                <v-card-title>
                    Autres membres
                </v-card-title>
                <v-card-subtitle>
                    Membres exclus de la participation
                </v-card-subtitle>
                <v-card-text>
                    <v-row align="center">
                        <v-col class="col-5" align="center">
                        <v-progress-circular
                            :rotate="90"
                            :size="100"
                            :width="15"
                            :value="(total_members_count - participant_total_count) / total_members_count * 100"
                            color="black"
                            >
                            {{ Math.ceil((total_members_count - participant_total_count) / total_members_count * 100) }}%
                        </v-progress-circular>
                        </v-col>
                        <v-col align="center">
                                <p>
                                    {{ total_members_count }} membres au total
                                </p>
                                <p>
                                    {{ total_members_count - participant_total_count }} non participants
                                </p>
                                <p>
                                    {{ participant_total_count }} participants
                                </p>
                        </v-col>

                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="campaignUserList"
        hide-default-footer
        class="elevation-1"
    >

        <template v-slot:[`item.access_level`]="{ item }">
            <v-chip
                v-if="item.access_level === 2"
                class="ma-2"
                color="blue darken-1"
                outlined
                small
            >
                Observateur
            </v-chip>

            <v-chip
                v-if="item.access_level === 3"
                class="ma-2"
                color="red"
                text-color="white"
                small
            >
                Manager
            </v-chip>
        </template>

        <template v-slot:[`item.is_participant`]="{ item }">
            <v-chip
                v-if="item.is_participant === true"
                class="ma-2"
                color="blue"
                outlined
                small
            >
                Participant
            </v-chip>
        </template>

        <template v-slot:no-data>
            <v-btn
                color="primary"
                @click="initialize"
            >
                Actualiser
            </v-btn>
        </template>
    </v-data-table>


</v-container>
</template>

<script>
import {
    CAMPAIGN_USER_STATUS,
} from '@/constants'

import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'CampaignResultParticipation',
    props: [
        'campaign_id',
    ],
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Email',
                align: 'start',
                value: 'email',
            },
            {
                text: 'Participant',
                value: 'is_participant',
                sortable: true,
            },
            {
                text: 'Niveau de privilège',
                value: 'access_level',
                sortable: true,
            },
        ],
    }),
    computed: {
        ...mapGetters({
            campaignUserList: 'campaign_store/campaignUserList',
        }),

        participation_rate() {
            return 1
        },
        participant_total_count() {
            return this.campaignUserList.filter((campaign_user) => campaign_user.is_participant).length
        },
        participation_count() {
            return this.campaignUserList
                .filter((campaign_user) => campaign_user.user_status_list.map((status) => status.status_id).includes(CAMPAIGN_USER_STATUS.RESULT_SUBMITED))
                .length
        },
        invited_count() {
            return this.campaignUserList
                .filter((campaign_user) => campaign_user.user_status_list.map((status) => status.status_id).includes(CAMPAIGN_USER_STATUS.INVITED))
                .length
        },
        total_members_count() {
            return this.campaignUserList.length
        }
    },
    watch: {
        campaign_id () {
            this.initialize()
        }
    },
    mounted () {
        this.initialize()
    },
    methods: {
        ...mapActions({
            loadCampaignUserList: 'campaign_store/loadCampaignUserList',
            clearCampaignUserList: 'campaign_store/clearCampaignUserList',
        }),
        initialize () {
            if (this.campaign_id) {
                this.loadCampaignUserList({ campaign_id: this.campaign_id });
            } else {
                this.clearCampaignUserList()
            }
        },

    },
  }
</script>