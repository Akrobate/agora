<template>
    <div>
        <p>{{ $t('title') }}</p>
        <view-element :payload="payload" />

        <v-textarea
            v-model="payload"
            :label="this.$t('textarea_label')"
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

<i18n locale='fr'>
{
    "title": "Markdown preview",
    "textarea_label": "Edition de la proposition en markdown"
}
</i18n>
