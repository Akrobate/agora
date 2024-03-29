<template>
    <v-card class="elevation-6">
        <v-toolbar
            color="primary"
            dark
            flat
        >
            <v-toolbar-title>
                {{ $t('connection_title') }} 
                <span v-if="app_version" >v {{ app_version }}</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-form>
                <v-text-field
                    :label="$t('form_email_label')"
                    name="email"
                    v-model="email"
                    prepend-icon="mdi-account"
                    type="text"
                    autofocus
                />

                <v-text-field
                    id="password"
                    :label="$t('form_password_label')"
                    name="password"
                    v-model="password"
                    prepend-icon="mdi-key"
                    type="password"
                >
                    <template v-slot:append>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                
                            <v-btn
                                icon
                                :to="{name: 'forgotten-password'}"
                                v-bind="attrs" v-on="on"
                            >
                                <v-icon v-on="on">
                                    mdi-lock-reset
                                </v-icon>
                            </v-btn>
                            </template>
                            <span>
                                {{ $t('forgotten_password_button_tooltip') }}
                            </span>
                        </v-tooltip>
                    </template>
                </v-text-field>

            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer />

            <router-link class="mr-5" :to="{ name: 'register'}">
                {{ $t('create_account_link') }}
            </router-link>

            <v-btn
                color="primary"
                @click="login()"
                :loading="loading"
                large
            >
                {{ $t('connection_button') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import {version} from '../../../../package.json';
import http_status from 'http-status'

export default {
    name: 'UserLoginFormElement',
    data() {
        return {
            email : '',
            password : '',
            loading: false,
            app_version: version,
        }
    },
    computed: {
        ...mapGetters({
            isConnected: 'authentication_store/isConnected',
        })
    },
    methods: {
        ...mapActions({
            authenticate: 'authentication_store/login',
            triggerError: 'snack_bar_store/triggerError',
        }),
        async login() {
            this.loading = true
            try {
                await this.authenticate({
                    email: this.email,
                    password: this.password,
                })
                this.$router.push({ name: 'home' })
            } catch (error) {
                if (error.response.status == http_status.UNAUTHORIZED) {
                    this.triggerError(this.$t('bad_credential_message'))
                } else {
                    this.triggerError(this.$t('technical_problem_message'))
                }
                this.email = ''
                this.password = ''
                this.loading = false
            }
        },
    },
}

</script>

<i18n locale='fr'>
{
    "connection_title": "Connexion",
    "form_email_label": "Email",
    "form_password_label": "Mot de passe",
    "connection_button": "Se connecter",
    "create_account_link": "Créer un compte",
    "technical_problem_message": "Problème technique, veuillez essayer plus tard",
    "bad_credential_message": "Votre email ou mot de passe est incorrect",
    "forgotten_password_button_tooltip": "Mot de passe oublié"
}
</i18n>
