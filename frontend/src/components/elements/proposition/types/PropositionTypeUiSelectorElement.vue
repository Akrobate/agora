<template>
    <div>

        <p class="body-1">Types de propositions</p>

        <v-radio-group v-model="proposition_type">
            <v-radio
                v-for="item in proposition_type_list"
                :key="item.type"
                :value="item.type"
            >
                <template v-slot:label>
                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">{{ item.label }}</div>
                        </template>
                        <span>{{ item.description }}</span>
                    </v-tooltip>
                </template>
            </v-radio>
        </v-radio-group>
    </div>
</template>

<script>

import { propositionTypes } from './propositionTypes'

export default {
    name: 'PropositionTypeUiSelectorElement',
    data: () => ({
        proposition_type_list: propositionTypes,
        proposition_type: null,
    }),
    props: [
        'value',
    ],
    watch: {
        proposition_type(value) {
            console.log('proposition_type changed', value)
        },
        value() {
            this.proposition_type = this.value
            console.log("value changed detected ", this.value)
        }
    },
    mounted() {
        this.proposition_type = this.value;
        console.log("mounted this.value ", this.value)
    }
    
}
</script>