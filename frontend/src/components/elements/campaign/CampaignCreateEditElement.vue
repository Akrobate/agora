<template>
    <v-card>

        <v-card-title>
            <span class="headline">Paramètres de campagne</span>
        </v-card-title>

        <v-card-text>
            <v-container>

                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="title"
                        :counter="255"
                        :rules="title_rules"
                        label="Nom de la campagne"
                        required
                    ></v-text-field>

                    <v-textarea
                        v-model="description"
                        label="Description"
                        hint="La description de la campagne sera visible a tous les participants"
                    ></v-textarea>

                </v-form>
            </v-container> 
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="reset"
            >
                Effacer
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
    name: 'CampaignCreateEditElement',
    props: [
        'campaign_id'
    ],
    data: () => ({
        valid: true,
        title: '',
        title_rules: [
            v => !!v || 'Le nom de campagne est obligatoire',
        ],
        description: '',
        description_rules: [],
    }),
    async mounted() {
        console.log("CampaignCreateEditElement - Mounted")
        this.loadCampaingToEditIfCampaignIdIsSetted()
    },
    watch: {
        async campaign_id() {
            await this.loadCampaingToEditIfCampaignIdIsSetted()
        }
    },
    methods: {
        ...mapActions({
            createCampaign: 'campaign_store/createCampaign',
            updateCampaign: 'campaign_store/updateCampaign',
            getCampaign: 'campaign_store/getCampaign',
            setEditionCampaignId: 'campaign_store/setEditionCampaignId'
        }),
        async save () {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }
            if (this.campaign_id) {
                await this.updateCampaign(
                    this.campaign_id,
                    {
                        title: this.title,
                        description: this.description,
                    }
                )
                this.$emit('saved')
                return;
            }
            const creation_result = await this.createCampaign({
                title: this.title,
                description: this.description,
            })
            this.$emit('update:campaign_id', creation_result.id)
            this.$emit('saved')
        },
        reset () {
            this.$refs.form.reset()
            this.$emit('reset')
        },
        async loadCampaingToEditIfCampaignIdIsSetted() {
            if (this.campaign_id) {
                const campaign = await this.getCampaign({ campaign_id: this.campaign_id });
                this.title = campaign.title
                this.description = campaign.description
            } else {
                this.reset()
            }
        }
    },

}
</script>
