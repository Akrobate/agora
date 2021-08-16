import axios from 'axios'
import configuration from '@/configurations/api'

class PropositionRepository {
   
    /**
     * @returns {PropositionRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/campaigns`
    }
    

    /**
     * @param {Object} criteria 
     * @returns {Promise} 
     */
    async search(campaign_id, criteria) {
        const result = await axios.get(`${this.ressource_url}/${campaign_id}/propositions`, {
            params: criteria,
        });
        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async create(campaign_id, data) {
        const result = await axios.post(`${this.ressource_url}/${campaign_id}/propositions`, data)
        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async update(campaign_id, id, data) {
        const result = await axios.patch(`${this.ressource_url}/${campaign_id}/propositions/${id}`, data)
        return result.data
    }

    
    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async read(campaign_id, id) {
        const result = await axios.get(`${this.ressource_url}/${campaign_id}/propositions/${id}`)
        return result.data
    }


    /**
     * @param {Object} data 
     * @returns {Promise} 
     */
    async delete(campaign_id, id) {
        const result = await axios.delete(`${this.ressource_url}/${campaign_id}/propositions/${id}`)
        return result.data
    }
}

const proposition_repository = new PropositionRepository()

export {
    proposition_repository,
}
