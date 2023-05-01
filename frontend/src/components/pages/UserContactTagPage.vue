<template>
    <v-container>
        <user-contact-tags-element />
    </v-container>
</template>

<script>

import UserContactTagsElement from '@/components/elements/user_contacts/UserContactTagsElement'

export default {
    name: 'UserContactTagPage',
    components: {
        UserContactTagsElement,
    },
}
</script>
