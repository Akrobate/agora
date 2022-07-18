<template>
    <v-data-table
        :headers="headers"
        :items="propositionList"
        hide-default-footer
        :hide-default-header="propositionList.length === 0"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>
                    {{ $t('proposition_title') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="createProposition"
                    v-if="propositionList.length > 0"
                >
                    {{ $t('create_proposition_button') }}
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
                        <v-card-title class="headline">
                            {{ $t('delete_modal_title') }}
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="deleteConfirm">
                                {{ $t('ok') }}
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>

        <template v-slot:[`item.payload`]="{ item }">
            <preview-element 
            :proposition_type="campaign.proposition_type"
            :payload="item.payload"
            />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip top v-if="isEditableProposition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        @click="editItem(item)" v-bind="attrs" v-on="on"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('tooltip_edit') }}
                </span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="red"
                        @click="deleteItem(item)" v-bind="attrs" v-on="on"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('tooltip_remove') }}
                </span>
            </v-tooltip>
        </template>

        <template v-slot:no-data>
            <p class="text-h6">
                {{ $t('no_proposition_help_text') }}
            </p>
            <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="createProposition"
            >
                {{ $t('create_proposition_button') }}
            </v-btn>
        </template>
    </v-data-table>

</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import PropositionCreateEditElement from '@/components/elements/proposition/PropositionCreateEditElement'
import PreviewElement from '@/components/elements/proposition/types/PreviewElement'

import { CAMPAIGN_STATUS } from '@/constants'

export default {
    name: 'PropositionListElement',
    components: {
        PropositionCreateEditElement,
        PreviewElement,
    },
    props: [
        'campaign_id',
    ],
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
                {
                    text: this.$t('table_header_proposition_label'),
                    align: 'start',
                    value: 'payload',
                    sortable: false,
                },
                {
                    text: this.$t('table_header_action_label'),
                    value: 'actions',
                    align: 'end',
                    sortable: false,
                },
            ],
            editing_proposition_id: null,
            campaign: {},
        }
    },
    computed: {
        ...mapGetters({
            propositionList: 'campaign_store/propositionList',
        }),
        isEditableProposition() {
            return this.campaign.campaign_status != CAMPAIGN_STATUS.IN_PROGRESS
        }
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
            getCampaign: 'campaign_store/getCampaign',
        }),
        saved() {
            this.loadPropositionList({ campaign_id: this.campaign_id })
            this.dialog = false
        },
        async initialize () {
            if (this.campaign_id) {
                this.campaign = await this.getCampaign({
                    campaign_id: this.campaign_id
                })
                console.log(this.campaign)
                this.loadPropositionList({ campaign_id: this.campaign_id })
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

<i18n locale="fr">
{
    "no_proposition_help_text": "Créez des propositions pour le sondage. Au moins deux propositions sont obligatiores. Vous avez la possibilité de les modifier ultérieurement.",
    "table_header_action_label": "Actions",
    "table_header_proposition_label": "Propositions",
    "proposition_title": "Propositions",
    "create_proposition_button": "Créer proposition",
    "delete_modal_title": "Confirmer la suppression ?",
    "cancel": "Annuler",
    "ok": "Ok",
    "tooltip_edit": "Modifier la proposition",
    "tooltip_remove": "Supprimer la proposition"
}
</i18n>