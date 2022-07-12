<template>
    <v-card>

        <v-card-title>
            <span class="headline">Membre</span>
        </v-card-title>

        <v-card-text>
            <v-container>

                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="email"
                        :counter="255"
                        :rules="email_rules"
                        label="email"
                        required
                        :disabled="!creation_mode"
                    ></v-text-field>

                    <v-select
                        v-model="access_level"
                        :items="access_level_list"
                        item-text="label"
                        item-value="id"
                        label="Privilèges"
                        :rules="access_level_rules"
                    ></v-select>
                </v-form>

                <v-switch
                    v-model="is_participant"
                    label="Participe a la campagne"
                ></v-switch>

                
            </v-container> 
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
    </v-card>
</template>

<script>

import { mapActions } from 'vuex'

export default {
    name: 'CampaignMembersCreateEditElement',
    props: {
        campaign_id: Number,
        campaign_user_id: Number,
    },
    data() {
        return {
            valid: true,
            email: '',
            email_rules: [
                v => !!v || 'Le mail est obligatoire',
            ],
            is_participant: true,
            access_level: 0,
            // @todo Should be a constant referential
            access_level_list: [
                { id: 1, label: 'Aucun' },
                { id: 2, label: 'Observateur' },
                { id: 3, label: 'Manager' },
            ],
            access_level_rules: [
                (v) => !!v || 'Un niveau d\'accès doit être renseigné',
            ],
            creation_mode: true,
        }
    },
    async mounted() {
        this.init()
    },
    watch: {
        async campaign_id() {
            await this.init()
        },
        async campaign_user_id() {
            await this.init()
        },
    },
    methods: {

        ...mapActions({
            addCampaignUser: 'campaign_store/addCampaignUser',
            updateCampaignUser: 'campaign_store/updateCampaignUser',
            getCampaignUser: 'campaign_store/getCampaignUser',
        }),
        
        async init() {
            if (this.campaign_user_id) {
                this.creation_mode = false;
                const campaign_user = await this.getCampaignUser({ campaign_id: this.campaign_id, id: this.campaign_user_id });
                this.email = campaign_user.email
                this.access_level = campaign_user.access_level
                this.is_participant = campaign_user.is_participant
            } else {
                this.creation_mode = true;
                this.$refs.form.reset()
                this.is_participant = true
            }
        },

        async save () {

            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }

            if (this.campaign_user_id) {
                await this.updateCampaignUser({
                    id: this.campaign_user_id,
                    campaign_id: this.campaign_id,
                    data: {
                        access_level: this.access_level,
                        is_participant: this.is_participant,
                    }
                })
                this.$emit('saved')
                return;
            }
            await this.addCampaignUser({
                campaign_id: this.campaign_id,
                data: {
                    email: this.email,
                    access_level: this.access_level,
                    is_participant: this.is_participant,
                }
            })
            this.$emit('saved')
        },

        reset () {
            this.$refs.form.reset()
            this.$emit('reset')
        },

    },

}
</script>
