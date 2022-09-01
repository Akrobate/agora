<template>
    <div>
        <p class="body-1">{{ $t('title') }}</p>
        <v-radio-group v-model="proposition_type" :disabled="disabled">
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
        'disabled'
    ],
    watch: {
        proposition_type(value) {
            this.$emit('input', value)
        },
        value(value) {
            this.proposition_type = value
        }
    },    
}
</script>


<i18n locale='french'>
{
    "title": "Types de propositions"
}
</i18n>