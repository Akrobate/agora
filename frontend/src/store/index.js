import Vue from 'vue'
import Vuex from 'vuex'
import campaignStore from './modules/campaignStore'
import appLayoutStore from './modules/appLayoutStore'
import userStore from './modules/userStore'
import authenticationStore from './modules/authenticationStore'
import eloRankingStore from './modules/eloRankingStore'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    campaign_store: campaignStore,
    app_layout_store: appLayoutStore,
    user_store: userStore,
    authentication_store: authenticationStore,
    elo_ranking_store: eloRankingStore,
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});