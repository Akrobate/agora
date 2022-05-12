<template>
    <div>
        <p>Markdown preview</p>
        <div v-html="payload_html" class="markdown_preview" />
        <v-textarea
            v-model="payload"
            label="Edition de la proposition en markdown"
            required
        ></v-textarea>
    </div>
</template>

<script>

import { marked } from 'marked'

export default {
    name: 'EditionElement',
    props: {
        value: String,
    },
    data: () => ({
        valid: true,
        payload: '',
        payload_html: '',
    }),
    mounted() {
        this.updatePayload()
    },
    methods: {
        updatePayload() {
            this.payload = this.value
            if (this.value) {
                this.payload_html = marked.parse(this.value)
            }
        },
    },
    watch: {
        payload() {
            this.$emit('input', this.payload)
        },
        value() {
           this.updatePayload()
        }
    },
}
</script>
