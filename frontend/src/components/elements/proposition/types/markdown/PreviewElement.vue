<template>
    <div>
        {{ payload_html }}
    </div>
</template>

<script>
export default {
    name: 'PreviewElement',
    props: {
        payload: String,
    },
    data: () => ({
        payload_html: '',
    }),
    mounted() {

    },
    watch: {
        payload() {

        },
    },
}
</script>
