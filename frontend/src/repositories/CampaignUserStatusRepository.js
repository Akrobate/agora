import axios from 'axios'
import configuration from '@/configurations/api'

class CampaignUserStatusRepository {
   
    /**
     * @returns {CampaignUserStatusRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/campaigns`
    }

    /**
     * @param {Number} campaign_id 
     * @param {Number} status_id 
     * @returns {Promise} 
     */
    async upsertStatus(campaign_id, status_id) {
        const result = await axios.post(`${this.ressource_url}/${campaign_id}/status`, {
            status_id
        })
        return result.data
    }


    /**
     * @param {Number} campaign_id 
     * @returns {Promise} 
     */
    async getStatus(campaign_id, status_id) {
        console.log(status_id)
        const result = await axios.get(`${this.ressource_url}/${campaign_id}/status`, {
            params: {
                status_id,
            }
        })
        return result.data
    }

}

const campaign_user_status_repository = new CampaignUserStatusRepository()

export {
    campaign_user_status_repository,
}
