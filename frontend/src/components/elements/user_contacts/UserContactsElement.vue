<template>
  <h1>UserContactsElement</h1>
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