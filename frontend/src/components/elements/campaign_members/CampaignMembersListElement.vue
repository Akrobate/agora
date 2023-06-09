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
                    v-if="user_is_alpha"
                    color="primary"
                    dark
                    class="mb-2"
                    @click="addAllMembersToContacts"
                >
                    {{ $t('add_members_to_list_button') }}
                </v-btn>
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
                            {{ $t('remove_campaign_dialog_title') }}
                        </v-card-title>

                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete">
                            {{ $t('cancel_button') }}
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                            {{ $t('yes_button') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>


                <v-dialog v-model="dialogInvite" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">
                            {{ $t('invite_member_dialog_title') }}
                        </v-card-title>

                        <v-card-text>
                            {{ $t('invite_member_dialog_description') }}
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeInvite">
                                {{ $t('cancel_button') }}
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="InviteConfirm">
                                {{ $t('yes_button') }}
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogAddMembersToList" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">
                            {{ $t('add_user_contact_dialog_title') }}
                        </v-card-title>

                        <v-card-text>
                            {{ $t('add_user_contact_dialog_description') }}
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeAddUserContact">
                                {{ $t('cancel_button') }}
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="addUserContact">
                                {{ $t('add_button') }}
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
                        @click="addUserContact(item)" v-bind="attrs" v-on="on"
                    >
                        <v-icon>mdi-account-group</v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ $t('add_user_contact_tooltip') }}
                </span>
            </v-tooltip>


            <v-tooltip top v-if="campaign_status !== CAMPAIGN_STATUS.DRAFT">
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
                    {{ $t('invited_string') }} {{ sub.date | humanizeDate }}
                </div>
            </div>
        </template>

        <template v-slot:[`item.avatar`]="{ item }">
            <avatar-element size="30" :email="item.email" />
        </template>


        <template v-slot:[`item.access_level`]="{ item }">
            <v-chip
                v-if="item.access_level === 2"
                class="ma-2"
                color="blue darken-1"
                outlined
                small
            >
                {{ $t('observer_chip') }}
            </v-chip>

            <v-chip
                v-if="item.access_level === 3"
                class="ma-2"
                color="red"
                text-color="white"
                small
            >
                {{ $t('manager_chip') }}
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
                {{ $t('participant_chip') }}
            </v-chip>
        </template>

    </v-data-table>
</template>


<script>

import { CAMPAIGN_STATUS } from '@/constants'

import { mapActions, mapGetters } from 'vuex';
import CampaignMembersCreateEditElement from '@/components/elements/campaign_members/CampaignMembersCreateEditElement'
import AvatarElement from '@/components/elements/user/AvatarElement'

  export default {
    name: 'CampaignMembersListElement',
    components: {
        CampaignMembersCreateEditElement,
        AvatarElement,
    },
    props: [
        'campaign_id',
    ],
    data: () => ({
        dialog: false,
        dialogDelete: false,
        dialogInvite: false,
        dialogAddMembersToList: false,
        campaign_status: {},
        headers: [
            {
                text: '',
                align: 'start',
                value: 'avatar',
            },
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
        CAMPAIGN_STATUS,
    }),
    computed: {
        ...mapGetters({
            campaignUserList: 'campaign_store/campaignUserList',
            token_data: 'authentication_store/tokenData',
        }),
        user_is_alpha() {
            return this.token_data.is_alpha ? true : false;
        }
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
    async mounted () {
        await this.initialize()
        console.log(this.token_data);
    },
    methods: {
        ...mapActions({
            loadCampaignUserList: 'campaign_store/loadCampaignUserList',
            clearCampaignUserList: 'campaign_store/clearCampaignUserList',
            getCampaign: 'campaign_store/getCampaign',
            inviteCampaignUser: 'campaign_store/inviteCampaignUser',
            deleteCampaignUser: 'campaign_store/deleteCampaignUser',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
            createContactsTag: 'user_contact_tag_store/createContactsTag',
        }),
        saved() {
            this.loadCampaignUserList({ campaign_id: this.campaign_id })
            this.dialog = false
        },
        async initialize () {
            if (this.campaign_id) {
                this.loadCampaignUserList({ campaign_id: this.campaign_id })
                this.campaign = await this.getCampaign({ campaign_id: this.campaign_id })
                this.campaign_status = this.campaign.campaign_status
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
        async addAllMembersToContacts() {
            this.dialogAddMembersToList = true
            this.triggerSuccess(this.$t('all_members_added_success_message'))
        },
        async addAllMembersToContactsConfirm() {
            this.triggerSuccess(this.$t('all_members_added_success_message'))
        },
        async addUserContact() {
            // @todo
            const member_user_list = this
                .loadCampaignUserList({ campaign_id: this.campaign_id })
            const campagin_name = this.campaign.name
            await this.createContactsTag({
                    data: {
                        name: `${this.$t('members_of')} ${campagin_name}`,
                        user_id: this.editing_campaign_user_id,
                    },
                })
            console.log(member_user_list);
            
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
        closeAddUserContact () {
            this.dialogInvite = false
        },
    },
  }
</script>

<i18n locale='fr'>
{
    "members_title": "Membres de la campagne",
    "add_member_button": "Ajouter un membre",
    "add_button": "Ajouter",
    "add_members_to_list_button": "Ajouter les members au carnet d'addresses",
    "send_invitation_tooltip": "Envoyer une invitation par mail",
    "edit_member_tooltip": "Modifier le membre",
    "delete_member_tooltip": "Supprimer le membre de la campagne",
    "add_user_contact_tooltip": "Ajouter le membre au carnet d'adresses",
    "add_user_contact_dialog_title": "Ajouter au carnet d'adresse",
    "add_user_contact_dialog_description": "Ajouter les contacts au carnet d'adresse",
    "added_user_contact_tooltip": "Ce membre fait partie de votre carnet d'adresses",
    "invitation_success_message": "Invitation envoyée",
    "deleted_member_success_message": "Membre supprimé de la campagne",
    "all_members_added_success_message": "Tous les membres de la campagne ont été ajoutés au carnet d'adresses",
    "remove_campaign_dialog_title": "Supprimer membre?",
    "invite_member_dialog_title": "Inviter le membre",
    "invite_member_dialog_description": "Etes vous sur de vouloir inviter ce membre maintenant?",
    "yes_button": "Oui",
    "cancel_button": "Annuler",
    "observer_chip": "Observateur",
    "manager_chip": "Manager",
    "participant_chip": "Participant",
    "invited_string": "Invité",
    "members_of": "Membres de"
}
</i18n>