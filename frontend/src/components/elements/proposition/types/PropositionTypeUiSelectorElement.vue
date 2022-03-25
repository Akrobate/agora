<template>
    <div>
        <v-card
            class="d-flex flex-row mb-6"
            flat
            tile
        >
            <v-card
                v-for="item in proposition_types"
                :key="item.type"
                class="pa-2"
                outlined
                tile
            >
                {{ item.label }}
            </v-card>

        </v-card>
    </div>
</template>

<script>

import { propositionTypes } from './propositionTypes'

export default {
    name: 'PropositionTypeUiSelectorElement',
    data: () => ({
        proposition_types: propositionTypes,
    }),
    props: {
        value: String,
    },
    mounted() {
        
    }
}
</script>