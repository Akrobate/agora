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
                :rules="[() => true]"
                :editable="true"
            >
                Propositions
                
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step
                :complete="stepper_index > 3"
                step="3"
                editable
            >
                Participants
            </v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step
                :complete="stepper_index > 4"
                step="4"
                editable
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
        })
    },
    mounted() {
        console.log("Page Mounted")
    },
    methods: {
        ...mapActions({
            setEditionCampaignId: 'campaign_store/setEditionCampaignId',
        }),
        campaignSaved(data) {
            console.log(data);
            this.stepper_index = 2;
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
