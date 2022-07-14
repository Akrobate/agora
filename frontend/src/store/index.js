import Vue from 'vue'
import Vuex from 'vuex'
import campaignStore from './modules/campaignStore'
import appLayoutStore from './modules/appLayoutStore'
import userStore from './modules/userStore'
import authenticationStore from './modules/authenticationStore'
import eloRankingStore from './modules/eloRankingStore'
import userPropositionStore from './modules/userPropositionStore'
import campaignUserStatusStore from './modules/campaignUserStatusStore'
import snackBarStore from './modules/snackBarStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    campaign_store: campaignStore,
    app_layout_store: appLayoutStore,
    user_store: userStore,
    authentication_store: authenticationStore,
    elo_ranking_store: eloRankingStore,
    user_proposition_store: userPropositionStore,
    campaign_user_status_store: campaignUserStatusStore,
    snack_bar_store: snackBarStore,
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});
