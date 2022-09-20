<template>
    <v-container>

        <h1 class="text-h5">
            {{ $t('user_profile_title') }}
        </h1>

        <user-profile-avatar-element v-if="true" class="mt-6" />

        <user-profile-personnal-informations />

        <user-profile-update-password />

    </v-container>
</template>

<script>

import UserProfilePersonnalInformations from '@/components/elements/user/UserProfilePersonnalInformations'
import UserProfileUpdatePassword from '@/components/elements/user/UserProfileUpdatePassword'
import UserProfileAvatarElement from '@/components/elements/user/UserProfileAvatarElement'

export default {
    components: {
        UserProfilePersonnalInformations,
        UserProfileUpdatePassword,
        UserProfileAvatarElement,
    }
}

</script>

<i18n locale='fr'>
{
    "user_profile_title": "Profil utilisateur"
}
</i18n>
