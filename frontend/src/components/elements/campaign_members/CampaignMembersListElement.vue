<template>
    <v-data-table
        :headers="headers"
        :items="campaignUserList"
        hide-default-footer
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>
                    {{ $t('members_title') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="createProposition"
                >
                    {{ $t('add_member_button') }}
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


                <v-dialog v-model="dialogInvite" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">
                            Inviter le membre
                        </v-card-title>

                        <v-card-text>
                            Etes vous sur de vouloir inviter ce membre maintenant?
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeInvite">
                                Annuler
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="InviteConfirm">
                                Oui
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        @click="invite(item)" v-bind="attrs" v-on="on"
                    >
                        <v-icon>mdi-email-fast-outline</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('send_invitation_tooltip') }}
                </span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        @click="editItem(item)" v-bind="attrs" v-on="on"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('edit_member_tooltip') }}
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
                    {{ $t('delete_member_tooltip') }}
                </span>
            </v-tooltip>

        </template>


        <template v-slot:[`item.invitation`]="{ item }">
            <div :set="sub = item.user_status_list.find((status) => status.status_id === 1)">
                <div v-if="sub !== undefined">
                    Invité {{ sub.date | humanizeDate }}
                </div>
            </div>
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
        dialogInvite: false,
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
                text: 'Invitation',
                value: 'invitation',
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
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
        dialogInvite (val) {
            val || this.closeInvite()
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
            inviteCampaignUser: 'campaign_store/inviteCampaignUser',
            deleteCampaignUser: 'campaign_store/deleteCampaignUser',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
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
        invite(item) {
            this.editing_campaign_user_id = item.id
            this.dialogInvite = true
        },
        async InviteConfirm() {
            await this.inviteCampaignUser({
                id: this.editing_campaign_user_id,
                campaign_id: this.campaign_id
            })
            this.triggerSuccess(this.$t('invitation_success_message'))
            this.closeInvite()
        },
        async deleteItemConfirm () {
            await this.deleteCampaignUser({
                id: this.editing_campaign_user_id,
                campaign_id: this.campaign_id
            })
            this.loadCampaignUserList({ campaign_id: this.campaign_id });
            this.triggerSuccess(this.$t('deleted_member_success_message'))
            this.closeDelete()
        },
        close () {
            this.dialog = false
        },
        closeDelete () {
            this.dialogDelete = false
        },
        closeInvite () {
            this.dialogInvite = false
        },
    },
  }
</script>

<i18n locale="fr">
{
    "members_title": "Membres de la campagne",
    "add_member_button": "Ajouter un membre",
    "send_invitation_tooltip": "Envoyer une invitation par mail",
    "edit_member_tooltip": "Modifier le membre",
    "delete_member_tooltip": "Supprimer le membre de la campagne",
    "invitation_success_message": "Invitation envoyée",
    "deleted_member_success_message": "Membre supprimé de la campagne"
}
</i18n>