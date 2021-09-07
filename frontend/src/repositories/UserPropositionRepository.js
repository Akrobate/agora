import axios from 'axios'
import configuration from '@/configurations/api'

class UserPropositionRepository {
   
    /**
     * @returns {UserPropositionRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/campaigns`
    }

    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async init(campaign_id) {
        const result = await axios.post(`${this.ressource_url}/${campaign_id}/init-ranking`)
        return result.data
    }

    /**
     * @param {Number} campaign_id 
     * @param {Number} proposition_id_list 
     * @returns {Promise} 
     */
    async update(campaign_id, proposition_id_list) {
        const result = await axios
            .post(
                `${this.ressource_url}/${campaign_id}/update-ranking`,
                {
                    proposition_id_list,
                })
        return result.data
    }


    /**
     * @param {Number} campaign_id 
     * @param {Number} proposition_id_list 
     * @returns {Promise} 
     */
    async getPropositionResults(campaign_id, user_id_list, algorithm) {
        const result = await axios
            .get(
                `${this.ressource_url}/${campaign_id}/proposition-results`,
                {
                    params: {
                        user_id_list,
                        algorithm,
                    },
                }
            )
        return result.data
    }


    /**
     * @todo: Set the good root
     * @param {Number} campaign_id 
     * @param {Number} proposition_id_list 
     * @returns {Promise} 
     */
    async getOwnRanking(campaign_id) {
        const result = await axios
            .get(`${this.ressource_url}/${campaign_id}/own-proposition-results`)
        return result.data
    }

}

const user_proposition_repository = new UserPropositionRepository()

export {
    user_proposition_repository,
}
