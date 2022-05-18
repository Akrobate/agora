<template>
    <div>
        <markdown-preview-element 
            :payload="value"
            v-if="proposition_type === propositionType.MARKDOWN "/>
        
        <raw-string-preview-element
            :payload="value"
            v-if="proposition_type === propositionType.RAW_STRING" />
    </div>
</template>

<script>

import MarkdownPreviewElement from '@/components/elements/proposition/types/markdown/PreviewElement'
import RawStringPreviewElement from '@/components/elements/proposition/types/raw_string/PreviewElement'
import { propositionType } from './propositionTypes'

export default {
    name: 'PreviewElement',
    components: {
        MarkdownPreviewElement,
        RawStringPreviewElement,
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
