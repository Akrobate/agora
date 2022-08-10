<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="8"
                md="4"
            >
                <user-login-form-element />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import http_status from 'http-status'
import { mapActions, mapGetters } from 'vuex'

import UserLoginFormElement from '@/components/elements/user/UserLoginFormElement'

export default {
    name: 'LoginPage',
    components: {
        UserLoginFormElement,
    },
    computed: {
        ...mapGetters({
            isConnected: 'authentication_store/isConnected',
        })
    },
    methods: {
        ...mapActions({
            authenticateGuest: 'authentication_store/guestLogin',
            triggerError: 'snack_bar_store/triggerError',
        }),
    },
    async mounted() {
        const public_token = this.$route.query.public_token
        if (public_token) {
            try {
                await this.authenticateGuest({ public_token })
                this.$router.push({ name: 'guest-access' })
                return null
            } catch (error) {
                if (error.response.status == http_status.UNAUTHORIZED) {
                    this.triggerError(this.$t('invalid_invitation_snack_bar'))
                } else {
                    this.triggerError(this.$t('technical_problem_snack_bar'))
                }
            }
        }
        if (this.isConnected) {
            this.$router.push({ name: 'home' })
        }
    },
}
</script>

<i18n locale='fr'>
{
    "invalid_invitation_snack_bar": "Votre invitation est invalide",
    "technical_problem_snack_bar": "Problème technique, veuillez essayer plus tard"
}
</i18n>
