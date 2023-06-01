<template>
    <v-card class="mt-6">
        <v-card-title>
            {{ $t('personnal_information') }}
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
                                v-model="first_name"
                                :counter="25"
                                :label="$t('first_name')"
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
                                :label="$t('last_name')"
                                required
                            />
                        </v-col>
                    </v-row>
                    <v-row v-if="is_alpha">
                        <v-col
                            cols="12"
                        >
                            {{ $t('information_is_alpha') }}
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
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save"
            >
                {{ $t('save') }}
            </v-btn>
        </v-card-actions>
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
            is_alpha: null,
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
            triggerError: 'snack_bar_store/triggerError',
            triggerSuccess: 'snack_bar_store/triggerSuccess',
        }),
        async save() {
            try {
                await this.updateUser({
                    id: this.token_data.user_id,
                    first_name: this.first_name,
                    last_name: this.last_name,
                })
                this.triggerSuccess(this.$t('information_updated_success'))
            } catch (error) {
                this.triggerError(this.$t('information_updated_fail'))
            }
        },
        async reset() {
            await this.init()
        },
        async init() {
            const user = await this.getUser(this.token_data.user_id)
            this.last_name = user.last_name
            this.first_name = user.first_name
            this.is_alpha = user.is_alpha
        },
    },
}

</script>


<i18n locale="fr">
{
    "personnal_information": "Informations personnelles",
    "cancel": "Annuler",
    "save": "Savegarder",
    "first_name": "Prénom",
    "last_name": "Nom",
    "information_updated_success": "Mise a jour du profil réussie",
    "information_updated_fail": "Une erreur est survenue",
    "information_is_alpha": "Vous êtes un utilisateur Alpha. Vous avez accès a des fonctionalités en avant première"
}
</i18n>