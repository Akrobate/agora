<template>
    <div>
        <p>Markdown preview</p>
        <view-element :payload="payload" />

        <v-textarea
            v-model="payload"
            label="Edition de la proposition en markdown"
            required
        ></v-textarea>
    </div>
</template>

<script>

import ViewElement from './ViewElement.vue'

export default {
    name: 'EditionElement',
    components: {
        ViewElement,
    },
    props: {
        value: String,
    },
    data: () => ({
        payload: '',
    }),
    mounted() {
        this.updatePayload()
    },
    methods: {
        updatePayload() {
            this.payload = this.value
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
