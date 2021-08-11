import {
  user_repository,
} from '@/repositories'


const state = () => ({
    user: {},
})

const getters = {}

const actions = {
    async register(_, {
        email,
        password,
        first_name,
        last_name,
    }) {
        await user_repository.register({
            email,
            password,
            first_name,
            last_name,
        })
    },
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
