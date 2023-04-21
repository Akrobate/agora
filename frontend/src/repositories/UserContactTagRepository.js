import axios from 'axios'
import configuration from '@/configurations/api'

class UserContactTagRepository {
   
    /**
     * @returns {UserContactTagRepository}
     */
    constructor() {
        this.ressource_url = `${configuration.url_api}/api/v1/`
    }

}

const user_contact_tag_repository = new UserContactTagRepository()

export {
    user_contact_tag_repository,
}
