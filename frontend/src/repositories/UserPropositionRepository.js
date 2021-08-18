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

}

const user_proposition_repository = new UserPropositionRepository()

export {
    user_proposition_repository,
}
