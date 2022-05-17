
<template>
    <div>
        {{ payload_display }}
    </div>
</template>

<script>
export default {
    name: 'PreviewElement',
    props: {
        payload: String,
    },
    data: () => ({
        payload_display: '',
    }),
    mounted() {
        this.updatePayloadDisplay()
    },
    methods: {
        updatePayloadDisplay() {
            this.payload_display = this.payload
        },
    },
    watch: {
        payload() {
           this.updatePayloadDisplay()
        }
    },
}
</script>
