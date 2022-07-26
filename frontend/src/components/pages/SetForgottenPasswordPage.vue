<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row align="center" justify="center">
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
                                :rules="rule_password"
                            />

                            <v-text-field
                                id="password"
                                :label="$t('password_confirmation')"
                                name="password_confirm"
                                v-model="password_confirm"
                                prepend-icon="mdi-key"
                                type="password"
                                :rules="rule_password_confirmation"
                            />
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="primary"
                            :loading="loading"
                            large
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

export default {
    name: 'ForgottenPasswordPage',
    data() {
        return {
            password: '',
            password_confirm: '',
            rule_password: [
                v => !!v || 'Ce champ est obligatoire',
                v => RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).test(v) || 'Le mot de passe doit avoir 8 carracters, des chiffres et des lettres, majuscules et minuscules',
            ],
            rule_password_confirmation: [
                v => (v === this.password) || 'Le mot de passe de confirmation différente',
                 v => !!v || 'Ce champ est obligatoire',
            ],
            loading: false,
        }
    },
    methods: {
    },
}

</script>

<i18n locale='fr'>
{
    "set_forgotten_password_title": "Choisissez un mot de passe",
    "password": "Mot de passe",
    "password_confirmation": "Confirmation de mot de passe",
    "validate_new_password_button": "Mettre à jour le mot de passe"
}
</i18n>