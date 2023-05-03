<template>
  <div>
    <h1>UserContactTagsElement</h1>
    <div>
      <ContactTagCreateEditElement />
    </div>
  </div>
</template>


<script>

import ContactTagCreateEditElement from '@/components/elements/user_contacts/ContactTagCreateEditElement'
import { mapActions, mapGetters } from 'vuex';
// import AvatarElement from '@/components/elements/user/AvatarElement'

  export default {
    name: 'UserContactsElement',
    components: {
      //AvatarElement,
      ContactTagCreateEditElement,
    },
    data: () => ({
    }),
    computed: {
        ...mapGetters({
            userContactTagList: 'user_contact_tag_store/userContactTagList',
            token_data: 'authentication_store/tokenData',
        }),
    },
    watch: {
    },
    async mounted () {
      console.log("uid: ", this.token_data.user_id);
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
}
</i18n>