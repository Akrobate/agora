<template>
    <v-container>

        <h1 class="text-h5">
            {{ $t('user_profile_title') }}
        </h1>

        <user-profile-personnal-informations />

        <user-profile-update-password />

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

<i18n locale='french'>
{
    "user_profile_title": "Profil utilisateur"
}
</i18n>
