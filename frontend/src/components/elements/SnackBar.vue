<template>
    <div>

        <v-snackbar
            v-model="active"
            :timeout="timeout"
            :color="color"
            :left="true"
        >
            {{ text }}

            <template v-slot:action="{ attrs }" v-if="has_close_button">
                <v-btn
                    icon
                    text
                    v-bind="attrs"
                    @click="active = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>

        </v-snackbar>

    </div>
</template>


<script lang="js">

import { mapGetters, mapMutations } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            color: 'snack_bar_store/color',
            _active: 'snack_bar_store/active',
            text: 'snack_bar_store/text',
            timeout: 'snack_bar_store/timeout',
            has_close_button: 'snack_bar_store/hasCloseButton',
        }),
        active: {
            get() {
                return this._active
            },
            set(value) {
                return this.set_active(value)
            }
        }
    },
    methods: {
        ...mapMutations({
            set_active: 'snack_bar_store/set_active',
        })
    },
}
</script>