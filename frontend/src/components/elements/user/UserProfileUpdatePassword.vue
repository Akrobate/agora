<template>
    <v-card class="mt-6">
        <v-card-text>
            <v-form v-model="valid">
                <v-container>
                    <v-row>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-text-field
                                v-model="first_name"
                                :counter="25"
                                label="Prénom"
                                required
                            />
                        </v-col>

                        <v-col
                            cols="12"
                            md="6"
                        >
                            <v-text-field
                                v-model="last_name"
                                :counter="25"
                                label="Nom"
                                required
                            />
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
                @click="reset"
            >
                Annuler
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
                Sauvegarder
            </v-btn>
        </v-card-actions>

        
        <v-snackbar
            :timeout="3000"
            :top="true"
            color="success"
            v-model="snackbar"
        >
            Mise a jour du profil réussie
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
            last_name: null,
            first_name: null,
            valid: true,
            snackbar: false, 
            snackbar_error: false, 
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
            getUser: 'user_store/getUser',
            updateUser: 'user_store/updateUser',
        }),
        async save() {
            try {
                await this.updateUser({
                    id: this.token_data.user_id,
                    first_name: this.first_name,
                    last_name: this.last_name
                })
                this.snackbar = true
            } catch (error) {
                this.snackbar_error = true
            }
        },
        async reset() {
            await this.init()
        },
        async init() {
            const user = await this.getUser(this.token_data.user_id)
            this.last_name = user.last_name
            this.first_name = user.first_name
        },
    },
}

</script>