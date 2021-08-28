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
                        label="Prénom"
                        name="first_name"
                        v-model="first_name"
                        prepend-icon="mdi-account"
                        type="text"
                    />
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        label="Nom"
                        name="last_name"
                        v-model="last_name"
                        type="text"
                    />
                </v-col>
            </v-row>

            <v-text-field
                label="Email"
                name="email"
                v-model="email"
                prepend-icon="mdi-email"
                type="text"
                :disabled="disable_email"
                :rules="rule_not_empty"
            />

            <v-text-field
                id="password"
                label="Mot de passe"
                name="password"
                v-model="password"
                prepend-icon="mdi-key"
                type="password"
                :rules="rule_password"
            />

            <v-text-field
                id="password"
                label="Confirmation de mot de passe"
                name="password_confirm"
                v-model="password_confirm"
                prepend-icon="mdi-key"
                type="password"
                :rules="rule_password_confirmation"
            />
        </v-form>

        <v-snackbar
            :timeout="10000"
            :top="true"
            color="error"
            v-model="snackbar"
        >
            {{ snackbar_text }}
            <v-btn
                text
                @click.native="snackbar = false"
            >
                Fermer
            </v-btn>
        </v-snackbar>
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
 * -
 */
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
            snackbar: false,
            snackbar_text: '',
            rule_not_empty: [
                v => !!v || 'Ce champ est obligatoire',
            ],
            rule_password: [
                v => !!v || 'Ce champ est obligatoire',
                v => RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).test(v) || 'Le mot de passe doit avoir 8 carracters, des chiffres et des lettres, majuscules et minuscules',
            ],
            rule_password_confirmation: [
                v => (v === this.password) || 'Le mot de passe de confirmation différente',
                 v => !!v || 'Ce champ est obligatoire',
            ],
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
                this.snackbar = true
                if (error.response.status == 400) {
                    this.snackbar_text = 'Format saisi incorrect'
                } else {
                    this.snackbar_text = 'Probleme technique, veuillez essayer plus tard'
                }
            }
        },
    },
}

</script>
