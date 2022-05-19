<template>
    <div>
        {{ payload }}
    </div>
</template>

<script>
export default {
    name: 'PreviewElement',
    props: {
        payload: String,
    },
}
</script>
