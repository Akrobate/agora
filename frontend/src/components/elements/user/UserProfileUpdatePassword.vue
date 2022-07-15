<template>
    <v-card class="mt-6">
        <v-card-title>
            {{ $t('update_password_card_title') }}
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="form">
                <v-container>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-text-field
                                v-model="old_password"
                                :append-icon="old_password_show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.password]"
                                :type="old_password_show ? 'text' : 'password'"
                                :label="$t('field_label_old_password')"
                                @click:append="old_password_show = !old_password_show"
                            ></v-text-field>
                        </v-col>

                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-text-field
                                v-model="new_password"
                                :append-icon="new_password_show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.password]"
                                :type="new_password_show ? 'text' : 'password'"
                                :label="$t('field_label_new_password')"
                                counter
                                @click:append="new_password_show = !new_password_show"
                            ></v-text-field>

                            <v-text-field
                                v-model="new_password_confirmation"
                                :append-icon="new_password_confirmation_show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.confirmationMatch]"
                                :type="new_password_confirmation_show ? 'text' : 'password'"
                                :label="$t('field_label_new_password_confirmation')"
                                @click:append="new_password_confirmation_show = !new_password_confirmation_show"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
                {{ $t('update_password') }}
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            old_password: '',
            new_password: '',
            new_password_confirmation: '',
            valid: true,
            old_password_show: false,
            new_password_show: false,
            new_password_confirmation_show: false,
            rules: {
                required: (value) => !!value || this.$t('validation_rule_required'),
                password: (value) => RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).test(value) || this.$t('validation_rule_password'),
                confirmationMatch: (value) => (value === this.new_password) || this.$t('validation_rule_confirmation_match'),
            },
        }
    },
    computed: {
        ...mapGetters({
            token_data: 'authentication_store/tokenData',
        }),
    },
    async mounted() {
        await this.init()
    },
    methods: {
        ...mapActions({
            updateUserPassword: 'user_store/updateUserPassword',
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async save() {
            if (!this.$refs.form.validate()) {
                return
            }
            try {
                await this.updateUserPassword({
                    id: this.token_data.user_id,
                    old_password: this.old_password,
                    new_password: this.new_password
                })
                this.triggerSuccess(this.$t('password_update_success'))
            } catch (error) {
                if (error.response.status == 403) {
                    this.triggerError(this.$t('password_update_fail_bad_password'))
                } else {
                    this.triggerError(this.$t('password_update_fail'))
                }
            }
            this.init()
        },

        init() {
            this.$refs.form.reset()
            this.valid = true
        },
    },
}

</script>

<i18n locale="fr">
{
    "update_password_card_title": "Mise à jour du mot de passe",
    "update_password": "Mettre à jour le mot de passe",
    "validation_rule_required": "Ce champ est obligatoire",
    "validation_rule_password": "Le mot de passe doit avoir 8 carracters, des chiffres et des lettres, majuscules et minuscules",
    "validation_rule_confirmation_match": "Confirmation est différente du mot de passe",
    "password_update_success": "Mot de passe mis a jour",
    "password_update_fail": "Une erreur est survenue",
    "password_update_fail_bad_password": "Votre mot de passe actuel est incorrect",
    "field_label_new_password": "Nouveau mot de passe",
    "field_label_new_password_confirmation": "Confirmez le nouveau mot de passe",
    "field_label_old_password": "Mot de passe actuel"
}
</i18n>
