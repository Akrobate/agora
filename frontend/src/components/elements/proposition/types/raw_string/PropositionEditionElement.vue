<template>
    <div>
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

// import store from '@/store'

export default {
    name: 'CreateEditElement',
    data: () => ({
        valid: true,
        payload: '',
        payload_rules: [
            v => !!v || 'Le contenu de la proposition est obligatoire',
        ],
    }),
    computed: { 
    },
    mounted() {
    },
    methods: {
    },
}
</script>
