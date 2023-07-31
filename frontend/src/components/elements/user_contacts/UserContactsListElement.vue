<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="userContactList"
            class="elevation-1"
            @click:row="clickOnRow"
            :hide-default-footer="userContactList.length === 0"
            :hide-default-header="userContactList.length === 0"
        >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>{{ $t('contact_list_title') }}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>


            <v-dialog v-model="dialogAddToCampaign" max-width="600px">
                <v-card>
                    <v-card-title class="headline">
                        {{ $t('add_to_campaign_modal_title') }}
                    </v-card-title>


                    <v-container fluid>
                        <v-select
                            v-model="selected_campaign"
                            :items="campaign_list"
                            item-text="title"
                            item-value="id"
                            label="Select"
                            persistent-hint
                            return-object
                            single-line
                        ></v-select>
                        <MemberAccessLevelSelectElement
                            v-model="selected_campaign_user_access_level"
                        ></MemberAccessLevelSelectElement>
                        <v-switch
                            v-model="selected_campaign_user_is_participant"
                            :label="$t('is_participant_field_label')"
                        ></v-switch>
                    </v-container>


                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeAddToCampaign">
                            {{ $t('cancel') }}
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="confirmAddToCampaign">
                            {{ $t('ok') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        
        <template v-slot:[`item.avatar`]="{ item }">
            <avatar-element size="30" :email="item.email" />
        </template>
        
        <template v-slot:[`item.tag_list`]="{ item }">
            <v-chip
                v-for="tag in item.tag_list" :key="tag.tag_name"
                class="ma-1"
                color="primary"
                label
                text-color="white"
                :to="{ name: 'user-contacts', query: { tag_id: tag.tag_id } }"
                small
            >
            {{ tag.tag_name }}
        </v-chip>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
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
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    color="red"
                    @click="addToCampaign(item)" v-bind="attrs" v-on="on"
                >
                    <v-icon>mdi-account-plus-outline</v-icon>
                </v-btn>
            </template>
            <span>
                {{ $t('tooltip_add_to_campaign') }}
            </span>
        </v-tooltip>
    </template>

    <template v-slot:no-data>
        <p class="text-h6">
            {{ $t('no_contacts_help_text') }}
        </p>
    </template>
    
</v-data-table>
</div>
</template>


<script>

import { mapActions, mapGetters } from 'vuex';
import AvatarElement from '@/components/elements/user/AvatarElement'
import { CAMPAIGN_STATUS } from '@/constants'
import MemberAccessLevelSelectElement from '@/components/elements/campaign_members/MemberAccessLevelSelectElement'

export default {
    name: 'UserContactsListElement',
    components: {
        AvatarElement,
        MemberAccessLevelSelectElement,
    },
    props: {
        tag_id: Number,
    },
    data() {
        return {
            dialogAddToCampaign: false,
            editing_item: null,
            campaign_list: [],
            selected_campaign: null,
            selected_campaign_user_access_level: null,
            selected_campaign_user_is_participant: null,
            headers: [
                {
                    text: '',
                    align: 'start',
                    value: 'avatar',
                    sortable: false,
                },
                {
                    text: this.$t('contact_email_table_header'),
                    align: 'start',
                    value: 'contact_email',
                },
                {
                    text: this.$t('contact_first_name_table_header'),
                    align: 'start',
                    value: 'contact_first_name',
                },
                {
                    text: this.$t('contact_last_name_table_header'),
                    align: 'start',
                    value: 'contact_last_name',
                },
                {
                    text: this.$t('contact_tag_name_list_table_header'),
                    align: 'start',
                    value: 'tag_list',
                },
                {
                    text: this.$t('actions_table_header'),
                    value: 'actions',
                    align: 'end',
                    sortable: false,
                },
            ],
        }
    },
    computed: {
        ...mapGetters({
            userContactList: 'user_contact_tag_store/userContactList',
            token_data: 'authentication_store/tokenData',
        }),
    },
    watch: {
        tag_id() {
            console.log("tag_id changed", this.tag_id)
            this.initialize()
        },
    },
    async mounted () {
        await this.initialize()
    },
    methods: {
        ...mapActions({
            loadCampaigns: 'campaign_store/loadCampaigns',
            loadContacts: 'user_contact_tag_store/loadContacts',
            addCampaignUser: 'campaign_store/addCampaignUser',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async initialize () {
            await this.loadContacts({
                criteria: {
                    user_id: this.token_data.user_id,
                    tag_id_list: this.tag_id ? [this.tag_id] : undefined,
                }
            })
            this.campaign_list = await this.loadCampaigns(
                { 
                    criteria: { 
                        campaign_status_list: [
                            CAMPAIGN_STATUS.IN_PROGRESS,
                            CAMPAIGN_STATUS.DRAFT,
                        ]
                    },
                    list_to_update: null,
                }
            )
        },
        clickOnRow() {
            
        },
        deleteItem(item) {
            console.log(item)
        },
        addToCampaign(item) {
            this.dialogAddToCampaign = true
            this.editing_item = item
        },
        async confirmAddToCampaign() {
            console.log(this.editing_item)

            await this.addCampaignUser({
                campaign_id: this.selected_campaign,
                data: {
                    email: this.editing_item.email,
                    access_level: this.selected_campaign_user_access_level,
                    is_participant: this.selected_campaign_user_is_participant,
                }
            })

            this.selected_campaign = null
            this.selected_campaign_user_access_level = null
            this.selected_campaign_user_is_participant = null
        },
        closeAddToCampaign() {
            this.dialogAddToCampaign = false
        }
    },
}
</script>

<i18n locale='fr'>
{
    "contact_list_title": "Mes contacts",
    "contact_email_table_header": "Email",
    "contact_first_name_table_header": "Prénom",
    "contact_last_name_table_header": "Nom",
    "contact_tag_name_list_table_header": "Liste de contacts",
    "no_contacts_help_text": "Vous n'avez aucun contact dans cette liste",
    "actions_table_header": "Actions",
    "tooltip_remove": "Supprimer le contact de la liste",
    "tooltip_add_to_campaign": "Ajouter ce contact à une campagne",
    "add_to_campaign_modal_title": "Ajouter le contact à la campagne",
    "cancel": "Annuler",
    "is_participant_field_label": "Participe à la campagne"
}
</i18n>