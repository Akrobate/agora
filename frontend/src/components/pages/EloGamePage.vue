<template>
    <v-container style="max-width: 1280px; min-width: 795px">

        <v-row>
            <v-col class="col-8">
                <h1 class="text-h5 mt-8">EloGamePage</h1>
            </v-col>
            <v-col class="col-4" align="right">
                <v-btn
                    class="mt-6"
                    color="primary"
                    @click="validateUserResult"
                >
                    Valider mon classement
                </v-btn>
            </v-col>
        </v-row>

        <div>
        <v-row
            align="center"
            justify="center"
            no-gutters
            style="height: 250px;"
            class="mb-16 mt-8"
        >

            <v-col class="col-5 fill-height" >
                <v-hover v-slot="{ hover }" >
                    <v-card
                        class="px-6 fill-height rounded-xl proposition-card"
                        :class="{
                            'proposition-card-activated':  proposition_selected === 1,
                            'proposition-card-fadeout':  proposition_selected !== null,
                        }"
                        :elevation="hover ? 13 : 4"
                        @click="propositionClicked(1)"
                        :ripple="false"
                    >
                        <v-layout align-center fill-height>
                            <v-flex>
                                <p class="text-h5 text--secondary">
                                    {{ proposition_1 ? proposition_1.proposition.payload : '' }}
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-hover>
            </v-col>


            <v-spacer />


            <v-col class="col-1" @click="is_loading = !is_loading">
                <p class="text-h2" align="center"  v-if="!is_loading">
                    VS
                </p>

                <div align="center" v-if="is_loading">
                    <v-progress-circular
                        :size="50"
                        color="primary"
                        indeterminate
                        ></v-progress-circular>
                </div>
            </v-col>


            <v-spacer />


            <v-col class="col-5 fill-height" >
                <v-hover v-slot="{ hover }" >
                    <v-card
                        class="px-6 fill-height rounded-xl proposition-card"
                        :class="{
                            'proposition-card-activated':  proposition_selected === 2,
                            'proposition-card-fadeout':  proposition_selected !== null,
                        }"
                        :elevation="hover ? 13 : 4"
                        @click="propositionClicked(2)"
                        :ripple="false"
                    >
                        <v-layout align-center fill-height>
                            <v-flex>
                                <p class="text-h5 text--secondary">
                                    {{ proposition_2 ? proposition_2.proposition.payload : '' }}
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-hover>
            </v-col>

        </v-row>

        </div>

        <!-- LIST ---->
        
        <v-simple-table>
            <thead>
                <tr>
                <th class="text-left" scope="col">
                    Proposition
                </th>
                <th class="text-right" scope="col">
                    ELO score
                </th>
                </tr>
            </thead>
            <tbody name="list" is="transition-group">
                <tr
                v-for="proposition in eloPropositionRankingList"
                :key="proposition.id"
                :class="{
                    'winner': proposition.proposition_id === last_winner_proposition_id,
                    'loser': proposition.proposition_id === last_loser_proposition_id,
                }"
                >
                    <td class="text-left">{{ proposition.proposition.payload }}</td>
                    <td class="text-right">{{ proposition.elo_score }}</td>
                </tr>
            </tbody>
        </v-simple-table>

    </v-container>

</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    name: "EloGamePage",
    props: {
        campaign_id: Number,
    },
    data() {
        return {
            proposition_selected: null,
            is_loading: false,
            proposition_1: null,
            proposition_2: null,

            last_winner_proposition_id: null,
            last_loser_proposition_id: null,

            campaign: {},
        };
    },
    methods: {
        ...mapActions({
            initEloData: 'elo_ranking_store/initEloData',
            loadPropositionRankingList: 'elo_ranking_store/loadPropositionRankingList',
            writeDuelResult: 'elo_ranking_store/writeDuelResult',
            getRandomPropositions: 'elo_ranking_store/getRandomPropositions',
            initRanking: 'user_proposition_store/init',
            updateRanking: 'user_proposition_store/update',
            getCampaign: 'campaign_store/getCampaign',
            setCampaignUserStatusResultSubmited: 'campaign_user_status_store/setCampaignUserStatusResultSubmited',
            checkAndsetCampaignUserStatusStarted: 'campaign_user_status_store/checkAndsetCampaignUserStatusStarted',
        }),
        async propositionClicked(proposition_number) {
            this.is_loading = true
            this.proposition_selected = proposition_number


            this.last_winner_proposition_id = proposition_number === 1
                ? this.proposition_1.proposition_id : this.proposition_2.proposition_id

            this.last_loser_proposition_id = proposition_number === 2
                ? this.proposition_1.proposition_id : this.proposition_2.proposition_id

            await this.writeDuelResult({
                campaign_id: this.campaign_id,
                proposition_id_1: this.proposition_1.proposition_id,
                proposition_id_2: this.proposition_2.proposition_id,
                winner: proposition_number,
            })
            await this.updateResultList()
            await this.loadRandomPropositions()
            this.is_loading = false
            this.proposition_selected = null
        },
        async validateUserResult() {
            await this.updateRanking({
                campaign_id: this.campaign_id,
                proposition_id_list: this.eloPropositionRankingList.map((item) => item.proposition_id),
            })
            await this.setCampaignUserStatusResultSubmited({ campaign_id: this.campaign_id })
            this.$router.push({ name: 'campaign-participate', campaign_id: this.campaign_id })
        },
        async updateResultList() {
            await this.loadPropositionRankingList({campaign_id: this.campaign_id})
        },
        async loadRandomPropositions() {
            const random_propositions = await this.getRandomPropositions({ campaign_id: this.campaign_id })
            this.proposition_1 = random_propositions[0]
            this.proposition_2 = random_propositions[1]
        }
    },
    async mounted() {
        this.campaign = await this.getCampaign({ campaign_id: this.campaign_id })
        await this.checkAndsetCampaignUserStatusStarted({ campaign_id: this.campaign_id })
        await this.initEloData({ campaign_id: this.campaign_id })
        await this.initRanking({ campaign_id: this.campaign_id })
        await this.loadRandomPropositions()
    },
    computed: {
        ...mapGetters({
            eloPropositionRankingList: 'elo_ranking_store/eloPropositionRankingList'
        })
    },
};
</script>


<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.list-move {
  transition: transform 1s;
}

.list-move.winner {
  color: green
}
.list-move.loser {
  color: red
}

.proposition-card {
    cursor: pointer;
    transition: background-color 0.2s ease-out, opacity 0.8s linear;
}

.proposition-card-activated {
    background-color: #48c729 !important;
    opacity: 0;
}

.proposition-card-fadeout {
    opacity: 0;
}

</style>