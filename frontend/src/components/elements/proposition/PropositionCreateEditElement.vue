<template>
    <v-card>

        <v-card-title>
            <span class="headline">Proposition</span>
        </v-card-title>

        <v-card-text>
            <v-container>

                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-text-field
                        v-model="payload"
                        :counter="255"
                        :rules="payload_rules"
                        label="Contenu de la proposition"
                        required
                    ></v-text-field>

                </v-form>
                
                <p v-if="debug">
                    <strong>{{ proposition_id ? proposition_id : 'NULL' }}</strong>
                    {{ campaign }}
                </p>
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
    name: 'PropositionCreateEditElement',
    props: {
        campaign_id: Number,
        proposition_id: Number,
    },
    data: () => ({
        valid: true,
        payload: '',
        payload_rules: [
            v => !!v || 'Le contenu de la proposition est obligatoire',
        ],
        debug: true,
        campaign: {},
    }),
    async mounted() {
        await this.init()
    },
    methods: {
        ...mapActions({
            createProposition: 'campaign_store/createProposition',
            getCampaign: 'campaign_store/getCampaign',
        }),
        async save() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }
            await this.createProposition(
                {
                    campaign_id: this.campaign_id,
                    data: {
                        payload: this.payload,
                    }
                }
            )
            this.$emit('saved')
            this.reset()
        },
        reset() {
            this.$refs.form.reset()
            this.$emit('reset')
        },
        async init() {
            if (this.campaign_id) {
                this.campaign = await this.getCampaign({
                    campaign_id: this.campaign_id
                })
            }
        }
    },
    watch: {
        campaign_id() {
            this.init()
        }
    }
}
</script>
