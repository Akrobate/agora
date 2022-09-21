<template>
    <v-container>
        <v-tabs
            v-model="tab"
        >
            <v-tab>
                {{ $t('results_tab_name') }}
            </v-tab>
            <v-tab>
                {{ $t('participation_tab_name') }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item class="mt-8">
                
                <!-- user selector -->
                <v-select
                    v-model="selected_participant_user_list"
                    :items="all_participant_user_list"
                    :label="$t('user_selector_label')"
                    multiple
                    >
                    <template v-slot:selection="{ item, index }">
                        <v-chip v-if="[0, 1, 2].includes(index)">
                            <span>{{ item.email }}</span>
                        </v-chip>
                        <span
                            v-if="index === 3"
                            class="grey--text text-caption"
                            >
                            (+{{ value.length - 1 }} autres)
                        </span>
                    </template>

                    <template v-slot:item="{ item, attrs, on }">
                        <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                            <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-row no-gutters align="center">
                                    <span>{{ item.email }}</span>
                                    </v-row>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                </v-select>


                <!-- Algo selector -->
                <v-radio-group v-model="algorithm">
                    <v-radio
                        :label="$t('algo_selector_radio_borda')"
                        value="borda"
                    ></v-radio>
                    <v-radio
                        :label="$t('algo_selector_radio_majority')"
                        value="relative_majority"
                    ></v-radio>
                </v-radio-group>


                <!-- LIST -->
                <v-simple-table>
                    <thead>
                        <tr>
                        <th class="text-left" scope="col">
                            {{ $t('proposition_table_label') }}
                        </th>
                        <th class="text-right" scope="col">
                            {{ $t('rank_table_label') }}
                        </th>
                        </tr>
                    </thead>
                    <tbody name="list" is="transition-group">
                        <tr
                        v-for="proposition in propositionResultList"
                        :key="proposition.proposition_id"
                        >
                            <td class="text-left">{{ proposition.payload }}</td>
                            <td class="text-right">{{ proposition.rank }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>

            </v-tab-item>

            <v-tab-item>

                <campaign-result-participation :campaign_id="campaign_id" /> 
            </v-tab-item>
        </v-tabs-items>

    </v-container>
</template>


<script>

import {
    CAMPAIGN_USER_STATUS,
} from '@/constants'

import {
    mapActions,
    mapGetters,
} from 'vuex'

import CampaignResultParticipation from '@/components/elements/campaign_results/CampaignResultParticipation'


export default {
    name: "CampaignResultPage",
    components: {
        CampaignResultParticipation,
    },
    data() {
        return {
            tab: null,
            algorithm: 'borda',
            user_selector_dialog: false,

            all_participant_user_list: [],
            selected_participant_user_list: [],
        }
    },
    async mounted() {
        
        this.all_participant_user_list = await this.searchCampaignUserList({
            campaign_id: this.campaign_id,
            criteria: {
                is_participant: true,
                status_id_list: [CAMPAIGN_USER_STATUS.RESULT_SUBMITED],
            }
        })

        this.selected_participant_user_list = [...this.all_participant_user_list]

        this.updatePropositionList()
    },
    methods: {
        ...mapActions({
            loadPropositionResultList: 'user_proposition_store/loadPropositionResultList',
            searchCampaignUserList: 'campaign_store/searchCampaignUserList',
        }),
        updatePropositionList() {
            this.loadPropositionResultList({
                campaign_id: this.campaign_id,
                algorithm: this.algorithm,
                user_id_list: this.selected_participant_user_list.map((item) => item.user_id),
            })
        }
    },
    computed: {
        ...mapGetters({
            propositionResultList: 'user_proposition_store/propositionResultList',
        })
    },
    props: {
        campaign_id: Number,
    },
    watch: {
        algorithm() {
            this.updatePropositionList()
        },
        selected_participant_user_list() {
            this.updatePropositionList()
        },
    }
}
</script>

<i18n locale='fr'>
{
    "results_tab_name": "Résultats",
    "participation_tab_name": "Participation",
    "user_selector_label": "Tous les participants de la campagne",
    "algo_selector_radio_borda": "Recherche du consensus (Borda)",
    "algo_selector_radio_majority": "Majorité (Majorité relative)",
    "proposition_table_label": "Proposition",
    "rank_table_label": "Rang"
}
</i18n>
