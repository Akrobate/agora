<template>
<v-container>

    <v-row class="my-8">
        <v-col>
            <v-card>
                <v-card-title>
                    {{ $t('participation_section_title') }}
                </v-card-title>
                <v-card-subtitle>
                    {{ $t('participation_section_subtitle') }}
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col class="col-5">
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
                        <v-col>
                                <p>
                                    {{ participant_total_count }} {{ $t('participants_total_statistic_label') }}
                                </p>
                                <p>
                                    {{ participation_count }} {{ $t('participated_statistic_label') }}
                                </p>
                                <p>
                                    {{ participant_total_count - participation_count}} {{ $t('not_participated_statistic_label') }}
                                </p>
                        </v-col>

                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>
        <v-col>
            <v-card>
                <v-card-title>
                    {{ $t('members_section_title') }}
                </v-card-title>
                <v-card-subtitle>
                    {{ $t('members_section_subtitle') }}
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col class="col-5">
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
                        <v-col>
                                <p>
                                    {{ participant_total_count }} {{ $t('participants_statistic_label') }}
                                </p>
                                <p>
                                    {{ invited_count }} {{ $t('has_been_invited_static_label') }}
                                </p>
                                <p>
                                    {{ participant_total_count - invited_count}} {{ $t('has_not_been_invited_static_label') }}
                                </p>
                        </v-col>

                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>

        <v-col>
            <v-card>
                <v-card-title>
                    {{ $t('other_members_section_title') }}
                </v-card-title>
                <v-card-subtitle>
                    {{ $t('other_members_section_subtitle') }}
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col class="col-5">
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
                        <v-col>
                                <p>
                                    {{ total_members_count }} {{ $t('total_members_statistic_label') }}
                                </p>
                                <p>
                                    {{ total_members_count - participant_total_count }} {{ $t('not_participants_statistic_label') }}
                                </p>
                                <p>
                                    {{ participant_total_count }} {{ $t('participants_statistic_label') }}
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
                v-if="item.access_level === USER_ACCESS_LEVEL.OBSERVER"
                class="ma-2"
                color="blue darken-1"
                outlined
                small
            >
                {{ $t('observer') }}
            </v-chip>

            <v-chip
                v-if="item.access_level === USER_ACCESS_LEVEL.MANAGER"
                class="ma-2"
                color="red"
                text-color="white"
                small
            >
                {{ $t('manager') }}
            </v-chip>
        </template>

        <template v-slot:[`item.is_participant`]="{ item }">
            <v-chip
                v-if="item.is_participant"
                class="ma-2"
                color="blue"
                outlined
                small
            >
                {{ $t('participant') }}
            </v-chip>
        </template>

        <template v-slot:no-data>
            <v-btn
                color="primary"
                @click="initialize"
            >
                {{ $t('refresh_button') }}
            </v-btn>
        </template>
    </v-data-table>

</v-container>
</template>

<script>

import {
    CAMPAIGN_USER_STATUS,
    USER_ACCESS_LEVEL,
} from '@/constants'

import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'CampaignResultParticipation',
    props: [
        'campaign_id',
    ],
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
                {
                    text: this.$t('email_table_label'),
                    align: 'start',
                    value: 'email',
                },
                {
                    text: this.$t('participant_table_label'),
                    value: 'is_participant',
                    sortable: true,
                },
                {
                    text: this.$t('access_level_table_label'),
                    value: 'access_level',
                    sortable: true,
                },
            ],
            USER_ACCESS_LEVEL,
        }
    },
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

<i18n locale='fr'>
{
    "observer": "Observateur",
    "manager": "Manager",
    "participant": "Participant",
    "email_table_label": "Email",
    "participant_table_label": "Participant",
    "access_level_table_label": "Niveau de privilège",
    "participants_total_statistic_label": "participants au total",
    "participated_statistic_label": "ont participé",
    "not_participated_statistic_label": "pas participé",
    "participants_statistic_label": "participants",
    "not_participants_statistic_label": "non participant",
    "total_members_statistic_label": "membres au total",
    "has_been_invited_static_label": "ont été invités",
    "has_not_been_invited_static_label": "pas invité",
    "other_members_section_title": "Autres membres",
    "other_members_section_subtitle": "Membres exclus de la participation",
    "members_section_title": "Invitations",
    "members_section_subtitle": "Membres invités",
    "participation_section_title": "Participation",
    "participation_section_subtitle": "Membres ayant répondu",
    "refresh_button": "Actualiser"
}
</i18n>