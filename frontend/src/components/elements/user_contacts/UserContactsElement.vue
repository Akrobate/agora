<template>
  <div>
      <v-data-table
          :headers="headers"
          :items="userContactList"
          class="elevation-1"
          @click:row="clickOnRow"
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


      </v-data-table>
  </div>
</template>


<script>

import { mapActions, mapGetters } from 'vuex';
import AvatarElement from '@/components/elements/user/AvatarElement'

  export default {
    name: 'UserContactsElement',
    components: {
      AvatarElement,
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
            }
          });
          console.log(this.userContactList)
        },
        clickOnRow() {

        }
    },
  }
</script>

<i18n locale='fr'>
{
  "contact_list_title": "Mes contacts",
  "contact_email_table_header": "Email",
  "contact_first_name_table_header": "Prénom",
  "contact_last_name_table_header": "Nom"
}
</i18n>