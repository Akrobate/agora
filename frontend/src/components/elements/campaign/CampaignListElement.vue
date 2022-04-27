<template>
  <v-data-table
    :headers="headers"
    :items="campaignData"
    class="elevation-1"
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
          @click="createItem()"
        >
          Nouvelle campagne
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
            <campaign-create-edit-element
                @cancel="close"
                @saved="close"
                :module_technical_name="editing_module_technical_name"
            />
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this module?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
            v-if="item.user_access_level === USER_ACCESS_LEVEL.MANAGER"
            tag="span"
            style="cursor: pointer"
            :to="{ name: 'campaign-edit', params: { id: item.id } }"
        >
            <v-icon class="mr-2" color="blue">mdi-pencil</v-icon>
        </router-link>

        <v-icon
            v-if="item.user_access_level === USER_ACCESS_LEVEL.MANAGER"
            color="red"
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
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
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import CampaignCreateEditElement from '@/components/elements/campaign/CampaignCreateEditElement'
import { CAMPAIGN_STATUS, USER_ACCESS_LEVEL } from '@/constants'

  export default {
    name: 'CampaignListElement',
    components: {
      CampaignCreateEditElement,
    },
    props: [
        'campaign_status',
    ],
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Nom de la campagne',
                align: 'start',
                value: 'title',
            },
            {
                text: 'Actions',
                value: 'actions',
                align: 'end',
                sortable: false,
            },
        ],
        editing_module_technical_name: null,
        list_title: 'Campagnes',
        CAMPAIGN_STATUS: CAMPAIGN_STATUS,
        USER_ACCESS_LEVEL,
    }),
    computed: {
        ...mapGetters({
            campaignDraftList: 'campaign_store/campaignDraftList',
            campaignFinishedList: 'campaign_store/campaignFinishedList',
            campaignInProgressList: 'campaign_store/campaignInProgressList',
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
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
        dialogDelete (val) {
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
            deleteModule: 'campaign_store/deleteCampaign',
        }),
        initialize () {
            
            switch (this.campaign_status) {
                case 'in-progress':
                    this.list_title = 'Campagnes en cours'
                    this.loadCampaigns({ criteria: { campaign_status_list: [2] }, list_to_update: 'in_progress' })
                    break
                case 'draft':
                    this.list_title = 'Brouillons de campagnes'
                    this.loadCampaigns({ criteria: { campaign_status_list: [1] }, list_to_update: 'draft' })
                    break
                case 'finished':
                    this.list_title = 'Campagnes terminées'
                    this.loadCampaigns({ criteria:  { campaign_status_list: [3] }  , list_to_update:  'finished' })
                    break
                default:
                    break
            }
            
        },
        createItem() {
            this.editing_module_technical_name = null
            this.dialog = true
        },
        deleteItem (item) {
            this.editing_module_technical_name = item.technical_name
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.deleteModule(this.editing_module_technical_name)
            this.closeDelete()
        },
        close () {
            this.dialog = false
        },
        closeDelete () {
            this.dialogDelete = false
        },
    },
  }
</script>