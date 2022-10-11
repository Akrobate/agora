<template>
    <v-data-table
        :headers="headers"
        :items="campaignData"
        class="elevation-1"
        @click:row="clickOnRow"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>{{ list_title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    v-if="campaign_status === 'draft'"
                    color="primary"
                    dark
                    class="mb-2"
                    :to="{'name': 'campaign-create', params: { campaign_status: 'create'}}"
                    :exact="true"
                >
                    {{ $t('create_new_campaign_button') }}
                </v-btn>

                <v-dialog v-model="dialog_delete" max-width="400px">
                    <v-card>
                        <v-card-title class="headline">{{ $t('delete_campaign_modal_title') }}</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">{{ $t('cancel_button') }}</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t('yes_button') }}</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">

            <router-link
                v-if="item.user_is_participant && item.campaign_status === CAMPAIGN_STATUS.IN_PROGRESS"
                tag="span"
                style="cursor: pointer"
                :to="{ name: 'campaign-participate', params: { campaign_id: item.id } }"
            >
                <v-icon class="mr-2" color="green">mdi-play-circle</v-icon>
            </router-link>

            <router-link
                v-if="
                    item.user_is_participant
                    && [CAMPAIGN_STATUS.IN_PROGRESS, CAMPAIGN_STATUS.FINISHED].includes(item.campaign_status)
                    && (
                        item.user_access_level === USER_ACCESS_LEVEL.MANAGER
                        || item.user_access_level === USER_ACCESS_LEVEL.OBSERVER
                    )
                "
                tag="span"
                style="cursor: pointer"
                :to="{ name: 'campaign-result', params: { campaign_id: item.id } }"
            >
                <v-icon class="mr-2" >mdi-format-list-bulleted-square</v-icon>
            </router-link>

            <router-link
                v-if="
                    item.user_access_level === USER_ACCESS_LEVEL.MANAGER
                    && [CAMPAIGN_STATUS.IN_PROGRESS, CAMPAIGN_STATUS.DRAFT].includes(item.campaign_status)
                "
                tag="span"
                style="cursor: pointer"
                :to="{ name: 'campaign-edit', params: { id: item.id } }"
            >
                <v-icon class="mr-2" color="blue">mdi-pencil</v-icon>
            </router-link>

            <v-icon
                v-if="item.user_access_level === USER_ACCESS_LEVEL.MANAGER"
                color="red"
                @click="deleteItem(item.id)"
            >
                mdi-delete
            </v-icon>
        </template>


        <template v-slot:[`item.start`]="{ item }">
            {{item.start_date | formatDate}}
        </template>

        <template v-slot:[`item.end`]="{ item }">
            {{item.end_date | formatDate}}
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
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import { CAMPAIGN_STATUS, USER_ACCESS_LEVEL } from '@/constants'

  export default {
    name: 'CampaignListElement',
    props: [
        'campaign_status',
    ],
    data() {
        return {
            dialog_delete: false,
            headers: [
                {
                    text: this.$t('campaign_name_table_header'),
                    align: 'start',
                    value: 'title',
                },
                {
                    text: this.$t('start_date_table_header'),
                    align: 'end',
                    value: 'start',
                },
                {
                    text: this.$t('end_date_table_header'),
                    align: 'end',
                    value: 'end',
                },
                {
                    text: this.$t('actions_table_header'),
                    value: 'actions',
                    align: 'end',
                    sortable: false,
                },
            ],
            to_delete_campaign_id: null,
            list_title: this.$t('default_list_title'),
            CAMPAIGN_STATUS: CAMPAIGN_STATUS,
            USER_ACCESS_LEVEL,
        }
    },
    computed: {
        ...mapGetters({
            campaignDraftList: 'campaign_store/campaignDraftList',
            campaignFinishedList: 'campaign_store/campaignFinishedList',
            campaignInProgressList: 'campaign_store/campaignInProgressList',
        }),
        campaignData() {
            switch (this.campaign_status) {
                case 'in-progress':
                    return this.campaignInProgressList;
                case 'draft':
                    return this.campaignDraftList;
                case 'finished':
                    return this.campaignFinishedList;
                default:
                    return []
            }
        }
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialog_delete (val) {
            val || this.closeDelete()
        },
        campaign_status () {
            this.initialize()
        }
    },
    mounted () {
        this.initialize()
    },
    methods: {
        ...mapActions({
            loadCampaigns: 'campaign_store/loadCampaigns',
            deleteCampaign: 'campaign_store/deleteCampaign',
        }),
        initialize() {

            switch (this.campaign_status) {
                case 'in-progress':
                    this.list_title = this.$t('in_progress_list_title')
                    this.loadCampaigns({ criteria: { campaign_status_list: [CAMPAIGN_STATUS.IN_PROGRESS] }, list_to_update: 'in_progress' })
                    break
                case 'draft':
                    this.list_title = this.$t('draft_list_title')
                    this.loadCampaigns({ criteria: { campaign_status_list: [CAMPAIGN_STATUS.DRAFT] }, list_to_update: 'draft' })
                    break
                case 'finished':
                    this.list_title = this.$t('finished_list_title')
                    this.loadCampaigns({ criteria:  { campaign_status_list: [CAMPAIGN_STATUS.FINISHED] }  , list_to_update:  'finished' })
                    break
                default:
                    break
            }

        },
        deleteItem(campaign_id) {
            this.to_delete_campaign_id = campaign_id
            this.dialog_delete = true
        },
        async deleteItemConfirm() {
            await this.deleteCampaign(this.to_delete_campaign_id)
            this.closeDelete()
        },
        clickOnRow(item) {
            switch (item.campaign_status) {
                case CAMPAIGN_STATUS.IN_PROGRESS:
                    this.$router.push({ name: 'campaign-participate', params: { campaign_id: item.id } })
                    break
                case CAMPAIGN_STATUS.DRAFT:
                    this.$router.push({ name: 'campaign-edit', params: { id: item.id } })
                    break
                case CAMPAIGN_STATUS.FINISHED:
                    this.$router.push({ name: 'campaign-result', params: { campaign_id: item.id } })
                    break
                default:
                    break
            }
        },
        closeDelete() {
            this.dialog_delete = false
        },
    },
  }
</script>

<i18n locale='fr'>
{
    "default_list_title": "Campagnes",
    "in_progress_list_title": "Campagnes en cours",
    "draft_list_title": "Brouillons de campagnes",
    "finished_list_title": "Campagnes terminées",
    "create_new_campaign_button": "Nouvelle campagne",
    "delete_campaign_modal_title": "Supprimer la campagne?",
    "cancel_button": "Annuler",
    "yes_button": "Oui",
    "refresh_button": "Actualiser",
    "campaign_name_table_header": "Nom de la campagne",
    "start_date_table_header": "Date de début",
    "end_date_table_header": "Date de début",
    "actions_table_header": "Actions"
}
</i18n>