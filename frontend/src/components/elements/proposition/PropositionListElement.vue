<template>
  <v-data-table
    :headers="headers"
    :items="propositionList"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Propositions</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          @click="createProposition"
        >
            Créer proposition
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
            <proposition-create-edit-element
                :campaign_id="campaign_id"
                :proposition_id="editing_proposition_id"
                @reset="close"
                @saved="saved"
            />
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="600px">
          <v-card>
            <v-card-title class="headline">Confirmer la suppression ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
        <router-link 
            tag="span"
            style="cursor: pointer"
            :to="{ name: 'field-setup', params: { module_technical_name: item.technical_name } }"
        >
            <v-icon class="mr-2" small>mdi-format-list-bulleted-square</v-icon>
        </router-link>
        <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
            mdi-delete
        </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>

</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import PropositionCreateEditElement from '@/components/elements/proposition/PropositionCreateEditElement'

  export default {
    name: 'PropositionListElement',
    components: {
        PropositionCreateEditElement,
    },
    props: [
        'campaign_id',
    ],
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Proposition',
                align: 'start',
                value: 'payload',
            },
            {
                text: 'Actions',
                value: 'actions',
                align: 'end',
                sortable: false,
            },
        ],
        editing_proposition_id: null,
    }),
    computed: {
        ...mapGetters({
            propositionList: 'campaign_store/propositionList',
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
            loadPropositionList: 'campaign_store/loadPropositionList',
            clearPropositionList: 'campaign_store/clearPropositionList',
            deleteProposition: 'campaign_store/deleteProposition',
        }),
        saved() {
            this.loadPropositionList({ campaign_id: this.campaign_id });
            this.dialog = false
        },
        initialize () {
            if (this.campaign_id) {
                this.loadPropositionList({ campaign_id: this.campaign_id });
            } else {
                this.clearPropositionList()
            }
        },
        createProposition() {
            this.editing_proposition_id = null
            this.dialog = true
        },
        editItem (item) {
            this.dialog = true
            this.editing_proposition_id = item.id
        },
        deleteItem (item) {
            this.editing_proposition_id = item.id
            this.dialogDelete = true
        },
        async deleteConfirm () {
            await this.deleteProposition({
                campaign_id: this.campaign_id,
                id: this.editing_proposition_id,
            })
            this.closeDelete()
        },
        close () {
            this.dialog = false
            this.editing_proposition_id = null
        },
        closeDelete () {
            this.dialogDelete = false
            this.editing_proposition_id = null
        },
    },
  }
</script>