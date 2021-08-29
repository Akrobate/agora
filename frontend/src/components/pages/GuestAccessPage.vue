<template>
    <v-container>
        <!-- Public token connection detected -->
        <v-card class="elevation-6">

            <v-card-text>

                <p class="text-h5">
                    Bienvenue,
                </p>

                <p class="font-weight-medium body-2">
                    Vous êtes connecté en tant qu'invité à participer a la campagne <br />

                    <span class="font-weight-bold">
                        "Campaign name"
                    </span>
                </p>

                <v-btn
                    class="mt-3"
                    color="primary"
                >
                    Participer a la campagne en tant qu'invité
                </v-btn>

                <p class="text-h5 mt-12">
                    Finalisez la création de votre compte <span class="body-1">(optionnel)</span>
                </p>

                <p class="font-weight-medium">
                    Vous pouvez créer un compte pour vous reconnecter a vos campagnes et en créer vous même. Pour cela il vous suffit de renseigner le formulaire
                </p>

                <v-row>
                    <v-col cols="6">
                        <user-registration-form-element
                            @register_success="registerSuccess()"
                            :trigger_register.sync="trigger_register"
                            :loading.sync="loading"
                            :default_email="disabled_email_value"
                        />
                    </v-col>
                </v-row>

                <v-card-actions>
                    <v-btn
                    color="primary"
                    @click="trigger_register = true"
                    :loading="loading"
                    >
                    Finaliser la création
                    </v-btn>
                </v-card-actions>

            </v-card-text>
        </v-card>

    </v-container>
</template>


<script>

import UserRegistrationFormElement from '@/components/elements/user/UserRegistrationFormElement'

export default {
    name: "GuestAccessPage",
    data() {
        return {
            disabled_email_value: 'fedorov.artiom@gmail.com',
            trigger_register: null,
            loading: false,
        }
    },
    components: {
        UserRegistrationFormElement,
    },
    props: {
        campaign_id: Number,
    },
}
</script>