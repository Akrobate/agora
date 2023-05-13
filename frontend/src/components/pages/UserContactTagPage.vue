<template>
    <v-container>
        <user-contact-tags-list-element />
    </v-container>
</template>

<script>

import UserContactTagsListElement from '@/components/elements/user_contacts/UserContactTagsListElement'

export default {
    name: 'UserContactTagPage',
    components: {
        UserContactTagsListElement,
    },
}
</script>
