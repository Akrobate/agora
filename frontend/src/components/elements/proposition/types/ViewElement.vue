<template>
    <div>
        <markdown-view-element
            :payload="payload"
            v-if="proposition_type === propositionType.MARKDOWN "/>

        <raw-string-view-element
            :payload="payload"
            v-if="proposition_type === propositionType.RAW_STRING" />
    </div>
</template>

<script>

import MarkdownViewElement from '@/components/elements/proposition/types/markdown/ViewElement'
import RawStringViewElement from '@/components/elements/proposition/types/raw_string/ViewElement'
import { propositionType } from './propositionTypes'

export default {
    name: 'ViewElement',
    components: {
        MarkdownViewElement,
        RawStringViewElement,
    },
    props: {
        payload: String,
        proposition_type: String,
    },
    data: () => ({
        propositionType,
    }),
}
</script>
