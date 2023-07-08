<template>
    <v-container>
        <user-contacts-list-element :tag_id="tag_id" />
    </v-container>
</template>

<script>

import UserContactsListElement from '@/components/elements/user_contacts/UserContactsListElement'

export default {
    name: 'UserContactPage',
    components: {
        UserContactsListElement,
    },
    props: {
        tag_id: Number,
    },
}
</script>
