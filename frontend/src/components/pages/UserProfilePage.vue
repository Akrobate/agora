<template>
    <v-container>
        <h1 class="text-h5">Profil utilisateur</h1>

        <user-profile-personnal-informations />

    </v-container>
</template>

<script>

import UserProfilePersonnalInformations from '@/components/elements/user/UserProfilePersonnalInformations'

export default {
    components: {
        UserProfilePersonnalInformations,
    }
}

</script>
