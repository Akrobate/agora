<template>
    <v-container>
        <user-contacts-list-element />
    </v-container>
</template>

<script>

import UserContactsListElement from '@/components/elements/user_contacts/UserContactsListElement'

export default {
    name: 'UserContactPage',
    components: {
        UserContactsListElement,
    },
}
</script>
