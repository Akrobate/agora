<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-6">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>
                            {{ $t('forgotten_password_title') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>

                        <v-text-field
                            :label="$t('form_email_label')"
                            name="email"
                            v-model="email"
                            prepend-icon="mdi-email-outline"
                            type="text"
                        />

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />
                        <router-link class="mr-5" :to="{ name: 'login'}">
                            {{ $t('login_page_link_label') }}
                        </router-link>
                        <v-btn
                            color="primary"
                            :loading="loading"
                            large
                            @click="requestPassword()"
                        >
                            {{ $t('submit_request_button') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { mapActions } from 'vuex'

export default {
    name: 'ForgottenPasswordPage',
    data() {
        return {
            email: '',
            loading: false,
        }
    },
    methods: {
        ...mapActions({
            requestForgottenPassword: 'authentication_store/forgottenPasswordRequest',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async requestPassword() {
            console.log(this.email)
            this.triggerSuccess(this.$t('renew_password_requested_snack_bar'))
            await this.requestForgottenPassword({
                email: this.email
            })
            this.$router.push({name: 'login'});
        },
    },
}

</script>

<i18n locale='fr'>
{
    "forgotten_password_title": "Mot de passe oublié",
    "submit_request_button": "Reinitialiser mon mot de passe",
    "form_email_label": "Votre adresse email",
    "login_page_link_label": "Connection",
    "renew_password_requested_snack_bar": "Votre demande de renouvellement de mot de passe à été prise en compte"
}
</i18n>