
<template>
    <div>
        {{ payload_preview }}
    </div>
</template>

<script>

import removeMarkdown from 'remove-markdown'

export default {
    name: 'PreviewElement',
    props: {
        payload: String,
    },
    data: () => ({
        payload_preview: '',
    }),
    mounted() {
        this.updatePayloadDisplay()
    },
    methods: {
        updatePayloadDisplay() {
            this.payload_preview = removeMarkdown(this.payload)
        },
    },
    watch: {
        payload() {
           this.updatePayloadDisplay()
        }
    },
}
</script>
