<template>
    <div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        :label="$t('first_name')"
                        name="first_name"
                        v-model="first_name"
                        prepend-icon="mdi-account"
                        type="text"
                    />
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        :label="$t('first_name')"
                        name="last_name"
                        v-model="last_name"
                        type="text"
                    />
                </v-col>
            </v-row>

            <v-text-field
                :label="$t('email')"
                :rules="[ rules.required ]"
                name="email"
                v-model="email"
                prepend-icon="mdi-email"
                type="text"
                :disabled="disable_email"
            />

            <v-text-field
                id="password"
                :label="$t('password')"
                name="password"
                v-model="password"
                prepend-icon="mdi-key"
                type="password"
                :rules="[rules.password, rules.required]"
            />

            <v-text-field
                id="password"
                :label="$t('password_confirmation')"
                name="password_confirm"
                v-model="password_confirm"
                prepend-icon="mdi-key"
                type="password"
                :rules="[rules.confirmationMatch, rules.required]"
            />
        </v-form>
    </div>
</template>

<script>

/**
 * Emits events:
 * - register_success
 * - validation_error
 * 
 * props:
 * - email
 *
 */
import http_status from 'http-status'

import { mapActions } from 'vuex'

export default {
    name: 'UserRegistrationFormElement',
    props: [
        'trigger_register',
        'loading',
        'default_email',
    ],
    data() {
        return {
            valid: null,
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirm: '',
            rules: {
                required: (value) => !!value || this.$t('validation_rule_required'),
                password: (value) => RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).test(value) || this.$t('validation_rule_password'),
                confirmationMatch: (value) => (value === this.password) || this.$t('validation_rule_confirmation_match'),
            },
            disable_email: false,
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        trigger_register() {
            if (this.trigger_register) {
                this.register()
                this.$emit('update:trigger_register', null)
            }
        },
        default_email() {
            this.init()
        }
    },
    methods: {
        ...mapActions({
            registerUser: 'user_store/register',
            triggerError: 'snack_bar_store/triggerError',
        }),
        init() {
            if (this.default_email) {
                this.email = this.default_email
                this.disable_email = true
            }
        },
        async register() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return
            }
            this.$emit('update:loading', true)
            try {
                await this.registerUser({
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    password: this.password,
                })
                this.$emit('register_success')
            } catch (error) {
                this.$emit('update:loading', false)
                if (error.response.status == http_status.BAD_REQUEST) {
                    this.triggerError(this.$t('bad_format_snackbar'))
                } else {
                    this.triggerError(this.$t('technical_problem_snackbar'))
                }
            }
        },
    },
}

</script>


<i18n locale="fr">
{
    "close": "Fermer",
    "first_name": "Prénom",
    "last_name": "Nom",
    "email": "Email",
    "password": "Mot de passe",
    "password_confirmation": "Confirmation de mot de passe",
    "bad_format_snackbar": "Format saisi incorrect",
    "technical_problem_snackbar": "Probleme technique, veuillez essayer plus tard",
    "validation_rule_required": "Ce champ est obligatoire",
    "validation_rule_confirmation_match": "Confirmation est différente du mot de passe",
    "validation_rule_password": "Le mot de passe doit avoir 8 carracters, des chiffres et des lettres, majuscules et minuscules"
}
</i18n>
