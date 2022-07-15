<template>
    <v-container>

        <h1 class="text-h5">Profil utilisateur</h1>

        <user-profile-personnal-informations />

        <user-profile-update-password v-if = "true" />

    </v-container>
</template>

<script>

import UserProfilePersonnalInformations from '@/components/elements/user/UserProfilePersonnalInformations'
import UserProfileUpdatePassword from '@/components/elements/user/UserProfileUpdatePassword'

export default {
    components: {
        UserProfilePersonnalInformations,
        UserProfileUpdatePassword,
    }
}

</script>
