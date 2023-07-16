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

export default {
    name: 'UserContactsListElement',
    components: {
        AvatarElement,
    },
    props: {
        tag_id: Number,
    },
    data() {
        return {
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
            loadContacts: 'user_contact_tag_store/loadContacts',
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
        },
        clickOnRow() {
            
        },
        deleteItem(item) {
            console.log(item)
        },
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
    "tooltip_remove": "Supprimer le contact de la liste"
}
</i18n>