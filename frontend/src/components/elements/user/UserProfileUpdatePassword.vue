<template>
    <v-card class="mt-6">
        <v-card-title>
            Mise à jour du mot de passe
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-text-field
                                v-model="old_password"
                                :append-icon="old_password_show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="old_password_show ? 'text' : 'password'"
                                name="input-10-1"
                                label="Mot de passe actuel"
                                hint="At least 8 characters"
                                counter
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
                                :rules="[rules.required, rules.min]"
                                :type="new_password_show ? 'text' : 'password'"
                                name="input-10-1"
                                label="Nouveau mot de passe"
                                hint="At least 8 characters"
                                counter
                                @click:append="new_password_show = !new_password_show"
                            ></v-text-field>

                            <v-text-field
                                v-model="new_password_confirmation"
                                :append-icon="new_password_confirmation_show ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="new_password_confirmation_show ? 'text' : 'password'"
                                name="input-10-1"
                                label="Confirmez le nouveau mot de passe"
                                hint="At least 8 characters"
                                counter
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
                Mettre a jour le mot de passe
            </v-btn>
        </v-card-actions>

        
        <v-snackbar
            :timeout="3000"
            :top="true"
            color="success"
            v-model="snackbar"
        >
            Mot de passe mis a jour
        </v-snackbar>
        
        <v-snackbar
            :timeout="3000"
            :top="true"
            color="error"
            v-model="snackbar_error"
        >
            Une erreur est survenue
        </v-snackbar>

    </v-card>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            old_password: null,
            new_password: null,
            new_passord_confirmation: null,
            valid: true,
            snackbar: false, 
            snackbar_error: false,

            old_password_show: false,
            new_password_show: false,
            new_password_confirmation_show: false,
            rules: {
                required: (value) => !!value || 'Required.',
                min: (v) => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => (`The email and password you entered don't match`),
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
        }),
        async save() {
            try {
                await this.updateUserPassword({
                    id: this.token_data.user_id,
                    old_password: this.first_name,
                    new_password: this.last_name
                })
                this.snackbar = true
            } catch (error) {
                this.snackbar_error = true
            }
            this.init()
        },

        init() {
            this.old_password = ''
            this.new_password = ''
            this.new_password_confirmation = ''
            this.valid = true
        },
    },
}

</script>