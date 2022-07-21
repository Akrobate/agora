<template>
    <v-card>

        <v-card-title>
            <span class="headline">
                {{ $t('create_campaign_title') }}
            </span>
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
                        :label="$t('input_campaign_name_label')"
                        required
                    ></v-text-field>

                    <proposition-type-ui-selector-element
                        v-model="proposition_type"
                        :disabled="propositionList.length > 0"
                    />
                    
                    <v-textarea
                        v-model="description"
                        :label="$t('input_campaign_description_label')"
                        :hint="$t('input_campaign_description_hint')"
                    ></v-textarea>

                </v-form>

            </v-container> 
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="reset()"
            >
                {{ $t('button_clear') }}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="save()"
            >
                {{ $t('button_save') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import PropositionTypeUiSelectorElement from '@/components/elements/proposition/types/PropositionTypeUiSelectorElement'

export default {
    name: 'CampaignCreateEditElement',
    components: {
        PropositionTypeUiSelectorElement,
    },
    props: [
        'campaign_id'
    ],
    data() {
        return {
            valid: true,
            title: '',
            title_rules: [
                v => !!v || this.$t('campaign_name_required'),
            ],
            proposition_type: '',
            description: '',
            description_rules: [],
            default_proposition_type: 'raw_string',
        }
    },
    async mounted() {
        await this.loadCampaingToEditIfCampaignIdIsSetted()
    },
    watch: {
        async campaign_id() {
            await this.loadCampaingToEditIfCampaignIdIsSetted()
        },
    },
    computed: {
        ...mapGetters({
            propositionList: 'campaign_store/propositionList',
        }),
    },
    methods: {
        ...mapActions({
            createCampaign: 'campaign_store/createCampaign',
            updateCampaign: 'campaign_store/updateCampaign',
            getCampaign: 'campaign_store/getCampaign',
            loadPropositionList: 'campaign_store/loadPropositionList'
        }),
        async save () {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return
            }
            if (this.campaign_id) {
                await this.updateCampaign({
                    campaign_id: this.campaign_id,
                    data: {
                        title: this.title,
                        description: this.description,
                        proposition_type: this.proposition_type,
                    }
                })
                this.$emit('saved')
                return
            }
            const creation_result = await this.createCampaign({
                title: this.title,
                description: this.description,
                proposition_type: this.proposition_type,
            })
            this.$emit('update:campaign_id', creation_result.id)
            this.$emit('saved')
        },
        reset() {
            this.$refs.form.reset()
            this.$nextTick (() => {
                this.setFormDefalutValues()
            })
            this.$emit('reset')
        },
        setFormDefalutValues() {
            this.proposition_type = this.default_proposition_type
        },
        async loadCampaingToEditIfCampaignIdIsSetted() {
            if (this.campaign_id) {
                await this.loadPropositionList({ campaign_id: this.campaign_id })
                const campaign = await this.getCampaign({ campaign_id: this.campaign_id })
                this.title = campaign.title
                this.description = campaign.description
                this.proposition_type = campaign.proposition_type
            } else {
                this.reset()
            }
        }
    },
}
</script>


<i18n locale='fr'>
{
    "create_campaign_title": "Paramètres de campagne",
    "button_clear": "Effacer",
    "button_save": "Sauvegarder",
    "input_campaign_name_label": "Nom de la campagne",
    "input_campaign_description_label": "Description",
    "input_campaign_description_hint": "La description de la campagne sera visible a tous les participants",
    "campaign_name_required": "Le nom de campagne est obligatoire"
}
</i18n>