import Vue from 'vue'
import Vuex from 'vuex'
import appLayoutStore from './modules/appLayoutStore'
import authenticationStore from './modules/authenticationStore'
import campaignStore from './modules/campaignStore'
import campaignUserStatusStore from './modules/campaignUserStatusStore'
import eloRankingStore from './modules/eloRankingStore'
import snackBarStore from './modules/snackBarStore'
import userContactTagStore from './modules/userContactTagStore'
import userPropositionStore from './modules/userPropositionStore'
import userStore from './modules/userStore'

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
    user_contact_tag_store: userContactTagStore,
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});
