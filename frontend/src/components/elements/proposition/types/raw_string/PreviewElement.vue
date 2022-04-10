<template>
    <div>
        {{ payload }}
    </div>
</template>

<script>
export default {
    name: 'PreviewElement',
    data: () => ({
        valid: true,
        payload: '',
    }),
}
</script>
