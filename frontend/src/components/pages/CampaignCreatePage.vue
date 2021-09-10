<template>
    <v-container>
            
        <v-stepper v-model="stepper_index">
            <v-stepper-header>
                <v-stepper-step
                    :complete="stepper_index > 1"
                    step="1"
                    :editable="true"
                >
                    Campagne
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step
                    :complete="stepper_index > 2"
                    step="2"
                    :rules="[() => step_2_proposition_is_valid]"

                    :editable="step_2_proposition_is_editable"
                >
                    Propositions
                    <small v-if="!step_2_proposition_is_valid">Il faut au moins deux propositions</small>

                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="stepper_index > 3"
                    step="3"
                    :editable="step_3_members_is_editable"
                >
                    Participants
                </v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step
                    :complete="stepper_index > 4"
                    step="4"
                    :editable="step_4_launch_is_editable"
                >
                    Lancement
                </v-stepper-step>
            </v-stepper-header>


            <v-stepper-items>
                <v-stepper-content step="1">
                    <campaign-create-edit-element
                        :campaign_id.sync="campaign_id"
                        @saved="campaignSaved"
                    />
                </v-stepper-content>

                <v-stepper-content step="2">
                    <proposition-list-element
                        :campaign_id="campaign_id"
                    />
                </v-stepper-content>

                <v-stepper-content step="3">
                    <campaign-members-list-element
                        :campaign_id="campaign_id"
                    />
                </v-stepper-content>

                <v-stepper-content step="4">
                    <campaign-launch-element
                        :campaign_id="campaign_id"
                    />
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>


        
    </v-container>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import CampaignCreateEditElement from '@/components/elements/campaign/CampaignCreateEditElement'
import PropositionListElement from '@/components/elements/proposition/PropositionListElement'
import CampaignMembersListElement from '@/components/elements/campaign_members/CampaignMembersListElement'
import CampaignLaunchElement from '@/components/elements/campaign/CampaignLaunchElement'

export default {
    name: 'CampaignCreatePage',
    props: [
        'id',
    ],
    components: {
        CampaignCreateEditElement,
        PropositionListElement,
        CampaignMembersListElement,
        CampaignLaunchElement,
    },
    data() {
        return {
            stepper_index: 1,
            campaign_id: this.id,
        }
    },
    computed: {
        ...mapGetters({
            campaignUserList: 'campaign_store/campaignUserList',
            propositionList: 'campaign_store/propositionList',
        }),
        step_2_proposition_is_editable() {
            return this.campaign_id !== undefined && this.campaign_id !== null
        },
        step_3_members_is_editable() {
            return this.campaign_id !== undefined && this.campaign_id !== null
        },
        step_4_launch_is_editable() {
            return this.campaign_id !== undefined
                && this.campaign_id !== null
                && this.propositionList.length >= 2
        },
        step_2_proposition_is_valid() {
            const valid = (this.stepper_index <= 2) || (this.stepper_index > 2 && this.propositionList.length >= 2)
            return !!valid
        }
    },
    mounted() {
        console.log("Campaign create Page - Mounted")
        this.loadAllCampaignData()
    },
    methods: {
        ...mapActions({
            setEditionCampaignId: 'campaign_store/setEditionCampaignId',
            loadCampaignUserList: 'campaign_store/loadCampaignUserList',
            loadPropositionList: 'campaign_store/loadPropositionList',
            clearPropositionList: 'campaign_store/clearPropositionList',
            clearCampaignUserList: 'campaign_store/clearCampaignUserList',
            getCampaign: 'campaign_store/getCampaign',
        }),
        campaignSaved(data) {
            console.log(data);
            this.stepper_index = 2;
        },
        loadAllCampaignData() {
            if (this.campaign_id) {
                this.loadCampaignUserList({ campaign_id: this.campaign_id })
                this.loadPropositionList({ campaign_id: this.campaign_id })
                this.getCampaign({ campaign_id: this.campaign_id })
            } else {
                this.clearPropositionList()
                this.clearCampaignUserList()
            }
        }
    },
    watch: {
        stepper_index: (value) => {
            console.log("stepper_index", value)
        },
        id() {
            this.stepper_index = 1;
            this.campaign_id = this.id;
            console.log('in id watcher')
            console.log('in id watcher id', this.id)
            console.log('in id watcher campaign_id', this.campaign_id)
        },
        campaign_id() {
            console.log("page watch campaignid", this.campaign_id)
        }
    },

}
</script>
