<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="userContactTagList"
        class="elevation-1"
        @click:row="clickOnRow"
    >
      <template v-slot:top>
          <v-toolbar flat>
              <v-toolbar-title>{{ $t('contact_list_title') }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="createContactList"
              >
                  {{ $t('create_new_contact_list') }}
              </v-btn>

              <v-dialog v-model="dialog" max-width="500px">
                  <contact-tag-create-edit-element
                      @reset="close"
                      @saved="saved"
                  />
              </v-dialog>

              <v-dialog v-model="dialog_delete" max-width="400px">
                  <v-card>
                      <v-card-title class="headline">{{ $t('delete_contact_list_modal_title') }}</v-card-title>
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
        id: {{ item.id }}
      </template>

    </v-data-table>
  </div>
</template>


<script>

// @todo: Should probably be renamed to UserContactTagsListElement?

import ContactTagCreateEditElement from '@/components/elements/user_contacts/ContactTagCreateEditElement'
import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'UserContactTagsListElement',
    components: {
      ContactTagCreateEditElement,
    },
    data(){
        return {
            dialog: null,
            dialog_delete: null,
            headers: [
                {
                    text: this.$t('tag_name_table_header'),
                    align: 'start',
                    value: 'name',
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
            userContactTagList: 'user_contact_tag_store/userContactTagList',
            token_data: 'authentication_store/tokenData',
        }),
    },
    watch: {
    },
    async mounted () {
        await this.initialize()
    },
    methods: {
        ...mapActions({
            loadContactTags: 'user_contact_tag_store/loadContactTags',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async initialize () {
          await this.loadContactTags()
        },
        createContactList() {
            this.dialog = true
        },
        clickOnRow() {

        },
        deleteItemConfirm() {

        },
        closeDelete() {

        },
        saved() {
            this.loadContactTags()
            this.dialog = false
        },
        close() {
            this.dialog = false
        },
    },
  }
</script>

<i18n locale='fr'>
{
    "tag_name_table_header": "Nom du tag",
    "actions_table_header": "actions",
    "create_new_contact_list": "Nouvelle liste de contacts",
    "contact_list_title": "Listes de contacts",
    "yes_button": "Oui",
    "cancel_button": "Annuler",
    "delete_contact_list_modal_title": "Supprimer la liste de contacts"
}
</i18n>