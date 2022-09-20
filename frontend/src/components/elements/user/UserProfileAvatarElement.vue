<template>
    <v-card>
        <v-card-title>
            {{ $t('avatar_card_title') }}
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col
                        cols="12"
                        md="3"
                    >
                        <avatar-element size="100" :email="email" />
                    </v-col>

                    <v-col
                        cols="12"
                        md="9"
                    >
                        <p class="text">
                            Vous voyez cet avatar grâce a votre profil public gravatar
                        </p>

                        <p class="text font-weight-medium">
                            {{email}}
                        </p>

                        <p class="text">
                            Vous pouvez gérer votre avatar sur <a href="https://fr.gravatar.com/" target="_blank">gravatar</a>
                        </p>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>

// Using gravatar, if doesn't gravatar found then own picto
import { mapGetters } from 'vuex'
import AvatarElement from '@/components/elements/user/AvatarElement'


export default {
    components: {
        AvatarElement,
    },
    data() {
        return {
            email: null
        }
    },
    computed: {
        ...mapGetters({
            token_data: 'authentication_store/tokenData',
        }),
    },
    async mounted() {
        this.email = this.token_data.email
    },
}

</script>

<i18n locale="fr">
{
    "avatar_card_title": "Avatar"
}
</i18n>
