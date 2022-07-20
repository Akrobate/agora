<template>
    <v-card>

        <v-card-title>
            <span class="headline" v-if="is_in_progress_campaign">
                {{ $t('started_campaign_title') }}
            </span>
            <span class="headline" v-if="is_draft_campaign">
                {{ $t('start_campaign_title') }}
            </span>
        </v-card-title>
        <v-card-text>

            <v-container v-if="is_in_progress_campaign">
                <p>
                    {{ $t('campaign_started_at') }} {{ campaign.start_date | humanizeDate}}
                    {{ $t('and_ends_in') }} {{ campaign.end_date | humanizeFutureDuration }}
                </p>

                <v-list>
                    <v-list-item two-line>
                        <v-list-item-icon>
                            <v-icon>
                                mdi-calendar-check-outline
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $t('campaign_started_at') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ campaign.start_date | formatDate}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                        <v-list-item-icon>
                            <v-icon>
                                mdi-calendar-clock-outline
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $t('end_date') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ campaign.end_date | formatDate}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>


            </v-container>

            <v-container v-if="is_draft_campaign">
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
                        :label="$t('duration_label')"
                        :rules="duration_rules"
                    ></v-select>
                </v-form>

                <v-btn
                    color="primary"
                    @click="launchCampaign"
                >
                    {{ $t('start_campaign_button') }}
                </v-btn>
                <v-dialog v-model="dialogLaunch" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">
                            {{ $t('confirmation_start_campaign_title') }}
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeLaunchCampaign">
                                {{ $t('confirmation_start_campaign_cancel') }}
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="launchCampaignConfirm">
                                {{ $t('confirmation_start_campaign_ok') }}
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>

        </v-card-text>
    </v-card>
</template>

<script>

import { mapActions } from 'vuex'
import moment from 'moment'
import {
    CAMPAIGN_STATUS,
} from '@/constants'

export default {
    name: 'CampaignLaunchElement',
    props: [
        'campaign_id',
    ],
    data() {
        return {
            valid: true,
            dialogLaunch: false,
            campaign: {},
            duration: 0,
            duration_list: [
                {
                    label: this.$tc('day', 1),
                    duration_days: 1,
                },
                {
                    label: this.$tc('day', 2),
                    duration_days: 2,
                },
                {
                    label: this.$tc('day', 3),
                    duration_days: 3,
                },
                {
                    label: this.$tc('day', 5),
                    duration_days: 5,
                },
                {
                    label: this.$tc('week', 1),
                    duration_days: 7,
                },
                {
                    label: this.$tc('week', 2),
                    duration_days: 14,
                },
                {
                    label: this.$tc('week', 3),
                    duration_days: 21,
                },
                {
                    label: this.$tc('month', 1),
                    duration_days: 30,
                },
            ],
            duration_rules: [
                (value) => !!value || this.$t('validation_duration_required'),
            ],
            CAMPAIGN_STATUS,
        }
    },
    watch: {
        campaign_id () {
            this.initialize()
        },
    },
    computed: {
        is_draft_campaign() {
            return this.campaign.campaign_status == CAMPAIGN_STATUS.DRAFT
        },
        is_in_progress_campaign() {
            return this.campaign.campaign_status == CAMPAIGN_STATUS.IN_PROGRESS
        },
        is_finished_campaign() {
            return this.campaign.campaign_status == CAMPAIGN_STATUS.FINISHED
        },
    },
    async mounted() {
        await this.initialize()
    },
    methods: {
        ...mapActions({
            getCampaign: 'campaign_store/getCampaign',
            updateCampaign: 'campaign_store/updateCampaign',
        }),
        async initialize () {
            if (this.campaign_id) {
                this.campaign = await this.getCampaign({
                    campaign_id: this.campaign_id
                })
            }
        },
        async launchCampaignConfirm () {
            await this.updateCampaign({
                campaign_id: this.campaign_id,
                data: {
                    start_date: moment().toISOString(),
                    end_date: moment().endOf('day').add(this.duration, 'd').toISOString(),
                    campaign_status: CAMPAIGN_STATUS.IN_PROGRESS,
                }
            })
            this.closeLaunchCampaign()
        },
        launchCampaign() {
            if (!this.$refs.form.validate()) {
                this.$emit('validation_error')
                return
            }
            this.dialogLaunch = true
        },
        closeLaunchCampaign() {
            this.dialogLaunch = false
        },
    },
  }
</script>

<i18n locale='fr'>
{
    "start_campaign_title": "Lancement de la campagne",
    "started_campaign_title": "Campagne en cours",
    "campaign_started_at": "Campagne lancée",
    "end_date": "Date de fin",
    "and_ends_in": "et se termine dans",
    "duration_label": "Durée de la campagne",
    "day": "1 jour | {n} jours",
    "week": "1 semaine | {n} semaines",
    "month": "1 mois | {n} mois",
    "start_campaign_button": "Lancer la campagne",
    "confirmation_start_campaign_title": "Voulez vous lancer la campagne?",
    "confirmation_start_campaign_cancel": "Annuler",
    "confirmation_start_campaign_ok": "Ok",
    "validation_duration_required": "Durée de campagne est obligatoire"
}
</i18n>
