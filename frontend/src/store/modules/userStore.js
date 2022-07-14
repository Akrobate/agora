import {
  user_repository,
} from '@/repositories'


const state = () => ({
    user: {},
})

const getters = {
    getUser: (state) => state.user,
}

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

    getUser(_, user_id) {
        return user_repository.getUser(user_id)
    },

    updateUser(_, {
        id,
        last_name,
        first_name,
    }) {
        return user_repository.updateUser(id, {
            last_name,
            first_name,
        })
    },

    updateUserPassword(_, {
        id,
        old_password,
        new_password,
    }) {
        return user_repository.updateUserPassword(id, {
            old_password,
            new_password,
        })
    }

}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
