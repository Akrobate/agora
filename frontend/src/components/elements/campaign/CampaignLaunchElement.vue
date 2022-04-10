<template>
    <v-card>

        <v-card-title>
            <span class="headline">Lancement de la campagne</span>
        </v-card-title>
        <v-card-text>

            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >  
                <v-select
                    v-model="duration"
                    :items="duration_list"
                    item-text="label"
                    item-value="duration_days"
                    label="Durée de la campagne"
                    :rules="duration_rules"
                ></v-select>
            </v-form>
            <v-container>
                <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="launchCampaign"
                >
                    Lancer la campagne
                </v-btn>
                <v-dialog v-model="dialogLaunch" max-width="500px">
                <v-card>
                    <v-card-title class="headline">Voulez vous lancer la campagne?</v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeLaunchCampaign">Annuler</v-btn>
                    <v-btn color="blue darken-1" text @click="launchCampaignConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
    name: 'CampaignLaunchElement',
    props: [
        'campaign_id',
    ],
    data: () => ({
        valid: true,
        dialogLaunch: false,
        duration: 0,
        duration_list: [
            { label: '1 jour', duration_days: 1 },
            { label: '2 jours', duration_days: 2 },
            { label: '3 jours', duration_days: 3 },
            { label: '5 jours', duration_days: 5 },
            { label: '1 semaine', duration_days: 7 },
            { label: '2 semaines', duration_days: 14 },
            { label: '3 semaines', duration_days: 21 },
            { label: '1 mois', duration_days: 30 },
        ],
        duration_rules: [
            (v) => !!v || 'Durée de campagne est obligatoire',
        ],
    }),
    computed: {
        ...mapGetters({
            campaignDraftList: 'campaign_store/campaignDraftList',
            campaignFinishedList: 'campaign_store/campaignFinishedList',
            campaignInProgressList: 'campaign_store/campaignInProgressList',
        }),
    },
    watch: {
        campaign_id () {
            this.initialize()
        }
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign_store/getCampaign',
            updateCampaign: 'campaign_store/updateCampaign',
        }),
        launchCampaignConfirm () {
            const update_campaign_params = {
                campaign_id: this.campaign_id,
                data: {
                    start_date: moment().toISOString(),
                    end_date: moment().endOf('day').add(this.duration, 'd').toISOString(),
                    campaign_status: 2,
                }
            };
            console.log(update_campaign_params);
            this.updateCampaign(update_campaign_params)
            this.closeLaunchCampaign()
        },
        launchCampaign() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return;
            }
            this.dialogLaunch = true
        },
        closeLaunchCampaign() {
            this.dialogLaunch = false
        },
    },
  }
</script>