<template>
    <div>
        <p>{{ $t('title') }}</p>
        <v-text-field
            v-model="payload"
            :counter="255"
            :rules="payload_rules"
            :label="this.$t('text_field_label')"
            required
        ></v-text-field>
    </div>
</template>

<script>

// @todo: finish i18n validation rules

export default {
    name: 'EditionElement',
    props: {
        value: String,
    },
    data: () => ({
        valid: true,
        payload: '',
        payload_rules: [
            v => !!v || 'Le contenu de la proposition est obligatoire',
        ],
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

<i18n locale='french'>
{
    "title": "Raw string",
    "text_field_label": "Contenu de la proposition"
}
</i18n>