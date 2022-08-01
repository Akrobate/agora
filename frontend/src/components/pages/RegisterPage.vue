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
                            {{ $t('register_user_title') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <user-registration-form-element
                            @register_success="registerSuccess()"
                            :trigger_register.sync="trigger_register"
                            :loading.sync="loading"
                        />
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />
                        <router-link class="mr-5" :to="{ name: 'login'}">
                            {{ $t('login_page_link_label') }}
                        </router-link>
                        <v-btn
                            color="primary"
                            @click="trigger_register = true"
                            :loading="loading"
                            large
                        >
                            {{ $t('register_user_button') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import UserRegistrationFormElement from '@/components/elements/user/UserRegistrationFormElement'

export default {
    name: 'RegisterPage',
    components: {
        UserRegistrationFormElement,
    },
    data() {
        return {
            trigger_register: null,
            loading: false,
        }
    },
    methods: {
        registerSuccess() {
            this.$router.push({ name: 'home' })
        }
    },
}

</script>

<i18n locale='fr'>
{
    "register_user_title": "Créez votre compte",
    "register_user_button": "Créer mon compte",
    "login_page_link_label": "Page de connection"
}
</i18n>