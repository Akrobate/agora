import axios from 'axios'
import configuration from '@/configurations/api'

class EloRankingRepository {
   
    /**
     * @returns {EloRankingRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/campaigns`
    }

    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async init(campaign_id) {
        const result = await axios.post(`${this.ressource_url}/${campaign_id}/init-elo-ranking`)
        return result.data
    }


    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async results(campaign_id) {
        const result = await axios.get(`${this.ressource_url}/${campaign_id}/elo-ranking`)
        return result.data
    }


    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async getRandomPropositions(campaign_id) {
        const result = await axios.get(`${this.ressource_url}/${campaign_id}/elo-random-propositions`)
        return result.data
    }


    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async writeDuelResult(campaign_id, data) {
        const result = await axios.post(`${this.ressource_url}/${campaign_id}/elo-duel-result`, data)
        return result.data
    }

}

const elo_ranking_repository = new EloRankingRepository()

export {
    elo_ranking_repository,
}
