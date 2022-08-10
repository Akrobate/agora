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
                            {{ $t('set_forgotten_password_title') }}
                        </v-toolbar-title>
                    </v-toolbar>


                    <v-card-text>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >

                            <v-text-field
                                id="password"
                                :label="$t('password')"
                                name="password"
                                v-model="password"
                                prepend-icon="mdi-key"
                                type="password"
                                :rules="[rules.required, rules.password]"
                            />

                            <v-text-field
                                id="password_confirmation"
                                :label="$t('password_confirmation')"
                                name="password_confirm"
                                v-model="password_confirm"
                                prepend-icon="mdi-key"
                                type="password"
                                :rules="[rules.confirmationMatch, rules.required]"
                            />
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="primary"
                            :loading="loading"
                            large
                            @click="updatePassword()"
                        >
                            {{ $t('validate_new_password_button') }}
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
    props: [
        'user_id',
        'forgotten_password_token'
    ],
    data() {
        return {
            password: '',
            password_confirm: '',
            valid: true,
            rules: {
                required: (value) => !!value || this.$t('validation_rule_required'),
                password: (value) => RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).test(value) || this.$t('validation_rule_password'),
                confirmationMatch: (value) => (value === this.password) || this.$t('validation_rule_confirmation_match'),
            },
            loading: false,
        }
    },
    methods: {
        ...mapActions({
            updateForgottenPassword: 'authentication_store/updateForgottenPassword',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
            triggerError: 'snack_bar_store/triggerError',
        }),
        async updatePassword() {
            try {
                await this.updateForgottenPassword({
                    forgotten_password_token: this.forgotten_password_token,
                    new_password: this.password,
                    user_id: this.user_id,
                })
            } catch (_) {
                this.triggerError(this.$t('technical_problem_message'))
                return
            }
            this.triggerSuccess(this.$t('password_updated_message'))
            this.$router.push({name: 'login'})
        },
    },
}
</script>

<i18n locale='fr'>
{
    "set_forgotten_password_title": "Choisissez un mot de passe",
    "password": "Mot de passe",
    "password_confirmation": "Confirmation de mot de passe",
    "validate_new_password_button": "Mettre à jour le mot de passe",
    "validation_rule_required": "Ce champ est obligatoire",
    "validation_rule_confirmation_match": "Confirmation est différente du mot de passe",
    "validation_rule_password": "Le mot de passe doit avoir 8 carracters, des chiffres et des lettres, majuscules et minuscules",
    "technical_problem_message": "Problème technique, veuillez essayer plus tard",
    "password_updated_message": "Votre mot de passe a bien été mis à jour"
}
</i18n>