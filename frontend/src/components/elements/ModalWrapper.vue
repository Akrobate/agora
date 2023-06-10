<template>
    <v-dialog v-model="dialog" max-width="500px">
        <campaign-members-create-edit-element
            v-if="dialog"
            :campaign_id="campaign_id"
            :campaign_user_id="editing_campaign_user_id"
            @reset="close"
            @saved="saved"
        />
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
    },
  }
</script>
