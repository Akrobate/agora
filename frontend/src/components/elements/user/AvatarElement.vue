<template>
    <v-card>
        <v-card-title>
            {{ $t('avatar_card_title') }}
        </v-card-title>
        <v-card-text>
            <v-avatar
                color="primary"
                size="200"
            >
            <img
                :src="avatar_img"
                alt="John"
            >
            
            </v-avatar>

            {{ email }}
        </v-card-text>
    </v-card>
</template>

<script>

// Using gravatar, if doesn't gravatar found then own picto
import { mapGetters } from 'vuex'
import { MD5 } from 'crypto-js'

export default {
    data() {
        return {
            email: null
        }
    },
    computed: {
        ...mapGetters({
            token_data: 'authentication_store/tokenData',
        }),
        avatar_img() {
            const hash = MD5(this.token_data.email)
            return `https://www.gravatar.com/avatar/${hash}?s=200`
        }
    },
    async mounted() {
        this.email = this.token_data.email
    },
}

</script>

<i18n locale="fr">
{
    "avatar_card_title": "Avatar"
}
</i18n>
