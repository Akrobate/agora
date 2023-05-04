<template>
  <div>
    <h1>UserContactTagsElement</h1>
    <div>
      <ContactTagCreateEditElement />
    </div>
    <div>
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
            loadContactTags: 'user_contact_tag_store/loadContactTags',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async initialize () {
          await this.loadContactTags();
        },
    },
  }
</script>

<i18n locale='fr'>
{
}
</i18n>