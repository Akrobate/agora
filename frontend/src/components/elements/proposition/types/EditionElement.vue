<template>
    <div>
        
        <markdown-edition-element 
            v-model="payload"
            v-if="proposition_type === propositionType.MARKDOWN "/>
        
        <raw-string-edition-element
            v-model="payload"
            v-if="proposition_type === propositionType.RAW_STRING" />

    </div>
</template>

<script>

import MarkdownEditionElement from '@/components/elements/proposition/types/markdown/EditionElement'
import RawStringEditionElement from '@/components/elements/proposition/types/raw_string/EditionElement'
import { propositionType } from './propositionTypes'

export default {
    name: 'CreateEditElement',
    components: {
        MarkdownEditionElement,
        RawStringEditionElement,
    },
    props: {
        value: String,
        proposition_type: String,
    },
    data: () => ({
        propositionType,
        payload: '',
    }),
    mounted() {
        this.payload = this.value
    },
    watch: {
        payload() {
            this.$emit('input', this.payload)
        },
        value() {
            this.payload = this.value
        }
    },

}
</script>
