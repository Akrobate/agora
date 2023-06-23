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


      </v-data-table>
  </div>
</template>


<script>

import { mapActions, mapGetters } from 'vuex';
// import AvatarElement from '@/components/elements/user/AvatarElement'

  export default {
    name: 'UserContactsElement',
    components: {
      //AvatarElement,
    },
    data: () => ({
    }),
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
        },
    },
  }
</script>

<i18n locale='fr'>
{
  "contact_list_title": "Mes contacts"
}
</i18n>