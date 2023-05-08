<template>
  <div>
    <h1>UserContactTagsElement</h1>
    <div>
      <ContactTagCreateEditElement />
    </div>
    <div>

    <v-data-table
        :headers="headers"
        :items="userContactTagList"
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
                  {{ $t('create_new_contact_list') }}
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

      </template>

    </v-data-table>
      {{ userContactTagList }}
    </div>
  </div>
</template>


<script>

// @todo: Should probably be renamed to UserContactTagsListElement?



import ContactTagCreateEditElement from '@/components/elements/user_contacts/ContactTagCreateEditElement'
import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'UserContactsElement',
    components: {
      ContactTagCreateEditElement,
    },
    data(){
        return {
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
          await this.loadContactTags();
        },
        clickOnRow() {

        },
    },
  }
</script>

<i18n locale='fr'>
{
    "tag_name_table_header": "Nom du tag",
    "actions_table_header": "actions",
    "create_new_contact_list": "Nouvelle liste de contacts"
}
</i18n>