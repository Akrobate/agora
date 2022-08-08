<template>
    <v-container>
        <!-- Public token connection detected -->
        <v-card class="elevation-6">

            <v-card-text>

                <p class="text-h5">
                    {{ $t('welcome') }},
                </p>

                <p class="font-weight-medium body-2">
                    {{ $t('connected_as_guest_to_participate_to_campaign') }}<br />
                </p>

                <p class="font-weight-medium body-2 font-weight-bold">
                    "{{ campaign_title }}"
                </p>

                <p class="font-weight-medium body-2 font-weight-normal">
                    {{ campaign_description }}
                </p>
                
                <v-btn
                    class="mt-3"
                    color="primary"
                    :to="{ name: 'campaign-participate', params: { campaign_id: campaign_id } }"
                >
                    {{ $t('participate_as_guest_button') }}
                </v-btn>

                <p class="text-h5 mt-12">
                    {{ $t('finish_the_account_creation') }} <span class="body-1">{{ $t('optionnal') }}</span>
                </p>

                <p class="font-weight-medium">
                    {{ $t('create_account_description') }}
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
                        {{ $t('finish_account_creation_button') }}
                    </v-btn>
                </v-card-actions>

            </v-card-text>
        </v-card>

    </v-container>
</template>


<script>

import { mapActions, mapGetters } from 'vuex'

import UserRegistrationFormElement from '@/components/elements/user/UserRegistrationFormElement'

// @todo: disabled_email_value: static value

export default {
    name: "GuestAccessPage",
    data() {
        return {
            disabled_email_value: 'fedorov.artiom@gmail.com',
            trigger_register: null,
            loading: false,
            campaign_id: null,
            campaign_title: null,
            campaign_description: null,
        }
    },
    components: {
        UserRegistrationFormElement,
    },
    computed: {
        ...mapGetters({
            token_data: 'authentication_store/tokenData',
        }),
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign_store/getCampaign',
        }),
    },
    async mounted() {

        const campaign = await this.getCampaign({
            campaign_id: this.token_data.invited_to_campaign_id
        })
        this.campaign_id = campaign.id
        this.campaign_title = campaign.title
        this.campaign_description = campaign.description

    }
}
</script>


<i18n locale="fr">
{
    "welcome": "Bienvenue",
    "connected_as_guest_to_participate_to_campaign": "Vous êtes connecté en tant qu'invité à participer a la campagne",
    "participate_as_guest_button": "Participer a la campagne en tant qu'invité",
    "finish_the_account_creation": "Finalisez la création de votre compte",
    "optionnal": "(optionnel)",
    "create_account_description": "Vous pouvez créer un compte pour vous reconnecter a vos campagnes et en créer vous même. Pour cela il vous suffit de renseigner le formulaire",
    "finish_account_creation_button": "Finaliser la création"
}
</i18n>