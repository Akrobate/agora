<template>
    <v-container>
        <user-contacts-element />
    </v-container>
</template>

<script>

import UserContactsElement from '@/components/elements/user_contacts/UserContactsElement'

export default {
    name: 'UserContactTagPage',
    components: {
        UserContactsElement,
    },
}
</script>
