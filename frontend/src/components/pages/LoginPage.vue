<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col
                cols="12"
                sm="8"
                md="4"
            >

                <!-- Standart connection -->

                <v-card class="elevation-6">
                    <v-toolbar
                        color="primary"
                        dark
                        flat
                    >
                        <v-toolbar-title>
                            Connexion 
                            <span v-if="app_version" >v{{ app_version }}</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                label="Email"
                                name="email"
                                v-model="email"
                                prepend-icon="mdi-account"
                                type="text"
                            />

                            <v-text-field
                                id="password"
                                label="Password"
                                name="password"
                                v-model="password"
                                prepend-icon="mdi-key"
                                type="password"
                            />
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />

                        <router-link class="mr-5" :to="{ name: 'register'}">
                            Créer un compte
                        </router-link>

                        <v-btn
                            color="primary"
                            @click="login()"
                            :loading="loading"
                            large
                        >
                            Se connecter
                        </v-btn>
                    </v-card-actions>

                </v-card>


            </v-col>
        </v-row>
    </v-container>
</template>

<script>


import { mapActions, mapGetters } from 'vuex'
import {version} from '../../../package.json';

export default {
    name: 'LoginPage',

    data() {
        return {
            email : "",
            password : "",

            loading: false,
            snackbar: false,

            snackbar_text: '',
            app_version: version,

        }
    },
    async mounted() {

        const public_token = this.$route.query.public_token
        if (public_token) {
            try {
                await this.authenticateGuest({ public_token })
                console.log("in login mounted", public_token)
                this.$router.push({ name: 'guest-access' })
                return null
            } catch (error) {
                this.loading = false
                this.snackbar = true
                if (error.response.status == 401) {
                    this.snackbar_text = 'Votre invitation est invalide'
                } else {
                    this.snackbar_text = 'Probleme technique, veuillez essayer plus tard'
                }
            }
        }

        if (this.isConnected) {
            this.$router.push({ name: 'home' })
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
            authenticateGuest: 'authentication_store/guestLogin'
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
                if (error.response.status == 401) {
                    this.snackbar_text = 'Votre email ou mot de passe est incorrect'
                } else {
                    this.snackbar_text = 'Probleme technique, veuillez essayer plus tard'
                }
                this.email = ''
                this.password = ''
                this.loading = false
                this.snackbar = true
            }
        },
    },
}

</script>
