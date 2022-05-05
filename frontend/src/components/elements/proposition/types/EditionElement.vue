<template>
    <div>
        
        <markdown-edition-element 
            v-model="_payload"
            v-if="proposition_type === propositionType.MARKDOWN "/>
        
        <raw-string-edition-element
            v-model="_payload"
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
        payload: String,
        propotisiton_type: String,
    },
    data: () => ({
        propositionType,
        _payload: '',
    }),
    mounted() {
        this._payload = this.payload
    },

}
</script>
