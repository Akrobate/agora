<template>
    <v-dialog v-model="dialog" max-width="500px">
        <slot></slot>
    </v-dialog>
</template>

<script>

export default {
    name: 'ModalWrapper',
    props: [
        'campaign_id',
    ],
    data: () => ({
        dialog: false,
    }),
    computed: {
        getStatus() {
            return this.dialog
        },
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
    },
    async mounted () {
    },
    methods: {
        close () {
            this.dialog = false
        },
        open() {
            this.dialog = true
        }
    },
  }
</script>
