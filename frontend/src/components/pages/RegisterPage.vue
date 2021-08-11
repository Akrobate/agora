<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-6">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Créez votre compte</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                >
              <v-text-field
                label="Prénom"
                name="first_name"
                v-model="first_name"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                label="Nom"
                name="last_name"
                v-model="last_name"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                label="Email"
                name="email"
                v-model="email"
                prepend-icon="mdi-email"
                type="text"
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
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <router-link class="mr-5" :to="{ name: 'login'}">Page de connection</router-link>

            <v-btn
              color="primary"
              @click="register()"
              :loading="loading"
              large
            >
              Créer mon compte
            </v-btn>
          </v-card-actions>

        </v-card>

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

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex'

export default {
    name: 'RegisterPage',
    data() {
        return {
            valid: null,
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirm: '',
            loading: false,
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
            ]
        }
    },
    methods: {
        ...mapActions({
            registerUser: 'user_store/register',
        }),
        async register() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return
            }
            this.loading = true

            try {
                await this.registerUser({
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    password: this.password,
                })
                this.$router.push({ name: 'home' })
            } catch (error) {
                if (error.response.status == 400) {
                    this.snackbar = true
                    this.snackbar_text = 'Format saisi incorrect'
                    this.loading = false
                } else {
                    this.snackbar = true
                    this.snackbar_text = 'Probleme technique, veuillez essayer plus tard'
                    this.loading = false
                }
            }
        },
    },
}

</script>
