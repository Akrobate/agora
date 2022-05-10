<template>
    <div>
         <p>Raw string</p>
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
