<template>
    <div v-html="payload_html" class="markdown_preview" />
</template>

<script>
import { marked } from 'marked'
export default {
    name: 'ViewElement',
    props: {
        payload: String,
    },
    data: () => ({
        payload_html: '',
    }),
    mounted() {
        this.updatePayloadHtml()
    },
    watch: {
        payload() {
            this.updatePayloadHtml()
        },
    },
    methods: {
        updatePayloadHtml() {
            if (this.payload === null || this.payload === undefined) {
                this.payload_html = ''
            } else {
                this.payload_html = marked.parse(this.payload)
            }
        },
    }
}
</script>