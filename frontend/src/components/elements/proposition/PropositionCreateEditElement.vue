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
                    <edition-element :proposition_type="campaign.proposition_type" v-model="payload" />

                </v-form>
                
                <p v-if="debug && 0">
                    <strong>{{ proposition_id ? proposition_id : 'NULL' }}</strong>
                    {{ campaign }}
                    <br />
                    <br />
                    {{ proposition }}
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
import EditionElement from '@/components/elements/proposition/types/EditionElement'
export default {
    name: 'PropositionCreateEditElement',
    components: {
        EditionElement,
    },
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
        proposition: {},
    }),
    async mounted() {
        await this.init()
    },
    watch: {
        campaign_id() {
            this.init()
        },
        proposition_id() {
            this.init()
        },
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign_store/getCampaign',
            createProposition: 'campaign_store/createProposition',
            updateProposition: 'campaign_store/updateProposition',
            getProposition: 'campaign_store/readProposition',
        }),
        async init() {
            if (this.campaign_id) {
                this.campaign = await this.getCampaign({
                    campaign_id: this.campaign_id
                })
            }
            if (this.proposition_id) {
                const proposition_data = await this.getProposition({
                    campaign_id: this.campaign_id,
                    proposition_id: this.proposition_id,
                })
                this.payload = proposition_data.payload
                this.proposition = proposition_data
            }
        },
        async save() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }
            if (this.proposition_id) {
                await this.updateProposition(
                    {
                        campaign_id: this.campaign_id,
                        proposition_id: this.proposition_id,
                        data: {
                            payload: this.payload,
                        }
                    }
                )
            } else {
                await this.createProposition(
                    {
                        campaign_id: this.campaign_id,
                        data: {
                            payload: this.payload,
                        }
                    }
                )
            }
            this.$emit('saved')
            this.reset()
        },
        reset() {
            this.payload = ''
            this.$refs.form.reset()
            this.$emit('reset')
        },
    },
}
</script>
