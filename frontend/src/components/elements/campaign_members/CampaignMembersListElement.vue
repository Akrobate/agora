<template>
<v-data-table
    :headers="headers"
    :items="campaignUserList"
    hide-default-footer
    class="elevation-1"
>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Membres de la campagne</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          @click="createProposition"
        >
            Ajouter un membre
        </v-btn>

        <v-dialog v-model="dialog" max-width="500px">
            <campaign-members-create-edit-element
                v-if="dialog"
                :campaign_id="campaign_id"
                :campaign_user_id="editing_campaign_user_id"
                @reset="close"
                @saved="saved"
            />
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">
                Supprimer membre?
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Annuler</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Oui</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
            mdi-delete
        </v-icon>
    </template>


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

</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import CampaignMembersCreateEditElement from '@/components/elements/campaign_members/CampaignMembersCreateEditElement'

  export default {
    name: 'CampaignMembersListElement',
    components: {
        CampaignMembersCreateEditElement,
    },
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
            {
                text: 'Actions',
                value: 'actions',
                align: 'end',
                sortable: false,
            },
        ],
        editing_campaign_user_id: null,
    }),
    computed: {
        ...mapGetters({
            campaignUserList: 'campaign_store/campaignUserList',
        }),
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
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
            deleteCampaignUser: 'campaign_store/deleteCampaignUser',
        }),
        saved() {
            this.loadCampaignUserList({ campaign_id: this.campaign_id });
            this.dialog = false
        },
        initialize () {
            if (this.campaign_id) {
                this.loadCampaignUserList({ campaign_id: this.campaign_id });
            } else {
                this.clearCampaignUserList()
            }
        },
        createProposition() {
            this.editing_campaign_user_id = null
            this.dialog = true
        },
        editItem (item) {
            this.dialog = true
            this.editing_campaign_user_id = item.id
        },
        deleteItem (item) {
            this.editing_campaign_user_id = item.id
            this.dialogDelete = true
        },
        async deleteItemConfirm () {
            await this.deleteCampaignUser({
                id: this.editing_campaign_user_id,
                campaign_id: this.campaign_id
            })
            this.loadCampaignUserList({ campaign_id: this.campaign_id });
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