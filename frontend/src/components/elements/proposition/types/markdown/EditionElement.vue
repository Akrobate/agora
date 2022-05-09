<template>
    <div>
        <p>Markdown</p>
        <v-text-field
            v-model="payload"
            :counter="255"
            :rules="payload_rules"
            label="Contenu de la proposition"
            required
        ></v-text-field>
    </div>
</template>

<script>

export default {
    name: 'EditionElementElement',
    data: () => ({
        valid: true,
        payload: '',
        payload_rules: [
            v => !!v || 'Le contenu de la proposition est obligatoire',
        ],
    }),
    mounted() {
        this._payload = this.value
    },
    watch: {
        _payload() {
            this.$emit('input', this._payload)
        },
        value() {
            this._payload = this.value
        }
    },
}
</script>
