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
    "actions_table_header": "actions"
}
</i18n>