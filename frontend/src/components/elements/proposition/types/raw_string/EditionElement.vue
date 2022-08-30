<template>
    <div>
        <p>{{ $t('title') }}</p>
        <v-text-field
            v-model="payload"
            :counter="255"
            :rules="[rules.required]"
            :label="this.$t('text_field_label')"
            required
        ></v-text-field>
    </div>
</template>

<script>

export default {
    name: 'EditionElement',
    props: {
        value: String,
    },
    data: () => ({
        valid: true,
        payload: '',
        rules: {
            required: (value) => !!value || this.$t('validation_rule_required'),
        },
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
    "text_field_label": "Contenu de la proposition",
    "validation_rule_required": "Ce champ est obligatoire"
}
</i18n>